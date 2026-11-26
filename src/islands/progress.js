// Per-browser progress, stored in localStorage. No account, nothing leaves the
// device. Shape: { "<course>": { completed: { "<chapter>/<lesson>": ts }, last: "<path>" } }
const KEY = 'd2o-progress';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* private mode / blocked — progress just won't persist */
  }
}

export function getCourseProgress(course) {
  const all = readAll();
  return all[course] || { completed: {}, last: null };
}

export function isLessonDone(course, chapter, lesson) {
  const p = getCourseProgress(course);
  return Boolean(p.completed[`${chapter}/${lesson}`]);
}

export function markLessonDone(course, chapter, lesson) {
  const all = readAll();
  const cp = all[course] || { completed: {}, last: null };
  cp.completed[`${chapter}/${lesson}`] = Date.now();
  all[course] = cp;
  writeAll(all);
}

export function setLast(course, path) {
  const all = readAll();
  const cp = all[course] || { completed: {}, last: null };
  cp.last = path;
  all[course] = cp;
  writeAll(all);
}

export function completedCount(course) {
  const p = getCourseProgress(course);
  return Object.keys(p.completed).length;
}
