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

  const renderLessons = () => {
    const lessonGrid = getElement("lessonGrid");
    if (!lessonGrid) return;
    const completed = progress.state.completedLessons;
    lessonGrid.innerHTML = data.lessons
      .map(
        (item, index) => `
          <a class="lesson-card ${completed.includes(item.id) ? "completed" : ""}" href="${lessonHref(item.id)}" data-open-lesson="${item.id}">
          ${completed.includes(item.id) ? '<i class="bi bi-check-circle-fill complete-mark"></i>' : ""}
          <span class="lesson-icon"><i class="bi ${item.icon}"></i></span>
            <span class="lesson-number d-block mt-3">Materi ${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHTML(item.title)}</h3>
            <p><i class="bi bi-clock"></i> ${escapeHTML(item.duration)}</p>
          </a>`
      )
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

  const renderLessonDetail = (id) => {
    const item = data.lessons.find((lesson) => lesson.id === id);
    const lessonDetail = getElement("lessonDetail");
    if (!item || !lessonDetail) return;
    progress.setLastLesson(id);
    const lessonIndex = data.lessons.findIndex((lesson) => lesson.id === id);
    const isCompleted = progress.state.completedLessons.includes(id);

    lessonDetail.innerHTML = `
      <article class="lesson-detail-card">
        <header class="lesson-detail-head">
          <div class="d-flex justify-content-between gap-3">
            <div>
              <span class="eyebrow">Materi ${String(lessonIndex + 1).padStart(2, "0")} &middot; ${escapeHTML(item.duration)}</span>
              <h2 class="mt-2 mb-1">${escapeHTML(item.title)}</h2>
              <p class="mb-0">${escapeHTML(item.goal)}</p>
            </div>
            <button class="icon-btn flex-shrink-0" type="button" data-close-lesson aria-label="Tutup materi">
              <i class="bi bi-arrow-left"></i>
            </button>
          </div>
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
            ${renderLessonCodeBlocks(item)}
            ${renderLessonCodePreview(item)}
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

  const setEditorTemplate = (id) => {
    const template = data.editorTemplates.find((item) => item.id === id) || data.editorTemplates[0];
    const htmlInput = getElement("htmlInput");
    const cssInput = getElement("cssInput");
    if (!htmlInput || !cssInput) return;
    htmlInput.value = template.html;
    cssInput.value = template.css;
    document.querySelectorAll("[data-editor-template]").forEach((button) => button.classList.toggle("active", button.dataset.editorTemplate === template.id));
    runEditorPreview();
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

    setEditorTemplate(data.editorTemplates[0].id);
    let timeoutId;
    const debouncedPreview = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(runEditorPreview, 220);
    };
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
