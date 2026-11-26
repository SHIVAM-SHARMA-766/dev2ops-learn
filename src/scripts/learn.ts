// Client behaviour: accent palettes, lesson completion, quizzes, course
// progress bars and sidebar checkmarks. Progress lives in this browser.
import { load, completeLesson, passQuiz } from './progress';

const PREFS = 'dl.prefs.v1';
const readPrefs = () => { try { return JSON.parse(localStorage.getItem(PREFS) ?? '{}'); } catch { return {}; } };
const writePrefs = (p: object) => { try { localStorage.setItem(PREFS, JSON.stringify({ ...readPrefs(), ...p })); } catch {} };

function markPalette() {
  document.querySelectorAll<HTMLElement>('[data-learn-palette]').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.learnPalette === document.documentElement.dataset.palette)));
}

function refresh() {
  const done = new Set(Object.keys(load().lessons));
  document.querySelectorAll<HTMLAnchorElement>('#starlight__sidebar a[href]').forEach((a) => {
    const id = a.getAttribute('href')!.replace(/^\/|\/$/g, '');
    a.classList.toggle('lesson-done', done.has(id));
  });
  document.querySelectorAll<HTMLButtonElement>('[data-complete]').forEach((b) => {
    if (done.has(b.dataset.complete!)) { b.disabled = true; b.textContent = '✓ Lesson completed'; }
  });
  document.querySelectorAll<HTMLElement>('[data-course-progress]').forEach((el) => {
    const lessons: string[] = JSON.parse(el.dataset.lessons || '[]');
    const n = lessons.filter((l) => done.has(l)).length;
    el.style.setProperty('--cp', String(lessons.length ? n / lessons.length : 0));
    if (el.hasAttribute('data-full')) {
      el.querySelector('.cp-text')!.textContent = `${n} of ${lessons.length} lessons completed`;
      const next = lessons.find((l) => !done.has(l));
      const a = el.querySelector<HTMLAnchorElement>('[data-cp-next]');
      if (a) {
        if (next) { a.href = `/${next}/`; a.textContent = n ? 'Continue where you left off →' : 'Start the course →'; }
        else { a.removeAttribute('href'); a.textContent = '🎓 Course complete!'; }
      }
    } else if (el.classList.contains('course-mini')) {
      el.textContent = lessons.length ? `${n}/${lessons.length} lessons` : '';
    }
  });
}

export function initLearn() {
  markPalette();
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const pal = t.closest<HTMLElement>('[data-learn-palette]');
    if (pal) {
      document.documentElement.dataset.palette = pal.dataset.learnPalette!;
      writePrefs({ palette: pal.dataset.learnPalette });
      markPalette();
    }
    const done = t.closest<HTMLButtonElement>('[data-complete]');
    if (done) completeLesson(done.dataset.complete!);
  });

  document.querySelectorAll<HTMLFormElement>('form[data-quiz]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let right = 0;
      const qs = form.querySelectorAll<HTMLFieldSetElement>('.quiz-q');
      qs.forEach((fs) => {
        const chosen = fs.querySelector<HTMLInputElement>('input:checked');
        const ok = !!chosen && Number(chosen.value) === Number(fs.dataset.answer);
        if (ok) right++;
        fs.classList.toggle('is-right', ok);
        fs.classList.toggle('is-wrong', !ok);
        const why = fs.querySelector<HTMLElement>('.quiz-why');
        if (why) why.hidden = false;
      });
      const result = form.querySelector('.quiz-result')!;
      if (right === qs.length) {
        result.textContent = `All ${right} correct — well done! Lesson marked complete.`;
        passQuiz(form.dataset.quiz!);
      } else {
        result.textContent = `${right} of ${qs.length} correct. Read the explanations and try again.`;
      }
    });
  });

  addEventListener('progress', refresh);
  refresh();
}
