// Learner progress, kept in this browser (localStorage): completed lessons and
// passed quizzes. No account and nothing sent anywhere.
const KEY = 'dl.progress.v1';
type Progress = { lessons: Record<string, number>; quizzes: Record<string, number> };

export function load(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return { lessons: p.lessons ?? {}, quizzes: p.quizzes ?? {} };
  } catch {
    return { lessons: {}, quizzes: {} };
  }
}

function save(p: Progress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  dispatchEvent(new CustomEvent('progress'));
}

export function completeLesson(id: string) {
  const p = load();
  if (!p.lessons[id]) { p.lessons[id] = Date.now(); save(p); }
}

export function passQuiz(id: string) {
  const p = load();
  p.quizzes[id] = p.quizzes[id] ?? Date.now();
  p.lessons[id] = p.lessons[id] ?? Date.now();
  save(p);
}

export function reset() { save({ lessons: {}, quizzes: {} }); }

// Other tabs keep in step
addEventListener('storage', (e) => { if (e.key === KEY) dispatchEvent(new CustomEvent('progress')); });
