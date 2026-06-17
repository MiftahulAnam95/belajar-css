window.CSSLabApp = (() => {
  const data = window.CSSLabData;
  const progress = window.CSSLabProgress;
  let currentQuiz = { index: 0, score: 0, answered: false, recorded: false };
  let activeRecallId = data.recallChallenges[0].id;
  let activeDebugId = data.debugChallenges[0].id;
  const debugAttempts = {};
  const LESSON_RECALL_STORAGE_KEY = "css-beginner-lab-lesson-recall-v1";
  const rootPath = document.body.dataset.root || "";
  let toastInstance;
  let editorColorPicker;
  let editorTagSuggest;
  let editorUndoHistory;

  const getElement = (id) => document.getElementById(id);

  const escapeHTML = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const loadLessonRecallAnswers = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(LESSON_RECALL_STORAGE_KEY) || "{}");
      if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
      return Object.fromEntries(
        Object.entries(saved).filter(([id, answer]) => data.lessons.some((lesson) => lesson.id === id) && typeof answer === "string")
      );
    } catch (error) {
      console.warn("Jawaban recall materi tidak dapat dibaca.", error);
      return {};
    }
  };

  const lessonRecallAnswers = loadLessonRecallAnswers();

  const saveLessonRecallAnswers = () => {
    try {
      localStorage.setItem(LESSON_RECALL_STORAGE_KEY, JSON.stringify(lessonRecallAnswers));
      return true;
    } catch (error) {
      console.warn("Jawaban recall materi tidak dapat disimpan.", error);
      return false;
    }
  };

  const copyText = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  };

  const highlightTag = (tag) => {
    const parsed = tag.match(/^(<\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?>)$/);
    if (!parsed) return escapeHTML(tag);
    const [, opening, name, attributeText, closing] = parsed;
    let highlightedAttributes = "";
    let cursor = 0;
    const attributePattern = /([^\s=]+)(\s*=\s*)("[^"]*"|'[^']*'|[^\s>]+)/g;
    let attributeMatch;

    while ((attributeMatch = attributePattern.exec(attributeText))) {
      highlightedAttributes += escapeHTML(attributeText.slice(cursor, attributeMatch.index));
      highlightedAttributes += `<span class="tok-attr">${escapeHTML(attributeMatch[1])}</span>`;
      highlightedAttributes += `<span class="tok-symbol">${escapeHTML(attributeMatch[2])}</span>`;
      highlightedAttributes += `<span class="tok-string">${escapeHTML(attributeMatch[3])}</span>`;
      cursor = attributePattern.lastIndex;
    }

    highlightedAttributes += escapeHTML(attributeText.slice(cursor));
    return `<span class="tok-symbol">${escapeHTML(opening)}</span><span class="tok-tag">${escapeHTML(name)}</span>${highlightedAttributes}<span class="tok-symbol">${escapeHTML(closing)}</span>`;
  };

  const highlightHTML = (code = "") => {
    const tokenPattern = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>/g;
    let output = "";
    let cursor = 0;
    let match;

    while ((match = tokenPattern.exec(code))) {
      output += `<span class="tok-text">${escapeHTML(code.slice(cursor, match.index))}</span>`;
      output += match[0].startsWith("<!--") ? `<span class="tok-comment">${escapeHTML(match[0])}</span>` : highlightTag(match[0]);
      cursor = tokenPattern.lastIndex;
    }

    output += `<span class="tok-text">${escapeHTML(code.slice(cursor))}</span>`;
    return output;
  };

  const getCodeIcon = (filename = "") => {
    if (filename.endsWith(".css")) return "bi-filetype-css";
    if (filename.endsWith(".txt")) return "bi-file-earmark-text";
    return "bi-filetype-html";
  };

  const renderCodeBlock = (code, filename = "index.html") => {
    const lines = String(code).split("\n").map((line) => highlightHTML(line));
    return `
      <div class="code-card">
        <div class="code-card-head">
          <span class="code-card-title"><i class="bi ${getCodeIcon(filename)}"></i> ${escapeHTML(filename)}</span>
          <button class="copy-code" type="button" data-copy-code="${encodeURIComponent(code)}">
            <i class="bi bi-copy"></i> Salin kode
          </button>
        </div>
        <div class="code-lines">
          ${lines
            .map(
              (line, index) => `
                <div class="code-line">
                  <span class="line-no">${index + 1}</span>
                  <span class="line-code">${line || " "}</span>
                </div>`
            )
            .join("")}
        </div>
      </div>`;
  };

  const buildPreviewDocument = (code = "", css = "") => {
    const isFullDocument = /<html[\s>]/i.test(code);
    if (isFullDocument) {
      if (!css) return code;
      const styleBlock = `<style>${css}</style>`;
      return /<\/head>/i.test(code) ? code.replace(/<\/head>/i, `${styleBlock}</head>`) : code.replace(/<body[\s>]/i, `${styleBlock}$&`);
    }
    return `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        color: #172033;
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 18px;
      }
      img {
        border-radius: 8px;
        display: block;
        max-width: 100%;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th,
      td {
        border: 1px solid #d7deea;
        padding: 8px;
        text-align: left;
      }
      th {
        background: #eef2ff;
      }
      input,
      textarea,
      button {
        display: block;
        font: inherit;
        margin: 6px 0 12px;
        padding: 8px;
      }
      ${css}
    </style>
  </head>
  <body>${code}</body>
</html>`;
  };

  const renderLessonCodePreview = (item) => `
    <div class="lesson-code-preview">
      <div class="lesson-preview-label"><i class="bi bi-eye"></i> Preview hasil HTML + CSS</div>
      <iframe
        class="lesson-preview-frame"
        title="Preview contoh kode ${escapeHTML(item.title)}"
        sandbox="allow-same-origin"
        loading="lazy"
        srcdoc="${escapeHTML(buildPreviewDocument(item.previewHtml || item.html || item.code, item.previewCss || item.css || ""))}"
      ></iframe>
    </div>`;

  const renderLessonCodeBlocks = (item) => {
    const blocks = [];
    if (item.html) blocks.push(renderCodeBlock(item.html, "index.html"));
    if (item.css) blocks.push(renderCodeBlock(item.css, item.filename || "style.css"));
    if (!blocks.length) blocks.push(renderCodeBlock(item.code, item.filename));
    return blocks.join('<div class="code-block-gap"></div>');
  };

  const showToast = (message) => {
    const toastElement = getElement("appToastElement");
    const toastMessage = getElement("toastMessage");
    if (!toastElement || !toastMessage || !window.bootstrap) return;
    toastMessage.textContent = message;
    toastInstance ||= bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 2800 });
    toastInstance.show();
  };

  const showBadgeToasts = (unlocked) => {
    if (unlocked?.length) showToast(`Badge baru: ${unlocked.join(", ")}`);
  };

  const lessonHref = (id) => `${rootPath}materi/${id}.html`;

  const getLessonPhase = (lessonIndex) =>
    data.learningPhases.find((phase) => lessonIndex >= phase.lessonStart && lessonIndex <= phase.lessonEnd) || data.learningPhases[0];

  const getPhaseLessons = (phase) => data.lessons.slice(phase.lessonStart, phase.lessonEnd + 1);

  const getPhaseProgress = (phase) => {
    const phaseLessons = getPhaseLessons(phase);
    const completed = phaseLessons.filter((lesson) => progress.state.completedLessons.includes(lesson.id)).length;
    return {
      completed,
      total: phaseLessons.length,
      percentage: phaseLessons.length ? Math.round((completed / phaseLessons.length) * 100) : 0
    };
  };

  const getNextLesson = () => data.lessons.find((lesson) => !progress.state.completedLessons.includes(lesson.id));

  const renderStarterFlow = () => {
    const target = getElement("starterFlow");
    if (!target) return;
    target.innerHTML = data.starterFlow
      .map(
        (item, index) => `
          <article class="starter-step">
            <span class="starter-step-number">${index + 1}</span>
            <i class="bi ${item.icon}"></i>
            <div>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.description)}</p>
            </div>
          </article>`
      )
      .join("");
  };

  const renderPhaseMap = (targetId = "phaseMap") => {
    const target = getElement(targetId);
    if (!target) return;
    target.innerHTML = data.learningPhases
      .map((phase) => {
        const phaseLessons = getPhaseLessons(phase);
        const firstIncomplete = phaseLessons.find((lesson) => !progress.state.completedLessons.includes(lesson.id)) || phaseLessons[0];
        const phaseProgress = getPhaseProgress(phase);
        const completed = phaseProgress.completed === phaseProgress.total;
        return `
          <article class="phase-card ${completed ? "completed" : ""}">
            <div class="phase-card-top">
              <span class="phase-icon"><i class="bi ${phase.icon}"></i></span>
              <span class="mini-label">${escapeHTML(phase.label)}</span>
            </div>
            <h3>${escapeHTML(phase.title)}</h3>
            <p>${escapeHTML(phase.description)}</p>
            <div class="phase-outcome"><strong>Hasil akhir:</strong> ${escapeHTML(phase.outcome)}</div>
            <div class="phase-progress" aria-label="Progress ${escapeHTML(phase.title)}">
              <span style="width: ${phaseProgress.percentage}%"></span>
            </div>
            <div class="phase-card-bottom">
              <span>${phaseProgress.completed}/${phaseProgress.total} selesai</span>
              <a href="${lessonHref(firstIncomplete.id)}">${completed ? "Ulangi fase" : "Mulai fase"}</a>
            </div>
          </article>`;
      })
      .join("");
  };

  const renderHomeDemo = (id = data.homeDemos[0]?.id) => {
    const tabs = getElement("homeDemoTabs");
    const code = getElement("homeDemoCode");
    const preview = getElement("homeDemoPreview");
    const explain = getElement("homeDemoExplain");
    const task = getElement("homeDemoTask");
    if (!tabs || !code || !preview || !explain || !task) return;

    const demo = data.homeDemos.find((item) => item.id === id) || data.homeDemos[0];
    tabs.innerHTML = data.homeDemos
      .map(
        (item) => `
          <button class="demo-tab ${item.id === demo.id ? "active" : ""}" type="button" data-home-demo="${item.id}">
            ${escapeHTML(item.label)}
          </button>`
      )
      .join("");
    code.innerHTML = renderCodeBlock(demo.css, "style.css");
    preview.srcdoc = buildPreviewDocument(demo.html, demo.css);
    explain.innerHTML = `<strong>${escapeHTML(demo.title)}</strong><span>${escapeHTML(demo.explanation)}</span>`;
    task.innerHTML = `<i class="bi bi-pencil-square"></i><span>${escapeHTML(demo.task)}</span>`;
  };

  const renderHomeDashboard = () => {
    const nextLesson = getNextLesson() || data.lessons[0];
    const completed = progress.state.completedLessons.length;
    const percentage = progress.getTotalProgress();
    const homeProgressPercent = getElement("homeProgressPercent");
    const homeProgressBar = getElement("homeProgressBar");
    const homeNextLessonTitle = getElement("homeNextLessonTitle");
    const homeNextLessonMeta = getElement("homeNextLessonMeta");
    const homeContinueLink = getElement("homeContinueLink");
    const homeCompletedCount = getElement("homeCompletedCount");
    const homeCurrentPhase = getElement("homeCurrentPhase");

    if (homeProgressPercent) homeProgressPercent.textContent = `${percentage}%`;
    if (homeProgressBar) homeProgressBar.style.width = `${percentage}%`;
    if (homeNextLessonTitle) homeNextLessonTitle.textContent = nextLesson.title;
    if (homeNextLessonMeta) {
      const nextIndex = data.lessons.findIndex((lesson) => lesson.id === nextLesson.id);
      const phase = getLessonPhase(nextIndex);
      homeNextLessonMeta.textContent = `${phase.title} - ${nextLesson.duration}`;
    }
    if (homeContinueLink) homeContinueLink.href = lessonHref(nextLesson.id);
    if (homeCompletedCount) homeCompletedCount.textContent = `${completed}/${data.lessons.length}`;
    if (homeCurrentPhase) {
      const nextIndex = data.lessons.findIndex((lesson) => lesson.id === nextLesson.id);
      homeCurrentPhase.textContent = getLessonPhase(nextIndex).title;
    }
  };

  const renderLessonNavigation = (lessonIndex, placement = "top") => {
    const previousLesson = data.lessons[lessonIndex - 1];
    const nextLesson = data.lessons[lessonIndex + 1];
    const previousHref = previousLesson ? lessonHref(previousLesson.id) : `${rootPath}materi.html`;
    const nextHref = nextLesson ? lessonHref(nextLesson.id) : `${rootPath}materi.html`;
    const previousTitle = previousLesson ? previousLesson.title : "Kembali ke daftar materi";
    const nextTitle = nextLesson ? nextLesson.title : "Kembali ke daftar materi";

    return `
      <nav class="lesson-nav lesson-nav-${placement}" aria-label="Navigasi materi">
        <a class="lesson-nav-link lesson-nav-prev" href="${previousHref}">
          <i class="bi bi-arrow-left"></i>
          <span>
            <small>${previousLesson ? "Materi sebelumnya" : "Daftar materi"}</small>
            <strong>${escapeHTML(previousTitle)}</strong>
          </span>
        </a>
        <a class="lesson-nav-link lesson-nav-next" href="${nextHref}">
          <span>
            <small>${nextLesson ? "Materi berikutnya" : "Daftar materi"}</small>
            <strong>${escapeHTML(nextTitle)}</strong>
          </span>
          <i class="bi bi-arrow-right"></i>
        </a>
      </nav>`;
  };

  const renderLessons = () => {
    const lessonGrid = getElement("lessonGrid");
    if (!lessonGrid) return;
    const completed = progress.state.completedLessons;
    lessonGrid.innerHTML = data.lessons
      .map((item, index) => {
        const phase = getLessonPhase(index);
        const done = completed.includes(item.id);
        return `
          <a class="lesson-card ${completed.includes(item.id) ? "completed" : ""}" href="${lessonHref(item.id)}" data-open-lesson="${item.id}">
            ${done ? '<i class="bi bi-check-circle-fill complete-mark"></i>' : ""}
            <span class="lesson-stage">${escapeHTML(phase.title)}</span>
            <span class="lesson-icon"><i class="bi ${item.icon}"></i></span>
            <span class="lesson-number d-block mt-3">Materi ${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHTML(item.title)}</h3>
            <p class="lesson-card-summary">${escapeHTML(item.overview)}</p>
            <div class="lesson-card-footer">
              <span><i class="bi bi-clock"></i> ${escapeHTML(item.duration)}</span>
              <span><i class="bi ${done ? "bi-check-circle-fill" : "bi-pencil-square"}"></i> ${done ? "Selesai" : "Latihan + quiz"}</span>
            </div>
          </a>`;
      })
      .join("");
    const roadmapCompleted = getElement("roadmapCompleted");
    if (roadmapCompleted) roadmapCompleted.textContent = `${completed.length}/${data.lessons.length}`;
  };

  const renderLessonQuiz = (item) => `
    <div class="quiz-options" data-lesson-quiz="${item.id}">
      ${item.quiz.options
        .map(
          (option, index) => `
            <button class="quiz-option" type="button" data-lesson-answer="${index}">
              ${escapeHTML(option)}
            </button>`
        )
        .join("")}
    </div>
    <div class="quiz-feedback d-none" data-lesson-feedback></div>`;

  const getNextLearningPanel = (id) => {
    const lessonIndex = data.lessons.findIndex((item) => item.id === id);
    const nextLesson = data.lessons[lessonIndex + 1];
    if (!nextLesson) {
      return `
        <div class="next-learning-panel" id="nextLearningPanel">
          <p><strong>Semua materi utama selesai.</strong> Lanjutkan mini project untuk memperkuat pemahaman.</p>
          <a class="btn btn-primary" href="${rootPath}projects.html"><i class="bi bi-rocket-takeoff"></i> Buka mini project</a>
        </div>`;
    }
    return `
        <div class="next-learning-panel" id="nextLearningPanel">
          <p><strong>Materi ini selesai.</strong> Kamu bisa lanjut ke ${escapeHTML(nextLesson.title)} atau kembali ke daftar.</p>
        <a class="btn btn-primary" href="${lessonHref(nextLesson.id)}">Lanjut materi berikutnya</a>
        <a class="btn btn-soft" href="${rootPath}materi.html">Kembali ke daftar</a>
      </div>`;
  };

  const renderLessonLearningLoop = (item) => `
    <section class="detail-block learning-loop-block">
      <h3><i class="bi bi-signpost-2"></i> Cara belajar materi ini</h3>
      <div class="learning-loop-grid">
        <article>
          <span>1</span>
          <strong>Pahami masalahnya</strong>
          <p>${escapeHTML(item.problem)}</p>
        </article>
        <article>
          <span>2</span>
          <strong>Lihat perubahan visual</strong>
          <p>Perhatikan aturan CSS mana yang mengubah warna, jarak, ukuran, atau layout.</p>
        </article>
        <article>
          <span>3</span>
          <strong>Ubah satu property</strong>
          <p>${escapeHTML(item.exercise)}</p>
        </article>
        <article>
          <span>4</span>
          <strong>Cek dengan bahasa sendiri</strong>
          <p>${escapeHTML(item.checkpoint)}</p>
        </article>
      </div>
    </section>`;

  const renderLessonCodeBridge = (item) => `
    <div class="code-bridge-grid">
      <div>
        <div class="bridge-label"><i class="bi bi-keyboard"></i> Yang kamu tulis</div>
        ${renderLessonCodeBlocks(item)}
      </div>
      <div>
        <div class="bridge-label"><i class="bi bi-window"></i> Yang browser tampilkan</div>
        ${renderLessonCodePreview(item)}
      </div>
    </div>`;

  const renderLessonDetail = (id) => {
    const item = data.lessons.find((lesson) => lesson.id === id);
    const lessonDetail = getElement("lessonDetail");
    if (!item || !lessonDetail) return;
    progress.setLastLesson(id);
    const lessonIndex = data.lessons.findIndex((lesson) => lesson.id === id);
    const isCompleted = progress.state.completedLessons.includes(id);
    const phase = getLessonPhase(lessonIndex);

    lessonDetail.innerHTML = `
      <article class="lesson-detail-card">
        <header class="lesson-detail-head">
          <div class="d-flex justify-content-between gap-3">
            <div>
              <span class="eyebrow">Materi ${String(lessonIndex + 1).padStart(2, "0")} &middot; ${escapeHTML(phase.title)} &middot; ${escapeHTML(item.duration)}</span>
              <h2 class="mt-2 mb-1">${escapeHTML(item.title)}</h2>
              <p class="mb-0">${escapeHTML(item.goal)}</p>
            </div>
            <button class="icon-btn flex-shrink-0" type="button" data-close-lesson aria-label="Tutup materi">
              <i class="bi bi-arrow-left"></i>
            </button>
          </div>
          ${renderLessonNavigation(lessonIndex, "top")}
        </header>
        <div class="lesson-detail-body">
          <section class="detail-block beginner-start-block">
            <span class="beginner-label"><i class="bi bi-signpost-split"></i> Mulai dari sini</span>
            <h3 class="mt-2"><i class="bi bi-person-walking"></i> Sebelum memulai materi ini</h3>
            <p>${escapeHTML(item.prerequisite)}</p>
            <div class="beginner-overview">
              <strong>Fokus belajarmu</strong>
              <p class="mb-0">${escapeHTML(item.overview)}</p>
            </div>
          </section>
          ${renderLessonLearningLoop(item)}
          <section class="detail-block">
            <h3><i class="bi bi-flag"></i> Tujuan belajar</h3>
            <p class="mb-0">${escapeHTML(item.goal)}</p>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-chat-square-heart"></i> Masalah sehari-hari</h3>
            <p class="mb-0">${escapeHTML(item.problem)}</p>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-lightbulb"></i> Analogi konsep</h3>
            <div class="analogy-box"><p class="mb-0">${escapeHTML(item.analogy)}</p></div>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-book"></i> Penjelasan sederhana</h3>
            <p class="mb-0">${escapeHTML(item.explanation)}</p>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-list-check"></i> Ikuti langkah demi langkah</h3>
            <ol class="beginner-steps">
              ${item.steps.map((step) => `<li><span>${escapeHTML(step)}</span></li>`).join("")}
            </ol>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-translate"></i> Istilah penting untuk pemula</h3>
            <div class="term-grid">
              ${item.terms
                .map(
                  ({ term, meaning }) => `
                    <article class="term-card">
                      <strong>${escapeHTML(term)}</strong>
                      <p>${escapeHTML(meaning)}</p>
                    </article>`
                )
                .join("")}
            </div>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-code-square"></i> Contoh kode HTML + CSS</h3>
            <p class="mini-guidance">Baca dari kiri ke kanan: HTML memberi isi, CSS memberi tampilan, preview menunjukkan hasil akhirnya.</p>
            ${renderLessonCodeBridge(item)}
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-list-ol"></i> Penjelasan kode per baris</h3>
            <div class="line-notes">
              ${item.lineNotes.map((note, index) => `<div class="line-note"><strong>${index + 1}.</strong> ${escapeHTML(note)}</div>`).join("")}
            </div>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-pencil-square"></i> Latihan kecil</h3>
            <div class="practice-box"><p class="mb-0">${escapeHTML(item.exercise)}</p></div>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-exclamation-triangle"></i> Kesalahan yang wajar terjadi</h3>
            <div class="common-mistakes">
              ${item.commonMistakes.map((mistake) => `<div><i class="bi bi-x-circle"></i><span>${escapeHTML(mistake)}</span></div>`).join("")}
            </div>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-check2-square"></i> Cek sebelum lanjut</h3>
            <div class="checkpoint-box"><p class="mb-0">${escapeHTML(item.checkpoint)}</p></div>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-arrow-repeat"></i> Recall challenge</h3>
            <p>${escapeHTML(item.recall)}</p>
            <form data-lesson-recall-form="${item.id}">
              <label class="debug-field-label" for="lessonRecallAnswer">Tulis jawabanmu dengan bahasa sendiri.</label>
              <textarea class="recall-input" id="lessonRecallAnswer" name="answer" placeholder="Tulis jawaban recall di sini..." required>${escapeHTML(lessonRecallAnswers[item.id] || "")}</textarea>
              <button class="btn btn-soft mt-3" type="submit"><i class="bi bi-floppy"></i> Simpan jawaban</button>
            </form>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-bug"></i> Concept debugging</h3>
            <p><strong>Pertanyaan:</strong> ${escapeHTML(item.debug.question)}</p>
            <button class="btn btn-soft me-2" type="button" data-toggle-target="lessonHint">Lihat hint</button>
            <button class="btn btn-soft" type="button" data-toggle-target="lessonDebugSolution">Lihat pembahasan</button>
            <div class="hint-box mt-3 d-none" id="lessonHint"><p class="mb-0">${escapeHTML(item.debug.hint)}</p></div>
            <div class="explanation-box mt-3 d-none" id="lessonDebugSolution"><p class="mb-0">${escapeHTML(item.debug.solution)}</p></div>
          </section>
          <section class="detail-block">
            <h3><i class="bi bi-patch-question"></i> Quiz singkat</h3>
            <p>${escapeHTML(item.quiz.question)}</p>
            ${renderLessonQuiz(item)}
          </section>
          <section class="detail-block">
            <div class="lesson-actions">
              <button class="btn btn-primary" type="button" data-complete-lesson="${item.id}">
                <i class="bi bi-check2-circle"></i> ${isCompleted ? "Sudah selesai" : "Tandai Selesai"}
              </button>
              <a class="btn btn-soft" href="${rootPath}editor.html" target="_blank" rel="noopener noreferrer"><i class="bi bi-code-slash"></i> Praktikkan di editor</a>
            </div>
            ${isCompleted ? getNextLearningPanel(item.id) : '<div id="nextLearningPanel"></div>'}
          </section>
          ${renderLessonNavigation(lessonIndex, "bottom")}
        </div>
      </article>`;

    getElement("lessonDetailSection")?.classList.remove("d-none");
  };

  const openLesson = (id, updateHash = true) => {
    if (!getElement("lessonDetail") && document.body.dataset.page === "materi") {
      window.location.href = lessonHref(id);
      return;
    }
    renderLessonDetail(id);
    if (updateHash) history.replaceState(null, "", `#${id}`);
    getElement("lessonDetailSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeLesson = () => {
    window.location.href = `${rootPath}materi.html`;
  };

  const showNextLearningPanel = (id) => {
    const target = getElement("nextLearningPanel");
    if (target) target.outerHTML = getNextLearningPanel(id);
  };

  const renderQuiz = () => {
    const quizShell = getElement("quizShell");
    if (!quizShell) return;
    const total = data.quizQuestions.length;
    if (currentQuiz.index >= total) {
      const percentage = Math.round((currentQuiz.score / total) * 100);
      const result = currentQuiz.recorded ? { unlocked: [] } : progress.recordQuiz(percentage);
      currentQuiz.recorded = true;
      updateProgress();
      showBadgeToasts(result.unlocked);
      quizShell.innerHTML = `
        <div class="quiz-head">
          <span class="eyebrow"><i class="bi bi-check-circle"></i> Hasil quiz</span>
        </div>
        <div class="quiz-body">
          <h2>Skor kamu ${percentage}%</h2>
          <p>Kamu menjawab ${currentQuiz.score} dari ${total} pertanyaan dengan benar.</p>
          <button class="btn btn-primary" type="button" data-retry-quiz><i class="bi bi-arrow-repeat"></i> Ulangi quiz</button>
          <a class="btn btn-soft ms-sm-2 mt-2 mt-sm-0" href="progress.html"><i class="bi bi-graph-up-arrow"></i> Lihat progress</a>
        </div>`;
      return;
    }

    const item = data.quizQuestions[currentQuiz.index];
    quizShell.innerHTML = `
      <div class="quiz-head">
        <span class="eyebrow">Pertanyaan ${currentQuiz.index + 1} dari ${total}</span>
      </div>
      <div class="quiz-body">
        <h2>${escapeHTML(item.question)}</h2>
        <div class="quiz-options">
          ${item.options
            .map(
              (option, index) => `
                <button class="quiz-option" type="button" data-quiz-answer="${index}">
                  ${escapeHTML(option)}
                </button>`
            )
            .join("")}
        </div>
        <div class="quiz-feedback d-none" id="quizFeedback"></div>
      </div>`;
  };

  const answerQuiz = (selected) => {
    if (currentQuiz.answered) return;
    const item = data.quizQuestions[currentQuiz.index];
    const correct = selected === item.answer;
    currentQuiz.answered = true;
    if (correct) currentQuiz.score += 1;

    document.querySelectorAll("[data-quiz-answer]").forEach((button, index) => {
      button.disabled = true;
      if (index === item.answer) button.classList.add("correct");
      if (index === selected && !correct) button.classList.add("wrong");
    });

    const feedback = getElement("quizFeedback");
    if (!feedback) return;
    const lastQuestion = currentQuiz.index === data.quizQuestions.length - 1;
    feedback.classList.remove("d-none");
    feedback.innerHTML = `
      <strong>${correct ? "Benar." : "Belum tepat."}</strong> ${escapeHTML(item.explanation)}
      <div class="mt-3">
        <button class="btn btn-primary" type="button" data-next-quiz>
          ${lastQuestion ? "Lihat hasil" : "Pertanyaan berikutnya"} <i class="bi bi-arrow-right"></i>
        </button>
      </div>`;
  };

  const renderRecallChallenge = (id = activeRecallId) => {
    activeRecallId = id;
    const list = getElement("recallList");
    const detail = getElement("recallDetail");
    if (!list || !detail) return;
    const completed = progress.state.completedRecall;
    list.innerHTML = data.recallChallenges
      .map(
        (item, index) => `
          <button class="challenge-list-btn ${item.id === id ? "active" : ""} ${completed.includes(item.id) ? "completed" : ""}" type="button" data-open-recall="${item.id}">
            <i class="bi ${completed.includes(item.id) ? "bi-check-circle-fill" : item.icon}"></i>
            <span>${String(index + 1).padStart(2, "0")}. ${escapeHTML(item.title)}</span>
          </button>`
      )
      .join("");

    const item = data.recallChallenges.find((challenge) => challenge.id === id) || data.recallChallenges[0];
    detail.innerHTML = `
      <span class="eyebrow"><i class="bi ${item.icon}"></i> Recall challenge</span>
      <h2>${escapeHTML(item.title)}</h2>
      <p>${escapeHTML(item.question)}</p>
      <textarea class="recall-input" placeholder="Jawab dulu dengan bahasa sendiri..."></textarea>
      <div class="lesson-actions mt-3">
        <button class="btn btn-soft" type="button" data-show-recall-answer><i class="bi bi-eye"></i> Lihat pembahasan</button>
        <button class="btn btn-primary" type="button" data-complete-recall="${item.id}">
          <i class="bi bi-check2-circle"></i> ${completed.includes(item.id) ? "Sudah selesai" : "Tandai selesai"}
        </button>
      </div>
      <div class="explanation-box mt-3 d-none" id="recallAnswer">
        <p class="mb-0">${escapeHTML(item.answer)}</p>
      </div>`;
  };

  const renderDebuggingChallenge = (id = activeDebugId) => {
    activeDebugId = id;
    const list = getElement("debugList");
    const detail = getElement("debugDetail");
    if (!list || !detail) return;
    const completed = progress.state.completedDebug;
    list.innerHTML = data.debugChallenges
      .map(
        (item, index) => `
          <button class="challenge-list-btn ${item.id === id ? "active" : ""} ${completed.includes(item.id) ? "completed" : ""}" type="button" data-open-debug="${item.id}">
            <i class="bi ${completed.includes(item.id) ? "bi-check-circle-fill" : "bi-bug"}"></i>
            <span>${String(index + 1).padStart(2, "0")}. ${escapeHTML(item.title)}</span>
          </button>`
      )
      .join("");

    const item = data.debugChallenges.find((challenge) => challenge.id === id) || data.debugChallenges[0];
    const attempt = debugAttempts[id] || { analysis: "", code: "", submitted: false };
    detail.innerHTML = `
      <span class="eyebrow"><i class="bi bi-bug"></i> Debugging CSS</span>
      <h2>${escapeHTML(item.title)}</h2>
      <div class="challenge-meta">
        <span>${escapeHTML(item.level)}</span>
        <span>${completed.includes(item.id) ? "Selesai" : "Belum selesai"}</span>
      </div>
      <p>${escapeHTML(item.error)}</p>
      ${renderCodeBlock(item.brokenCode, "kode-rusak.html")}
      <form class="mt-3" data-debug-form="${item.id}">
        <label class="debug-field-label" for="debugAnalysis">Apa penyebab bug ini?</label>
        <textarea class="debug-analysis-input" id="debugAnalysis" name="analysis" required>${escapeHTML(attempt.analysis)}</textarea>
        <label class="debug-field-label mt-3" for="debugCode">Coba tulis kode perbaikannya.</label>
        <textarea class="debug-code-input" id="debugCode" name="code" required>${escapeHTML(attempt.code)}</textarea>
        <div class="lesson-actions mt-3">
          <button class="btn btn-primary" type="submit"><i class="bi bi-send"></i> Submit jawaban</button>
          <button class="btn btn-soft" type="button" data-show-debug-hint><i class="bi bi-lightbulb"></i> Lihat hint</button>
        </div>
      </form>
      <div class="hint-box mt-3 d-none" id="debugHint">
        <p class="mb-0">${escapeHTML(item.hint)}</p>
      </div>
      <div class="${attempt.submitted ? "" : "d-none"}" id="debugAnswer">
        <div class="explanation-box mt-3">
          <p><strong>Pembahasan:</strong> ${escapeHTML(item.explanation)}</p>
        </div>
        <div class="mt-3">
          ${renderCodeBlock(item.fixedCode, "kode-benar.html")}
        </div>
        <button class="btn btn-primary mt-3" type="button" data-complete-debug="${item.id}">
          <i class="bi bi-check2-circle"></i> ${completed.includes(item.id) ? "Sudah selesai" : "Tandai selesai"}
        </button>
      </div>`;
  };

  const renderProjectExample = (example, projectIndex = 0) => {
    let content = "";

    if (example.type === "profile") {
      content = `
        <div class="example-profile">
          <div class="example-avatar">${escapeHTML(example.name.charAt(0))}</div>
          <strong>${escapeHTML(example.name)}</strong>
          <small>${escapeHTML(example.role)}</small>
          <p>${escapeHTML(example.description)}</p>
          <div class="example-chip-row">${example.hobbies.map((hobby) => `<span>${escapeHTML(hobby)}</span>`).join("")}</div>
          <span class="example-button">${escapeHTML(example.link)}</span>
        </div>`;
    }

    if (example.type === "landing") {
      content = `
        <div class="example-landing">
          <div class="example-mini-nav">
            <strong>${escapeHTML(example.brand)}</strong>
            <span>Fitur</span>
            <span>Daftar</span>
          </div>
          <div class="example-landing-body">
            <small>KELAS ONLINE UNTUK PEMULA</small>
            <strong>${escapeHTML(example.headline)}</strong>
            <p>${escapeHTML(example.description)}</p>
            <span class="example-button">${escapeHTML(example.cta)}</span>
          </div>
        </div>`;
    }

    if (example.type === "form") {
      content = `
        <div class="example-form">
          <strong>${escapeHTML(example.title)}</strong>
          <small>Lengkapi data diri kamu di bawah ini.</small>
          ${example.fields
            .map(
              (field) => `
                <label>
                  <span>${escapeHTML(field)}</span>
                  <i></i>
                </label>`
            )
            .join("")}
          <span class="example-button">${escapeHTML(example.button)}</span>
        </div>`;
    }

    if (example.type === "table") {
      content = `
        <div class="example-table">
          <strong>${escapeHTML(example.title)}</strong>
          <table>
            <thead>
              <tr>${example.columns.map((column) => `<th>${escapeHTML(column)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${example.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>`;
    }

    if (example.type === "article") {
      content = `
        <div class="example-article">
          <div class="example-article-head">
            <strong>${escapeHTML(example.brand)}</strong>
            <span>${example.nav.map((item) => escapeHTML(item)).join(" &nbsp; ")}</span>
          </div>
          <small>BELAJAR WEB</small>
          <strong>${escapeHTML(example.title)}</strong>
          <p>${escapeHTML(example.description)}</p>
          <span class="example-button">${escapeHTML(example.related)}</span>
        </div>`;
    }

    if (example.type === "dashboard") {
      const progressValue = Math.max(0, Math.min(100, Number(example.progress) || 0));
      content = `
        <div class="example-dashboard">
          <div class="example-dashboard-head">
            <span>
              <small>${escapeHTML(example.subtitle)}</small>
              <strong>${escapeHTML(example.title)}</strong>
            </span>
            <i>${progressValue}%</i>
          </div>
          <div class="example-dashboard-stats">
            ${example.stats.map((stat) => `<span><b>${escapeHTML(stat.value)}</b>${escapeHTML(stat.label)}</span>`).join("")}
          </div>
          <div class="example-progress-line"><span style="width: ${progressValue}%"></span></div>
          <ul>${example.tasks.map((task) => `<li>${escapeHTML(task)}</li>`).join("")}</ul>
        </div>`;
    }

    if (example.type === "gallery") {
      content = `
        <div class="example-gallery">
          <strong>${escapeHTML(example.title)}</strong>
          <p>${escapeHTML(example.description)}</p>
          <div>
            ${example.items
              .map(
                (item, index) => `
                  <span class="example-gallery-item tone-${(index % 4) + 1}">
                    <b>${escapeHTML(item.title)}</b>
                    <small>${escapeHTML(item.label)}</small>
                  </span>`
              )
              .join("")}
          </div>
        </div>`;
    }

    if (example.type === "checklist") {
      content = `
        <div class="example-checklist">
          <strong>${escapeHTML(example.title)}</strong>
          <p>${escapeHTML(example.description)}</p>
          ${example.items.map((item) => `<label><i class="bi bi-check2"></i><span>${escapeHTML(item)}</span></label>`).join("")}
          <span class="example-button">${escapeHTML(example.cta)}</span>
        </div>`;
    }

    return `
      <div class="project-example">
        <div class="project-example-label"><i class="bi bi-eye"></i> Contoh yang ditiru</div>
        <div class="project-example-window">
          <div class="project-example-toolbar"><span></span><span></span><span></span></div>
          <div class="project-example-canvas">${content}</div>
        </div>
        <button class="project-example-open" type="button" data-open-project-preview="${projectIndex}">
          <i class="bi bi-arrows-fullscreen"></i> Perbesar contoh
        </button>
      </div>`;
  };

  const openProjectPreview = (projectIndex) => {
    const project = data.projects[Number(projectIndex)];
    const modalElement = getElement("projectPreviewModal");
    const title = getElement("projectPreviewTitle");
    const description = getElement("projectPreviewDescription");
    const previewBody = getElement("projectPreviewBody");
    if (!project || !modalElement || !title || !description || !previewBody || !window.bootstrap) return;

    title.textContent = project.title;
    description.textContent = `${project.level} - ${project.goal}`;
    previewBody.innerHTML = renderProjectExample(project.example, projectIndex);
    bootstrap.Modal.getOrCreateInstance(modalElement).show();
  };

  const renderProjects = () => {
    const projectGrid = getElement("projectGrid");
    if (!projectGrid) return;
    projectGrid.innerHTML = data.projects
      .map(
        (project, index) => `
          <div class="col-md-6 col-lg-4">
            <article class="project-card">
              <span class="mini-label">Project ${String(index + 1).padStart(2, "0")} &middot; ${escapeHTML(project.level)}</span>
              <h3>${escapeHTML(project.title)}</h3>
              <p>${escapeHTML(project.goal)}</p>
              ${renderProjectExample(project.example, index)}
              <details class="project-meta">
                <summary>Lihat panduan project</summary>
                <p class="mt-3 mb-1"><strong>Fitur:</strong> ${escapeHTML(project.features.join(", "))}</p>
                <ol class="ps-3">${project.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join("")}</ol>
                <p class="mb-1"><strong>Hint:</strong> ${escapeHTML(project.hint)}</p>
                <p class="mb-0"><strong>Challenge tambahan:</strong> ${escapeHTML(project.extra)}</p>
              </details>
            </article>
          </div>`
      )
      .join("");
  };

  const updateProgress = () => {
    const state = progress.state;
    const percentage = progress.getTotalProgress();
    const nextLesson = data.lessons.find((lesson) => !state.completedLessons.includes(lesson.id));
    const progressPercent = getElement("progressPercent");
    const mainProgressBar = getElement("mainProgressBar");
    const statLessons = getElement("statLessons");
    const statQuiz = getElement("statQuiz");
    const statRecall = getElement("statRecall");
    const statDebug = getElement("statDebug");
    const nextRecommendation = getElement("nextRecommendation");
    const badgeGrid = getElement("badgeGrid");
    const roadmapCompleted = getElement("roadmapCompleted");

    progress.unlockBadges();
    renderHomeDashboard();
    renderPhaseMap("phaseMap");
    renderPhaseMap("homePhaseMap");

    if (progressPercent) progressPercent.textContent = `${percentage}%`;
    if (mainProgressBar) {
      mainProgressBar.style.width = `${percentage}%`;
      mainProgressBar.parentElement?.setAttribute("aria-valuenow", percentage);
    }
    if (statLessons) statLessons.textContent = state.completedLessons.length;
    if (statQuiz) statQuiz.textContent = progress.getAverageQuiz();
    if (statRecall) statRecall.textContent = state.completedRecall.length;
    if (statDebug) statDebug.textContent = state.completedDebug.length;
    if (nextRecommendation) {
      nextRecommendation.innerHTML = nextLesson
        ? `<i class="bi bi-compass"></i> Rekomendasi berikutnya: <a href="${lessonHref(nextLesson.id)}"><strong>${escapeHTML(nextLesson.title)}</strong></a>`
        : '<i class="bi bi-check-circle"></i> Semua materi utama sudah selesai. Lanjutkan mini project untuk memperkuat pemahaman.';
    }
    if (badgeGrid) {
      badgeGrid.innerHTML = data.badges
        .map(
          (badge) => `
            <div class="badge-item ${state.badges.includes(badge.id) ? "" : "locked"}">
              <i class="bi ${badge.icon}"></i>
              <span>${escapeHTML(badge.title)}</span>
            </div>`
        )
        .join("");
    }
    if (roadmapCompleted) roadmapCompleted.textContent = `${state.completedLessons.length}/${data.lessons.length}`;
  };

  const toggleDarkMode = () => {
    const enabled = !document.body.classList.contains("dark-mode");
    document.body.classList.toggle("dark-mode", enabled);
    progress.setDarkMode(enabled);
    updateThemeToggle();
  };

  const updateThemeToggle = () => {
    const button = getElement("darkModeToggle");
    if (!button) return;
    const dark = document.body.classList.contains("dark-mode");
    button.innerHTML = dark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    button.setAttribute("aria-label", dark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
  };

  const initEditorUndoHistory = (inputs, onChange) => {
    const maxHistory = 140;
    const histories = new Map();

    const snapshot = (input) => ({
      value: input.value,
      selectionStart: input.selectionStart,
      selectionEnd: input.selectionEnd,
      scrollLeft: input.scrollLeft,
      scrollTop: input.scrollTop
    });

    const sameSnapshot = (first, second) =>
      first &&
      second &&
      first.value === second.value &&
      first.selectionStart === second.selectionStart &&
      first.selectionEnd === second.selectionEnd &&
      first.scrollLeft === second.scrollLeft &&
      first.scrollTop === second.scrollTop;

    const ensureHistory = (input) => {
      if (!histories.has(input)) {
        histories.set(input, { index: 0, restoring: false, stack: [snapshot(input)] });
      }
      return histories.get(input);
    };

    const record = (input) => {
      const history = ensureHistory(input);
      if (history.restoring) return;
      const next = snapshot(input);
      if (sameSnapshot(history.stack[history.index], next)) return;
      history.stack = history.stack.slice(0, history.index + 1);
      history.stack.push(next);
      if (history.stack.length > maxHistory) history.stack.shift();
      history.index = history.stack.length - 1;
    };

    const restore = (input, next) => {
      const history = ensureHistory(input);
      history.restoring = true;
      input.value = next.value;
      input.setSelectionRange(next.selectionStart, next.selectionEnd);
      input.scrollLeft = next.scrollLeft;
      input.scrollTop = next.scrollTop;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      history.restoring = false;
      onChange();
    };

    const undo = (input) => {
      const history = ensureHistory(input);
      if (history.index <= 0) return false;
      history.index -= 1;
      restore(input, history.stack[history.index]);
      return true;
    };

    const redo = (input) => {
      const history = ensureHistory(input);
      if (history.index >= history.stack.length - 1) return false;
      history.index += 1;
      restore(input, history.stack[history.index]);
      return true;
    };

    const reset = () => {
      inputs.forEach((input) => {
        histories.set(input, { index: 0, restoring: false, stack: [snapshot(input)] });
      });
    };

    inputs.forEach((input) => {
      histories.set(input, { index: 0, restoring: false, stack: [snapshot(input)] });
      input.addEventListener("input", () => record(input));
      input.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        const modKey = event.ctrlKey || event.metaKey;
        const isUndo = modKey && !event.altKey && key === "z" && !event.shiftKey;
        const isRedo = modKey && !event.altKey && (key === "y" || (key === "z" && event.shiftKey));
        if (!isUndo && !isRedo) return;

        event.preventDefault();
        if (isUndo) undo(input);
        else redo(input);
      });
    });

    reset();

    return {
      record,
      redo,
      reset,
      undo
    };
  };

  const initEditorTabBehavior = (inputs, onChange) => {
    const indent = "  ";

    const getLineRange = (input) => {
      const value = input.value;
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;
      const effectiveEnd = selectionEnd > selectionStart && value[selectionEnd - 1] === "\n" ? selectionEnd - 1 : selectionEnd;
      const start = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const nextBreak = value.indexOf("\n", effectiveEnd);
      const end = nextBreak === -1 ? value.length : nextBreak;
      return { end, start };
    };

    const lineStartsInRange = (value, start, end) => {
      const starts = [start];
      for (let index = start; index < end; index += 1) {
        if (value[index] === "\n") starts.push(index + 1);
      }
      return starts;
    };

    const indentSelection = (input) => {
      const value = input.value;
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      if (selectionStart === selectionEnd) {
        input.setRangeText(indent, selectionStart, selectionEnd, "end");
        return;
      }

      const range = getLineRange(input);
      const block = value.slice(range.start, range.end);
      const lines = block.split("\n");
      const replacement = lines.map((line) => `${indent}${line}`).join("\n");
      const lineStarts = lineStartsInRange(value, range.start, range.end);
      const shiftPosition = (position) => lineStarts.reduce((next, lineStart) => (position >= lineStart ? next + indent.length : next), position);

      input.setRangeText(replacement, range.start, range.end, "preserve");
      input.setSelectionRange(shiftPosition(selectionStart), shiftPosition(selectionEnd));
    };

    const outdentSelection = (input) => {
      const value = input.value;
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;
      const range = getLineRange(input);
      const block = value.slice(range.start, range.end);
      const lines = block.split("\n");
      const removals = [];
      let offset = range.start;

      const replacement = lines
        .map((line) => {
          const removeCount = line.startsWith(indent) ? indent.length : line.startsWith("\t") || line.startsWith(" ") ? 1 : 0;
          if (removeCount) removals.push({ count: removeCount, start: offset });
          offset += line.length + 1;
          return line.slice(removeCount);
        })
        .join("\n");

      if (!removals.length) return;

      const shiftPosition = (position) =>
        removals.reduce((next, removal) => {
          if (position <= removal.start) return next;
          return next - Math.min(removal.count, position - removal.start);
        }, position);

      input.setRangeText(replacement, range.start, range.end, "preserve");
      input.setSelectionRange(shiftPosition(selectionStart), shiftPosition(selectionEnd));
    };

    inputs.forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.defaultPrevented || event.key !== "Tab" || event.ctrlKey || event.metaKey || event.altKey) return;
        event.preventDefault();
        if (event.shiftKey) outdentSelection(input);
        else indentSelection(input);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        onChange();
      });
    });
  };

  const initHtmlTagSuggest = (htmlInput, onChange) => {
    const wrap = getElement("htmlEditorWrap") || htmlInput.parentElement;
    if (!wrap) return null;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));
    const tagSuggestions = [
      { name: "main", detail: "Konten utama halaman", snippet: "<main>\n  |\n</main>" },
      { name: "section", detail: "Bagian konten", snippet: "<section>\n  |\n</section>" },
      { name: "article", detail: "Artikel atau konten mandiri", snippet: "<article>\n  |\n</article>" },
      { name: "header", detail: "Header halaman/bagian", snippet: "<header>\n  |\n</header>" },
      { name: "footer", detail: "Footer halaman/bagian", snippet: "<footer>\n  |\n</footer>" },
      { name: "nav", detail: "Navigasi link", snippet: "<nav>\n  |\n</nav>" },
      { name: "div", detail: "Pembungkus umum", snippet: '<div class="">|</div>' },
      { name: "span", detail: "Teks inline", snippet: "<span>|</span>" },
      { name: "h1", detail: "Heading utama", snippet: "<h1>|</h1>" },
      { name: "h2", detail: "Heading bagian", snippet: "<h2>|</h2>" },
      { name: "h3", detail: "Heading kecil", snippet: "<h3>|</h3>" },
      { name: "p", detail: "Paragraf", snippet: "<p>|</p>" },
      { name: "a", detail: "Link", snippet: '<a href="#">|</a>' },
      { name: "img", detail: "Gambar", snippet: '<img src="|" alt="">' },
      { name: "ul", detail: "List bullet", snippet: "<ul>\n  <li>|</li>\n</ul>" },
      { name: "ol", detail: "List bernomor", snippet: "<ol>\n  <li>|</li>\n</ol>" },
      { name: "li", detail: "Item list", snippet: "<li>|</li>" },
      { name: "form", detail: "Form input", snippet: "<form>\n  |\n</form>" },
      { name: "label", detail: "Label input", snippet: '<label for="">|</label>' },
      { name: "input", detail: "Input singkat", snippet: '<input id="|" type="text">' },
      { name: "textarea", detail: "Input teks panjang", snippet: '<textarea id="">|</textarea>' },
      { name: "button", detail: "Tombol aksi", snippet: '<button type="button">|</button>' },
      { name: "table", detail: "Tabel data", snippet: "<table>\n  <tr>\n    <th>|</th>\n  </tr>\n</table>" },
      { name: "tr", detail: "Baris tabel", snippet: "<tr>\n  |\n</tr>" },
      { name: "th", detail: "Header tabel", snippet: "<th>|</th>" },
      { name: "td", detail: "Sel tabel", snippet: "<td>|</td>" },
      { name: "strong", detail: "Teks penting", snippet: "<strong>|</strong>" },
      { name: "em", detail: "Teks penekanan", snippet: "<em>|</em>" },
      { name: "br", detail: "Baris baru", snippet: "<br>" },
      { name: "hr", detail: "Garis pemisah", snippet: "<hr>" },
      { name: "html", detail: "Root dokumen", snippet: '<html lang="id">\n  |\n</html>' },
      { name: "head", detail: "Metadata dokumen", snippet: "<head>\n  |\n</head>" },
      { name: "body", detail: "Isi halaman", snippet: "<body>\n  |\n</body>" },
      { name: "title", detail: "Judul tab browser", snippet: "<title>|</title>" },
      { name: "meta", detail: "Metadata", snippet: '<meta name="|" content="">' },
      { name: "link", detail: "Hubungkan file", snippet: '<link rel="stylesheet" href="|">' },
      { name: "style", detail: "CSS internal", snippet: "<style>\n  |\n</style>" }
    ];
    const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
    const state = {
      activeIndex: 0,
      context: null,
      items: []
    };

    const popover = document.createElement("div");
    popover.className = "editor-suggestion-popover";
    popover.hidden = true;
    popover.setAttribute("role", "listbox");
    popover.setAttribute("aria-label", "Saran tag HTML");

    const mirror = document.createElement("div");
    mirror.className = "textarea-caret-mirror";

    wrap.append(popover, mirror);

    const getContext = () => {
      const caret = htmlInput.selectionStart;
      if (caret !== htmlInput.selectionEnd) return null;
      const beforeCaret = htmlInput.value.slice(0, caret);
      const lastLt = beforeCaret.lastIndexOf("<");
      if (lastLt < 0) return null;
      const fragment = beforeCaret.slice(lastLt);
      if (fragment.includes(">") || /\s/.test(fragment)) return null;
      const match = fragment.match(/^<\/?([a-zA-Z][\w-]*)?$/);
      if (!match) return null;
      return {
        closing: fragment.startsWith("</"),
        prefix: (match[1] || "").toLowerCase(),
        start: lastLt,
        end: caret
      };
    };

    const findOpenTags = () => {
      const tokens = htmlInput.value.slice(0, htmlInput.selectionStart).match(/<\/?[a-zA-Z][\w-]*(?:\s[^<>]*)?>/g) || [];
      const stack = [];
      tokens.forEach((token) => {
        const parsed = token.match(/^<\/?\s*([a-zA-Z][\w-]*)/);
        if (!parsed) return;
        const name = parsed[1].toLowerCase();
        if (voidTags.has(name) || token.endsWith("/>")) return;
        if (token.startsWith("</")) {
          const index = stack.lastIndexOf(name);
          if (index >= 0) stack.splice(index, 1);
          return;
        }
        stack.push(name);
      });
      return stack.reverse();
    };

    const getItems = (context) => {
      const source = context.closing
        ? findOpenTags().map((name) => tagSuggestions.find((item) => item.name === name) || { name, detail: "Tag penutup", snippet: `</${name}>` })
        : tagSuggestions;
      const unique = [];
      const seen = new Set();

      source.forEach((item) => {
        if (seen.has(item.name) || (context.prefix && !item.name.startsWith(context.prefix))) return;
        seen.add(item.name);
        unique.push(item);
      });

      return unique.slice(0, 8);
    };

    const syncMirrorStyle = () => {
      const style = window.getComputedStyle(htmlInput);
      [
        "boxSizing",
        "fontFamily",
        "fontSize",
        "fontStyle",
        "fontWeight",
        "letterSpacing",
        "lineHeight",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "textTransform"
      ].forEach((property) => {
        mirror.style[property] = style[property];
      });
      mirror.style.borderStyle = "solid";
      mirror.style.borderColor = "transparent";
      mirror.style.borderTopWidth = style.borderTopWidth;
      mirror.style.borderRightWidth = style.borderRightWidth;
      mirror.style.borderBottomWidth = style.borderBottomWidth;
      mirror.style.borderLeftWidth = style.borderLeftWidth;
      mirror.style.width = `${htmlInput.clientWidth}px`;
      mirror.style.minHeight = `${htmlInput.scrollHeight}px`;
    };

    const positionPopover = () => {
      if (popover.hidden || !state.context) return;
      syncMirrorStyle();
      mirror.replaceChildren(document.createTextNode(htmlInput.value.slice(0, state.context.end)));
      const marker = document.createElement("span");
      marker.textContent = "\u200b";
      mirror.append(marker);

      const lineHeight = parseFloat(window.getComputedStyle(htmlInput).lineHeight) || 20;
      const width = popover.offsetWidth || 286;
      const height = popover.offsetHeight || 220;
      const left = clamp(marker.offsetLeft - htmlInput.scrollLeft, 8, wrap.clientWidth - width - 8);
      const lowerTop = marker.offsetTop - htmlInput.scrollTop + lineHeight + 6;
      const upperTop = marker.offsetTop - htmlInput.scrollTop - height - 6;
      const top = lowerTop + height < htmlInput.clientHeight ? lowerTop : clamp(upperTop, 8, htmlInput.clientHeight - height - 8);

      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
    };

    const close = () => {
      popover.hidden = true;
      state.context = null;
      state.items = [];
      state.activeIndex = 0;
      wrap.closest(".editor-shell")?.classList.remove("suggestion-open");
    };

    const render = () => {
      popover.innerHTML = state.items
        .map(
          (item, index) => `
            <button class="editor-suggestion-option ${index === state.activeIndex ? "active" : ""}" type="button" role="option" aria-selected="${index === state.activeIndex}" data-suggestion-index="${index}">
              <span class="editor-suggestion-kind">&lt;/&gt;</span>
              <span class="editor-suggestion-main">
                <span class="editor-suggestion-name">${escapeHTML(state.context.closing ? `/${item.name}` : item.name)}</span>
                <span class="editor-suggestion-detail">${escapeHTML(item.detail)}</span>
              </span>
            </button>`
        )
        .join("");
    };

    const sync = () => {
      const context = getContext();
      if (!context) {
        close();
        return;
      }

      const items = getItems(context);
      if (!items.length) {
        close();
        return;
      }

      const previousKey = state.context ? `${state.context.closing}:${state.context.prefix}` : "";
      const nextKey = `${context.closing}:${context.prefix}`;
      state.context = context;
      state.items = items;
      state.activeIndex = previousKey === nextKey ? clamp(state.activeIndex, 0, items.length - 1) : 0;
      render();
      popover.hidden = false;
      wrap.closest(".editor-shell")?.classList.add("suggestion-open");
      positionPopover();
    };

    const commit = (item = state.items[state.activeIndex]) => {
      if (!item || !state.context) return;
      const snippet = state.context.closing ? `</${item.name}>` : item.snippet;
      const cursorIndex = snippet.indexOf("|");
      const replacement = snippet.replace("|", "");
      const selectionStart = state.context.start + (cursorIndex >= 0 ? cursorIndex : replacement.length);

      htmlInput.setRangeText(replacement, state.context.start, state.context.end, "end");
      htmlInput.setSelectionRange(selectionStart, selectionStart);
      htmlInput.dispatchEvent(new Event("input", { bubbles: true }));
      onChange();
      close();
      htmlInput.focus();
    };

    const moveActive = (direction) => {
      if (!state.items.length) return;
      state.activeIndex = (state.activeIndex + direction + state.items.length) % state.items.length;
      render();
      popover.querySelector(".editor-suggestion-option.active")?.scrollIntoView({ block: "nearest" });
    };

    htmlInput.addEventListener("input", () => window.requestAnimationFrame(sync));
    htmlInput.addEventListener("click", sync);
    htmlInput.addEventListener("keyup", (event) => {
      if (["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(event.key)) return;
      sync();
    });
    htmlInput.addEventListener("keydown", (event) => {
      if (popover.hidden) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
      } else if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        commit();
      } else if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    });
    htmlInput.addEventListener("scroll", positionPopover);
    popover.addEventListener("pointerdown", (event) => {
      const option = event.target.closest("[data-suggestion-index]");
      if (!option) return;
      event.preventDefault();
      commit(state.items[Number(option.dataset.suggestionIndex)]);
    });
    document.addEventListener("pointerdown", (event) => {
      if (popover.hidden) return;
      if (popover.contains(event.target) || htmlInput.contains(event.target)) return;
      close();
    });
    window.addEventListener("resize", sync);

    return {
      close,
      sync
    };
  };

  const initCssColorPicker = (cssInput, onChange) => {
    const wrap = getElement("cssEditorWrap") || cssInput.parentElement;
    if (!wrap) return null;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));
    const namedColors = {
      black: "#000000",
      blue: "#0000FF",
      cyan: "#00FFFF",
      gray: "#808080",
      green: "#008000",
      grey: "#808080",
      magenta: "#FF00FF",
      orange: "#FFA500",
      pink: "#FFC0CB",
      purple: "#800080",
      red: "#FF0000",
      white: "#FFFFFF",
      yellow: "#FFFF00"
    };
    const presets = ["#FFFFFF", "#111827", "#2563EB", "#1D4ED8", "#16A36A", "#0EA5B7", "#7C3AED", "#DC4C64", "#FBBF24", "#22C55E", "#38BDF8", "#A855F7"];
    const namedPattern = Object.keys(namedColors).join("|");
    const colorTokenPattern = new RegExp(`#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-fA-F])|\\b(?:rgba?|hsla?)\\(\\s*[^)]*\\)|\\b(?:${namedPattern})\\b`, "gi");
    const state = {
      color: null,
      draggingMap: false,
      token: null
    };

    const chip = document.createElement("button");
    chip.className = "editor-color-chip";
    chip.type = "button";
    chip.hidden = true;
    chip.setAttribute("aria-label", "Buka color picker");
    chip.innerHTML = "<span></span>";

    const popover = document.createElement("div");
    popover.className = "editor-color-popover";
    popover.hidden = true;
    popover.innerHTML = `
      <div class="editor-color-top">
        <span class="editor-color-preview" data-color-preview></span>
        <label class="editor-color-hex">
          <span>HEX</span>
          <input type="text" inputmode="text" maxlength="7" spellcheck="false" data-color-hex aria-label="Nilai warna hex" />
        </label>
        <button class="editor-color-close" type="button" data-color-close aria-label="Tutup color picker">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="editor-color-body">
        <div class="editor-color-map" tabindex="0" data-color-map aria-label="Area saturation dan value warna">
          <span class="editor-color-cursor" data-color-cursor></span>
        </div>
        <input class="editor-color-hue" type="range" min="0" max="360" value="0" data-color-hue aria-label="Hue warna" />
      </div>
      <div class="editor-color-presets">
        ${presets.map((color) => `<button class="editor-color-preset" type="button" style="--preset-color: ${color}" data-color-preset="${color}" aria-label="Gunakan warna ${color}"></button>`).join("")}
      </div>`;

    const mirror = document.createElement("div");
    mirror.className = "textarea-caret-mirror";

    wrap.append(chip, popover, mirror);

    const chipSwatch = chip.querySelector("span");
    const preview = popover.querySelector("[data-color-preview]");
    const hexInput = popover.querySelector("[data-color-hex]");
    const closeButton = popover.querySelector("[data-color-close]");
    const colorMap = popover.querySelector("[data-color-map]");
    const colorCursor = popover.querySelector("[data-color-cursor]");
    const hueInput = popover.querySelector("[data-color-hue]");

    const componentToHex = (component) => Math.round(clamp(component, 0, 255)).toString(16).padStart(2, "0").toUpperCase();

    const rgbToHex = ({ r, g, b }) => `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;

    const normalizeHexColor = (value) => {
      const raw = String(value).trim().replace(/^#/, "");
      if (![3, 4, 6, 8].includes(raw.length) || /[^0-9a-f]/i.test(raw)) return null;
      const expanded = raw.length <= 4 ? raw.split("").map((char) => char + char).join("") : raw;
      return `#${expanded.slice(0, 6).toUpperCase()}`;
    };

    const hexToRgb = (value) => {
      const hex = normalizeHexColor(value);
      if (!hex) return null;
      return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
      };
    };

    const rgbToHsv = ({ r, g, b }) => {
      const red = r / 255;
      const green = g / 255;
      const blue = b / 255;
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const delta = max - min;
      let h = 0;

      if (delta) {
        if (max === red) h = ((green - blue) / delta) % 6;
        else if (max === green) h = (blue - red) / delta + 2;
        else h = (red - green) / delta + 4;
        h *= 60;
        if (h < 0) h += 360;
      }

      return {
        h,
        s: max === 0 ? 0 : delta / max,
        v: max
      };
    };

    const hsvToRgb = ({ h, s, v }) => {
      const hue = ((h % 360) + 360) % 360;
      const chroma = v * s;
      const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
      const match = v - chroma;
      let red = 0;
      let green = 0;
      let blue = 0;

      if (hue < 60) [red, green, blue] = [chroma, x, 0];
      else if (hue < 120) [red, green, blue] = [x, chroma, 0];
      else if (hue < 180) [red, green, blue] = [0, chroma, x];
      else if (hue < 240) [red, green, blue] = [0, x, chroma];
      else if (hue < 300) [red, green, blue] = [x, 0, chroma];
      else [red, green, blue] = [chroma, 0, x];

      return {
        r: (red + match) * 255,
        g: (green + match) * 255,
        b: (blue + match) * 255
      };
    };

    const hslToRgb = (h, s, l) => {
      const hue = ((h % 360) + 360) % 360;
      const saturation = clamp(s, 0, 100) / 100;
      const lightness = clamp(l, 0, 100) / 100;
      const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
      const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
      const match = lightness - chroma / 2;
      let red = 0;
      let green = 0;
      let blue = 0;

      if (hue < 60) [red, green, blue] = [chroma, x, 0];
      else if (hue < 120) [red, green, blue] = [x, chroma, 0];
      else if (hue < 180) [red, green, blue] = [0, chroma, x];
      else if (hue < 240) [red, green, blue] = [0, x, chroma];
      else if (hue < 300) [red, green, blue] = [x, 0, chroma];
      else [red, green, blue] = [chroma, 0, x];

      return {
        r: (red + match) * 255,
        g: (green + match) * 255,
        b: (blue + match) * 255
      };
    };

    const parseCssColor = (value) => {
      const text = String(value).trim();
      const lower = text.toLowerCase();
      if (namedColors[lower]) return hexToRgb(namedColors[lower]);
      if (text.startsWith("#")) return hexToRgb(text);

      const numbers = text.match(/-?\d*\.?\d+%?/g) || [];
      if (lower.startsWith("rgb") && numbers.length >= 3) {
        const toRgbComponent = (part) => (part.endsWith("%") ? (parseFloat(part) / 100) * 255 : parseFloat(part));
        return {
          r: clamp(toRgbComponent(numbers[0]), 0, 255),
          g: clamp(toRgbComponent(numbers[1]), 0, 255),
          b: clamp(toRgbComponent(numbers[2]), 0, 255)
        };
      }

      if (lower.startsWith("hsl") && numbers.length >= 3) {
        const saturation = numbers[1].endsWith("%") ? parseFloat(numbers[1]) : parseFloat(numbers[1]);
        const lightness = numbers[2].endsWith("%") ? parseFloat(numbers[2]) : parseFloat(numbers[2]);
        return hslToRgb(parseFloat(numbers[0]), saturation, lightness);
      }

      return null;
    };

    const findColorToken = () => {
      const selectionStart = cssInput.selectionStart;
      const selectionEnd = cssInput.selectionEnd;
      const hasSelection = selectionStart !== selectionEnd;
      colorTokenPattern.lastIndex = 0;
      let match;

      while ((match = colorTokenPattern.exec(cssInput.value))) {
        const start = match.index;
        const end = start + match[0].length;
        const insideToken = hasSelection ? selectionStart >= start && selectionEnd <= end : selectionStart >= start && selectionStart <= end;
        if (insideToken && parseCssColor(match[0])) {
          return { start, end, text: match[0] };
        }
      }

      return null;
    };

    const renderPicker = () => {
      if (!state.color) return;
      const rgb = hsvToRgb(state.color);
      const hex = rgbToHex(rgb);
      chipSwatch.style.backgroundColor = hex;
      preview.style.backgroundColor = hex;
      hexInput.value = hex;
      hueInput.value = Math.round(state.color.h);
      colorMap.style.setProperty("--picker-hue", Math.round(state.color.h));
      colorCursor.style.left = `${state.color.s * 100}%`;
      colorCursor.style.top = `${(1 - state.color.v) * 100}%`;
    };

    const syncMirrorStyle = () => {
      const style = window.getComputedStyle(cssInput);
      [
        "boxSizing",
        "fontFamily",
        "fontSize",
        "fontStyle",
        "fontWeight",
        "letterSpacing",
        "lineHeight",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "textTransform"
      ].forEach((property) => {
        mirror.style[property] = style[property];
      });
      mirror.style.borderStyle = "solid";
      mirror.style.borderColor = "transparent";
      mirror.style.borderTopWidth = style.borderTopWidth;
      mirror.style.borderRightWidth = style.borderRightWidth;
      mirror.style.borderBottomWidth = style.borderBottomWidth;
      mirror.style.borderLeftWidth = style.borderLeftWidth;
      mirror.style.width = `${cssInput.clientWidth}px`;
      mirror.style.minHeight = `${cssInput.scrollHeight}px`;
    };

    const positionChip = () => {
      if (!state.token) return;
      syncMirrorStyle();
      mirror.replaceChildren(document.createTextNode(cssInput.value.slice(0, state.token.start)));
      const marker = document.createElement("span");
      marker.textContent = "\u200b";
      mirror.append(marker);

      const lineHeight = parseFloat(window.getComputedStyle(cssInput).lineHeight) || 20;
      const left = clamp(marker.offsetLeft - cssInput.scrollLeft - 30, 7, wrap.clientWidth - 31);
      const top = clamp(marker.offsetTop - cssInput.scrollTop + lineHeight * 0.12, 7, cssInput.clientHeight - 31);
      chip.style.left = `${left}px`;
      chip.style.top = `${top}px`;
    };

    const positionPopover = () => {
      if (popover.hidden) return;
      const chipLeft = parseFloat(chip.style.left) || 8;
      const chipTop = parseFloat(chip.style.top) || 8;
      const popoverWidth = popover.offsetWidth;
      const popoverHeight = popover.offsetHeight;
      const left = clamp(chipLeft, 8, wrap.clientWidth - popoverWidth - 8);
      const lowerTop = chipTop + 32;
      const upperTop = chipTop - popoverHeight - 8;
      const top = lowerTop + popoverHeight < cssInput.clientHeight ? lowerTop : clamp(upperTop, 8, cssInput.clientHeight - popoverHeight - 8);
      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
    };

    const closePopover = () => {
      popover.hidden = true;
      wrap.closest(".editor-shell")?.classList.remove("color-picker-open");
    };

    const syncFromSelection = () => {
      const token = findColorToken();
      if (!token) {
        state.token = null;
        chip.hidden = true;
        closePopover();
        return;
      }

      state.token = token;
      state.color = rgbToHsv(parseCssColor(token.text));
      renderPicker();
      positionChip();
      chip.hidden = false;
      positionPopover();
    };

    const replaceActiveColor = (hex) => {
      if (!state.token) return;
      const start = state.token.start;
      cssInput.setRangeText(hex, start, state.token.end, "select");
      state.token = { start, end: start + hex.length, text: hex };
      state.color = rgbToHsv(hexToRgb(hex));
      renderPicker();
      positionChip();
      positionPopover();
      cssInput.dispatchEvent(new Event("input", { bubbles: true }));
      onChange();
    };

    const setColor = (nextColor, shouldReplace = true) => {
      state.color = {
        h: clamp(nextColor.h, 0, 360),
        s: clamp(nextColor.s, 0, 1),
        v: clamp(nextColor.v, 0, 1)
      };
      renderPicker();
      if (shouldReplace) replaceActiveColor(rgbToHex(hsvToRgb(state.color)));
    };

    const updateFromMapPoint = (event) => {
      if (!state.color) return;
      const rect = colorMap.getBoundingClientRect();
      const s = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const v = clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1);
      setColor({ ...state.color, s, v });
    };

    const openPopover = () => {
      if (!state.token) syncFromSelection();
      if (!state.token) return;
      popover.hidden = false;
      wrap.closest(".editor-shell")?.classList.add("color-picker-open");
      renderPicker();
      positionPopover();
      hexInput.focus();
      hexInput.select();
    };

    chip.addEventListener("click", (event) => {
      event.preventDefault();
      openPopover();
    });

    closeButton.addEventListener("click", closePopover);

    colorMap.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      state.draggingMap = true;
      colorMap.setPointerCapture?.(event.pointerId);
      updateFromMapPoint(event);
    });

    colorMap.addEventListener("pointermove", (event) => {
      if (!state.draggingMap) return;
      updateFromMapPoint(event);
    });

    colorMap.addEventListener("pointerup", (event) => {
      state.draggingMap = false;
      colorMap.releasePointerCapture?.(event.pointerId);
    });

    colorMap.addEventListener("keydown", (event) => {
      if (!state.color || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const step = event.shiftKey ? 0.1 : 0.025;
      const nextColor = { ...state.color };
      if (event.key === "ArrowLeft") nextColor.s -= step;
      if (event.key === "ArrowRight") nextColor.s += step;
      if (event.key === "ArrowUp") nextColor.v += step;
      if (event.key === "ArrowDown") nextColor.v -= step;
      setColor(nextColor);
    });

    hueInput.addEventListener("input", () => {
      if (!state.color) return;
      setColor({ ...state.color, h: Number(hueInput.value) });
    });

    hexInput.addEventListener("input", () => {
      const hex = normalizeHexColor(hexInput.value.startsWith("#") ? hexInput.value : `#${hexInput.value}`);
      hexInput.toggleAttribute("aria-invalid", !hex);
      if (!hex) return;
      state.color = rgbToHsv(hexToRgb(hex));
      replaceActiveColor(hex);
    });

    popover.querySelectorAll("[data-color-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        replaceActiveColor(button.dataset.colorPreset);
      });
    });

    cssInput.addEventListener("click", syncFromSelection);
    cssInput.addEventListener("keyup", syncFromSelection);
    cssInput.addEventListener("select", syncFromSelection);
    cssInput.addEventListener("input", () => window.requestAnimationFrame(syncFromSelection));
    cssInput.addEventListener("scroll", () => {
      if (!state.token) return;
      positionChip();
      positionPopover();
    });

    document.addEventListener("pointerdown", (event) => {
      if (popover.hidden) return;
      if (popover.contains(event.target) || chip.contains(event.target)) return;
      closePopover();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePopover();
    });

    window.addEventListener("resize", syncFromSelection);

    return {
      close: closePopover,
      sync: syncFromSelection
    };
  };

  const setEditorTemplate = (id) => {
    const template = data.editorTemplates.find((item) => item.id === id) || data.editorTemplates[0];
    const htmlInput = getElement("htmlInput");
    const cssInput = getElement("cssInput");
    if (!htmlInput || !cssInput) return;
    htmlInput.value = template.html;
    cssInput.value = template.css;
    editorUndoHistory?.reset();
    document.querySelectorAll("[data-editor-template]").forEach((button) => button.classList.toggle("active", button.dataset.editorTemplate === template.id));
    runEditorPreview();
    editorTagSuggest?.close();
    editorColorPicker?.close();
    editorColorPicker?.sync();
  };

  const runEditorPreview = () => {
    const htmlInput = getElement("htmlInput");
    const cssInput = getElement("cssInput");
    const previewFrame = getElement("previewFrame");
    if (!htmlInput || !cssInput || !previewFrame) return;
    previewFrame.srcdoc = buildPreviewDocument(htmlInput.value, cssInput.value);
  };

  const initEditor = () => {
    const htmlInput = getElement("htmlInput");
    const cssInput = getElement("cssInput");
    const templateButtons = getElement("templateButtons");
    if (!htmlInput || !cssInput || !templateButtons) return;

    templateButtons.innerHTML = data.editorTemplates
      .map(
        (template) => `
          <button class="template-btn" type="button" data-editor-template="${template.id}">
            <i class="bi ${template.icon}"></i> ${escapeHTML(template.title)}
          </button>`
      )
      .join("");

    let timeoutId;
    const debouncedPreview = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(runEditorPreview, 220);
    };

    editorTagSuggest = initHtmlTagSuggest(htmlInput, runEditorPreview);
    editorColorPicker = initCssColorPicker(cssInput, runEditorPreview);
    editorUndoHistory = initEditorUndoHistory([htmlInput, cssInput], runEditorPreview);
    initEditorTabBehavior([htmlInput, cssInput], runEditorPreview);
    setEditorTemplate(data.editorTemplates[0].id);
    htmlInput.addEventListener("input", debouncedPreview);
    cssInput.addEventListener("input", debouncedPreview);
    getElement("runPreview")?.addEventListener("click", runEditorPreview);
    getElement("resetEditor")?.addEventListener("click", () => setEditorTemplate(data.editorTemplates[0].id));
    getElement("copyEditor")?.addEventListener("click", () => {
      const source = `${htmlInput.value}\n\n<style>\n${cssInput.value}\n</style>`;
      copyText(source)
        .then(() => showToast("Kode editor berhasil disalin."))
        .catch(() => showToast("Kode belum bisa disalin. Pilih teks secara manual."));
    });
  };

  const handleClick = (event) => {
    const homeDemoButton = event.target.closest("[data-home-demo]");
    if (homeDemoButton) {
      renderHomeDemo(homeDemoButton.dataset.homeDemo);
      return;
    }

    const copyButton = event.target.closest("[data-copy-code]");
    if (copyButton) {
      copyText(decodeURIComponent(copyButton.dataset.copyCode))
        .then(() => showToast("Kode berhasil disalin."))
        .catch(() => showToast("Kode belum bisa disalin. Pilih kode secara manual."));
      return;
    }

    const templateButton = event.target.closest("[data-editor-template]");
    if (templateButton) {
      setEditorTemplate(templateButton.dataset.editorTemplate);
      return;
    }

    const projectPreviewButton = event.target.closest("[data-open-project-preview]");
    if (projectPreviewButton) {
      openProjectPreview(projectPreviewButton.dataset.openProjectPreview);
      return;
    }

    const lessonButton = event.target.closest("[data-open-lesson]");
    if (lessonButton) {
      event.preventDefault();
      openLesson(lessonButton.dataset.openLesson);
      return;
    }

    if (event.target.closest("[data-close-lesson]")) {
      closeLesson();
      return;
    }

    const completeLessonButton = event.target.closest("[data-complete-lesson]");
    if (completeLessonButton) {
      const id = completeLessonButton.dataset.completeLesson;
      const result = progress.markLesson(id);
      completeLessonButton.innerHTML = '<i class="bi bi-check2-circle"></i> Sudah selesai';
      showNextLearningPanel(id);
      renderLessons();
      updateProgress();
      showToast(result.added ? "Materi ditandai selesai." : "Materi ini sudah pernah diselesaikan.");
      showBadgeToasts(result.unlocked);
      return;
    }

    const toggleTarget = event.target.closest("[data-toggle-target]");
    if (toggleTarget) {
      getElement(toggleTarget.dataset.toggleTarget)?.classList.toggle("d-none");
      return;
    }

    const lessonAnswer = event.target.closest("[data-lesson-answer]");
    if (lessonAnswer) {
      const wrapper = lessonAnswer.closest("[data-lesson-quiz]");
      const item = data.lessons.find((lesson) => lesson.id === wrapper.dataset.lessonQuiz);
      const selected = Number(lessonAnswer.dataset.lessonAnswer);
      wrapper.querySelectorAll("[data-lesson-answer]").forEach((button, index) => {
        button.disabled = true;
        if (index === item.quiz.answer) button.classList.add("correct");
        if (index === selected && selected !== item.quiz.answer) button.classList.add("wrong");
      });
      const feedback = wrapper.nextElementSibling;
      feedback.classList.remove("d-none");
      feedback.innerHTML = `<strong>${selected === item.quiz.answer ? "Benar." : "Belum tepat."}</strong> ${escapeHTML(item.quiz.explanation)}`;
      return;
    }

    const quizAnswer = event.target.closest("[data-quiz-answer]");
    if (quizAnswer) {
      answerQuiz(Number(quizAnswer.dataset.quizAnswer));
      return;
    }

    if (event.target.closest("[data-next-quiz]")) {
      currentQuiz.index += 1;
      currentQuiz.answered = false;
      renderQuiz();
      return;
    }

    if (event.target.closest("[data-retry-quiz]")) {
      currentQuiz = { index: 0, score: 0, answered: false, recorded: false };
      renderQuiz();
      return;
    }

    const recallButton = event.target.closest("[data-open-recall]");
    if (recallButton) {
      renderRecallChallenge(recallButton.dataset.openRecall);
      return;
    }

    if (event.target.closest("[data-show-recall-answer]")) {
      getElement("recallAnswer")?.classList.remove("d-none");
      return;
    }

    const completeRecallButton = event.target.closest("[data-complete-recall]");
    if (completeRecallButton) {
      const result = progress.markRecall(completeRecallButton.dataset.completeRecall);
      renderRecallChallenge(completeRecallButton.dataset.completeRecall);
      updateProgress();
      showToast(result.added ? "Recall challenge ditandai selesai." : "Recall ini sudah pernah diselesaikan.");
      showBadgeToasts(result.unlocked);
      return;
    }

    const debugButton = event.target.closest("[data-open-debug]");
    if (debugButton) {
      renderDebuggingChallenge(debugButton.dataset.openDebug);
      return;
    }

    if (event.target.closest("[data-show-debug-hint]")) {
      getElement("debugHint")?.classList.remove("d-none");
      return;
    }

    const completeDebugButton = event.target.closest("[data-complete-debug]");
    if (completeDebugButton) {
      const result = progress.markDebug(completeDebugButton.dataset.completeDebug);
      renderDebuggingChallenge(completeDebugButton.dataset.completeDebug);
      updateProgress();
      showToast(result.added ? "Debugging challenge ditandai selesai." : "Kasus debugging ini sudah pernah diselesaikan.");
      showBadgeToasts(result.unlocked);
    }
  };

  const handleSubmit = (event) => {
    const lessonRecallForm = event.target.closest("[data-lesson-recall-form]");
    if (lessonRecallForm) {
      event.preventDefault();
      const answer = lessonRecallForm.elements.answer.value.trim();
      if (!answer) {
        showToast("Tulis jawaban recall sebelum menyimpan.");
        return;
      }
      lessonRecallAnswers[lessonRecallForm.dataset.lessonRecallForm] = answer;
      showToast(saveLessonRecallAnswers() ? "Jawaban recall materi tersimpan." : "Jawaban recall belum dapat disimpan.");
      return;
    }

    const debugForm = event.target.closest("[data-debug-form]");
    if (!debugForm) return;
    event.preventDefault();
    const analysis = debugForm.elements.analysis.value.trim();
    const code = debugForm.elements.code.value.trim();
    if (!analysis || !code) {
      showToast("Lengkapi analisis dan percobaan kode sebelum submit.");
      return;
    }
    const id = debugForm.dataset.debugForm;
    debugAttempts[id] = { analysis, code, submitted: true };
    renderDebuggingChallenge(id);
    getElement("debugAnswer")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    showToast("Jawaban terkirim. Silakan pelajari pembahasannya.");
  };

  const handleInput = (event) => {
    const debugForm = event.target.closest("[data-debug-form]");
    if (!debugForm) return;
    const id = debugForm.dataset.debugForm;
    const previousAttempt = debugAttempts[id] || { submitted: false };
    debugAttempts[id] = {
      analysis: debugForm.elements.analysis.value,
      code: debugForm.elements.code.value,
      submitted: previousAttempt.submitted
    };
  };

  const handleHashLesson = () => {
    const lessonId = document.body.dataset.lesson;
    if (lessonId && data.lessons.some((lesson) => lesson.id === lessonId)) {
      renderLessonDetail(lessonId);
      const lesson = data.lessons.find((item) => item.id === lessonId);
      if (lesson) document.title = `${lesson.title} - CSS Beginner Lab`;
      return;
    }

    if (document.body.dataset.page !== "materi") return;
    const id = decodeURIComponent(location.hash.replace("#", ""));
    if (id && data.lessons.some((lesson) => lesson.id === id)) window.location.href = lessonHref(id);
  };

  const init = () => {
    document.body.classList.toggle("dark-mode", progress.state.darkMode);
    updateThemeToggle();
    progress.unlockBadges();
    renderStarterFlow();
    renderPhaseMap("phaseMap");
    renderPhaseMap("homePhaseMap");
    renderHomeDemo();
    renderLessons();
    renderQuiz();
    renderRecallChallenge();
    renderDebuggingChallenge();
    renderProjects();
    updateProgress();
    initEditor();
    handleHashLesson();

    getElement("darkModeToggle")?.addEventListener("click", toggleDarkMode);
    getElement("resetProgress")?.addEventListener("click", () => {
      if (!window.confirm("Reset seluruh progress belajar di browser ini?")) return;
      progress.resetProgress();
      renderLessons();
      renderRecallChallenge();
      renderDebuggingChallenge();
      updateProgress();
      showToast("Progress belajar sudah direset.");
    });
    document.addEventListener("click", handleClick);
    document.addEventListener("input", handleInput);
    document.addEventListener("submit", handleSubmit);
    window.addEventListener("hashchange", handleHashLesson);

    document.querySelectorAll(".navbar .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        const menu = getElement("mainNav");
        if (menu?.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
      });
    });
  };

  return {
    init,
    renderLessons,
    renderLessonDetail,
    renderQuiz,
    renderDebuggingChallenge,
    renderRecallChallenge,
    renderProjects,
    updateProgress,
    showToast,
    escapeHTML,
    highlightHTML,
    renderCodeBlock,
    toggleDarkMode
  };
})();

document.addEventListener("DOMContentLoaded", window.CSSLabApp.init);
