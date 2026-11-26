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

export function setLast(course, path, title, courseTitle) {
  const all = readAll();
  const cp = all[course] || { completed: {}, last: null };
  cp.last = path;
  all[course] = cp;
  // global pointer for "continue where you left off" on home
  all._resume = { course, courseTitle: courseTitle || course, path, title: title || '', ts: Date.now() };
  writeAll(all);
}

export function completedCount(course) {
  const p = getCourseProgress(course);
  return Object.keys(p.completed).length;
}

/** Remember / recall the step a learner was on within a lesson. */
export function setStepAt(course, chapter, lesson, idx) {
  const all = readAll();
  const cp = all[course] || { completed: {}, last: null };
  cp.stepAt = cp.stepAt || {};
  cp.stepAt[`${chapter}/${lesson}`] = idx;
  all[course] = cp;
  writeAll(all);
}

export function getStepAt(course, chapter, lesson) {
  const cp = getCourseProgress(course);
  return (cp.stepAt && cp.stepAt[`${chapter}/${lesson}`]) ?? 0;
}

/** Most recently opened lesson across all courses, or null. */
export function getResume() {
  const all = readAll();
  return all._resume || null;
}

// ---- gamification --------------------------------------------------------

function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function computeStreak(dayset) {
  const msDay = 86400000;
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const base = t.getTime();
  let start;
  if (dayset.has(dayKey(base))) start = base;
  else if (dayset.has(dayKey(base - msDay))) start = base - msDay;
  else return 0;
  let streak = 0;
  for (let i = 0; ; i++) {
    if (dayset.has(dayKey(start - i * msDay))) streak++;
    else break;
  }
  return streak;
}

const ACHIEVEMENTS = [
  { id: 'first', icon: '🌱', name: 'First steps', desc: 'Finish your first lesson', test: (s) => s.count >= 1 },
  { id: 'five', icon: '🔥', name: 'On a roll', desc: 'Finish 5 lessons', test: (s) => s.count >= 5 },
  { id: 'ten', icon: '🐳', name: 'Whale hello there', desc: 'Finish 10 lessons', test: (s) => s.count >= 10 },
  { id: 'twentyfive', icon: '⚙️', name: 'Well-oiled', desc: 'Finish 25 lessons', test: (s) => s.count >= 25 },
  { id: 'streak2', icon: '📅', name: 'Two in a row', desc: 'A 2-day streak', test: (s) => s.streak >= 2 },
  { id: 'streak7', icon: '🗓️', name: 'Week warrior', desc: 'A 7-day streak', test: (s) => s.streak >= 7 },
  { id: 'done', icon: '🏆', name: 'Completionist', desc: 'Finish every lesson', test: (s) => s.total > 0 && s.count >= s.total },
];

/** Aggregate stats across all courses for the home gamification card. */
export function getStats(total = 0) {
  const all = readAll();
  let tss = [];
  for (const k of Object.keys(all)) {
    if (k.startsWith('_')) continue;
    tss = tss.concat(Object.values(all[k].completed || {}));
  }
  const count = tss.length;
  const xp = count * 10;
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const streak = computeStreak(new Set(tss.map(dayKey)));
  const base = { count, xp, level, xpInLevel, streak, total };
  const achievements = ACHIEVEMENTS.map((a) => ({ id: a.id, icon: a.icon, name: a.name, desc: a.desc, unlocked: a.test(base) }));
  return { ...base, achievements };
}
