window.CSSLabProgress = (() => {
  const STORAGE_KEY = "css-beginner-lab-progress-v1";
  const data = window.CSSLabData;

  const defaultState = {
    completedLessons: [],
    completedRecall: [],
    completedDebug: [],
    quizScores: [],
    badges: [],
    lastLesson: "",
    darkMode: false
  };

  const normalizeState = (value) => ({
    ...defaultState,
    ...(value && typeof value === "object" ? value : {}),
    completedLessons: Array.isArray(value?.completedLessons) ? value.completedLessons.filter((id) => data.lessons.some((lesson) => lesson.id === id)) : [],
    completedRecall: Array.isArray(value?.completedRecall) ? value.completedRecall.filter((id) => data.recallChallenges.some((item) => item.id === id)) : [],
    completedDebug: Array.isArray(value?.completedDebug) ? value.completedDebug.filter((id) => data.debugChallenges.some((item) => item.id === id)) : [],
    quizScores: Array.isArray(value?.quizScores) ? value.quizScores.filter((score) => Number.isFinite(score)) : [],
    badges: Array.isArray(value?.badges) ? value.badges.filter((id) => data.badges.some((badge) => badge.id === id)) : [],
    lastLesson: data.lessons.some((lesson) => lesson.id === value?.lastLesson) ? value.lastLesson : "",
    darkMode: Boolean(value?.darkMode)
  });

  const load = () => {
    try {
      return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch (error) {
      console.warn("Progress belajar tidak dapat dibaca.", error);
      return { ...defaultState };
    }
  };

  const state = load();

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.warn("Progress belajar tidak dapat disimpan.", error);
      return false;
    }
  };

  const addUnique = (list, id) => {
    if (list.includes(id)) return false;
    list.push(id);
    return true;
  };

  const getAverageQuiz = () => {
    if (!state.quizScores.length) return 0;
    const total = state.quizScores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / state.quizScores.length);
  };

  const getTotalProgress = () => {
    const lessonPart = state.completedLessons.length / data.lessons.length;
    const recallPart = state.completedRecall.length / data.recallChallenges.length;
    const debugPart = state.completedDebug.length / data.debugChallenges.length;
    const quizPart = Math.min(1, getAverageQuiz() / 100);
    return Math.round((lessonPart * 0.5 + quizPart * 0.2 + recallPart * 0.15 + debugPart * 0.15) * 100);
  };

  const unlockBadges = () => {
    const unlocked = [];
    const averageQuiz = getAverageQuiz();
    const rules = {
      mulai: state.completedLessons.length >= 1,
      "lima-materi": state.completedLessons.length >= 5,
      "semua-materi": state.completedLessons.length >= data.lessons.length,
      "quiz-70": averageQuiz >= 70,
      "recall-3": state.completedRecall.length >= 3,
      "debug-3": state.completedDebug.length >= 3,
      konsisten: state.completedLessons.length >= 3 && state.completedRecall.length >= 1 && state.completedDebug.length >= 1
    };

    data.badges.forEach((badge) => {
      if (!rules[badge.id] || state.badges.includes(badge.id)) return;
      state.badges.push(badge.id);
      unlocked.push(badge.title);
    });

    if (unlocked.length) save();
    return unlocked;
  };

  const markLesson = (id) => {
    const added = addUnique(state.completedLessons, id);
    state.lastLesson = id;
    const unlocked = unlockBadges();
    save();
    return { added, unlocked };
  };

  const markRecall = (id) => {
    const added = addUnique(state.completedRecall, id);
    const unlocked = unlockBadges();
    save();
    return { added, unlocked };
  };

  const markDebug = (id) => {
    const added = addUnique(state.completedDebug, id);
    const unlocked = unlockBadges();
    save();
    return { added, unlocked };
  };

  const recordQuiz = (score) => {
    state.quizScores.push(Math.max(0, Math.min(100, Math.round(score))));
    const unlocked = unlockBadges();
    save();
    return { unlocked };
  };

  const setDarkMode = (enabled) => {
    state.darkMode = Boolean(enabled);
    save();
  };

  const setLastLesson = (id) => {
    if (!data.lessons.some((lesson) => lesson.id === id)) return;
    state.lastLesson = id;
    save();
  };

  const resetProgress = () => {
    Object.assign(state, { ...defaultState });
    save();
  };

  return {
    state,
    save,
    markLesson,
    markRecall,
    markDebug,
    recordQuiz,
    setDarkMode,
    setLastLesson,
    resetProgress,
    unlockBadges,
    getAverageQuiz,
    getTotalProgress
  };
})();
