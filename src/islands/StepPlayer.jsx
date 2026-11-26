// StepPlayer — the lesson engine. Three panes (chapter tree · scene · step
// narration) plus a step timeline. Steps drive the scene; progress is saved
// per browser. This one component renders every lesson of every course.
import React, { useState, useEffect, useCallback } from 'react';
import '../styles/player.css';
import { Scene } from './widgets/index.jsx';
import { Markdown } from './md.jsx';
import { isLessonDone, markLessonDone, setLast, getStepAt, setStepAt } from './progress.js';
import { confetti } from './celebrate.js';

export default function StepPlayer({ course, tree, lesson, prev, next }) {
  const steps = lesson.steps || [];
  const total = steps.length;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState({}); // "chapter/slug" -> true, hydrated on client
  const [toast, setToast] = useState(null);
  const [playing, setPlaying] = useState(false);
  const current = steps[step] || {};

  const go = useCallback(
    (to) => setStep((s) => Math.max(0, Math.min(total - 1, typeof to === 'function' ? to(s) : to))),
    [total],
  );

  // hydrate completion ticks + remember this lesson as "last opened"
  useEffect(() => {
    const map = {};
    for (const ch of tree) for (const l of ch.lessons) {
      if (isLessonDone(course.slug, ch.slug, l.slug)) map[`${ch.slug}/${l.slug}`] = true;
    }
    setDone(map);
    setLast(course.slug, `/${course.slug}/${lesson.chapter}/${lesson.slug}`, lesson.title, course.title);
    // resume at the step the learner left on (if mid-lesson)
    const saved = getStepAt(course.slug, lesson.chapter, lesson.slug);
    if (saved > 0 && saved < total - 1) {
      setStep(saved);
      setToast(`Resumed at step ${saved + 1} · press ← to go back`);
      setTimeout(() => setToast(null), 2600);
    }
  }, [course.slug, course.title, lesson.chapter, lesson.slug, lesson.title, tree, total]);

  // remember the current step for next time
  useEffect(() => {
    setStepAt(course.slug, lesson.chapter, lesson.slug, step);
  }, [step, course.slug, lesson.chapter, lesson.slug]);

  // reaching the final step completes the lesson — celebrate the first time
  useEffect(() => {
    if (total > 0 && step === total - 1) {
      const key = `${lesson.chapter}/${lesson.slug}`;
      const wasDone = isLessonDone(course.slug, lesson.chapter, lesson.slug);
      markLessonDone(course.slug, lesson.chapter, lesson.slug);
      setDone((d) => ({ ...d, [key]: true }));
      if (!wasDone) {
        const courseComplete = !next;
        confetti(courseComplete ? { count: 160, duration: 2800 } : { count: 70 });
        setToast(courseComplete ? '🎉 Course complete! You finished it.' : '✓ Lesson complete!');
        const t = setTimeout(() => setToast(null), courseComplete ? 5000 : 2600);
        return () => clearTimeout(t);
      }
    }
  }, [step, total, course.slug, course.title, lesson.chapter, lesson.slug, next]);

  // keyboard: ← / → (and h / l) move between steps; space toggles auto-play
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowRight' || e.key === 'l') { e.preventDefault(); setPlaying(false); go((s) => s + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'h') { e.preventDefault(); setPlaying(false); go((s) => s - 1); }
      else if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p); }
      else if (e.key === 'r' || e.key === 'R') { e.preventDefault(); setPlaying(false); go(0); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // auto-play: advance a step on a timer, stop at the end
  useEffect(() => {
    if (!playing) return;
    if (step >= total - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep((s) => Math.min(total - 1, s + 1)), 2600);
    return () => clearTimeout(t);
  }, [playing, step, total]);

  const scene = current.viz || lesson.scene; // per-step override, else lesson scene
  const doneCount = Object.keys(done).length;
  const atLast = step === total - 1;

  return (
    <div className="player" data-accent={course.accent}>
      {toast && <div className="player__toast mono" role="status">{toast}</div>}
      {/* ---- left: chapter tree + progress ---- */}
      <aside className="player__side">
        <a className="side__course" href="/">
          <span className="side__icon">{course.icon || '◆'}</span>
          <span>
            <span className="side__coursetitle mono">{course.title}</span>
            <span className="side__coursemeta mono">{course.lessonCount} lessons</span>
          </span>
        </a>

        <div className="side__progress">
          <div className="side__progressbar">
            <span style={{ width: `${course.lessonCount ? (doneCount / course.lessonCount) * 100 : 0}%` }} />
          </div>
          <span className="side__progresstext mono">{doneCount} / {course.lessonCount}</span>
        </div>

        <nav className="side__tree" aria-label="Lessons">
          {tree.map((ch, ci) => (
            <div key={ch.slug} className="side__chapter">
              <div className="side__chaptertitle mono">
                <span className="side__chapternum">{String(ci + 1).padStart(2, '0')}</span>
                {ch.title}
              </div>
              <ul className="side__lessons">
                {ch.lessons.map((l) => {
                  const isCurrent = ch.slug === lesson.chapter && l.slug === lesson.slug;
                  const isDone = done[`${ch.slug}/${l.slug}`];
                  return (
                    <li key={l.slug}>
                      <a href={l.path} className={`side__lesson ${isCurrent ? 'is-current' : ''}`} aria-current={isCurrent ? 'page' : undefined}>
                        <span className={`side__tick ${isDone ? 'is-done' : ''}`} aria-hidden="true">
                          {isDone ? '✓' : '○'}
                        </span>
                        <span>{l.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* ---- center: scene + timeline ---- */}
      <section className="player__stage">
        <div className="stage__head">
          <div>
            <div className="stage__crumb mono">{course.title} · {lesson.chapter}</div>
            <h1 className="stage__title">{lesson.title}</h1>
          </div>
          <div className="stage__meta">
            {lesson.minutes && <span className="badge">{lesson.minutes} min</span>}
            {lesson.difficulty && <span className="badge">{lesson.difficulty}</span>}
            <span className="badge">{total} steps</span>
          </div>
        </div>

        <div className="stage__canvas card">
          <Scene scene={scene} activeStep={step} steps={steps} />
        </div>

        <div className="stage__timeline">
          <div className="timeline__label mono">
            <span className="timeline__labelleft">
              <button
                className="timeline__play"
                onClick={() => (atLast ? (go(0), setPlaying(true)) : setPlaying((p) => !p))}
                title={playing ? 'Pause (space)' : 'Play (space)'}
              >
                {playing ? '❚❚ Pause' : atLast ? '↺ Replay' : '▶ Play'}
              </button>
              In this lesson
            </span>
            <span>Step {step + 1} of {total}</span>
          </div>
          <ol className="timeline__steps">
            {steps.map((s, i) => (
              <li key={i}>
                <button
                  className={`timeline__step ${i === step ? 'is-active' : ''} ${i < step ? 'is-past' : ''}`}
                  onClick={() => go(i)}
                  title={s.label || s.title}
                >
                  <span className="timeline__num mono">{i + 1}</span>
                  <span className="timeline__text">{s.label || s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- right: step narration ---- */}
      <aside className="player__rail">
        <div className="rail__scroll">
          <div className="rail__head mono">
            <span>Step {step + 1} / {total}</span>
            {current.kind && <span className="rail__kind">{current.kind}</span>}
          </div>
          <h2 className="rail__title">{current.title}</h2>
          <div className="rail__body">
            <Markdown text={current.body} />
          </div>

          {current.callout && (
            <div className="rail__callout">
              <div className="rail__calloutkind mono">{current.callout.kind || 'NOTE'}</div>
              <div className="rail__callouttext"><Markdown text={current.callout.text} /></div>
            </div>
          )}

          {atLast && lesson.quiz && lesson.quiz.length > 0 && (
            <Quiz quiz={lesson.quiz} />
          )}
        </div>

        <div className="rail__nav">
          <button className="btn" onClick={() => go((s) => s - 1)} disabled={step === 0}>← Back</button>
          {atLast ? (
            next ? (
              <a className="btn btn--accent" href={next.path}>Next lesson →</a>
            ) : (
              <span className="btn btn--accent" aria-disabled="true">Course complete ✓</span>
            )
          ) : (
            <button className="btn btn--accent" onClick={() => go((s) => s + 1)}>
              Next: {steps[step + 1]?.label || steps[step + 1]?.title || 'continue'} →
            </button>
          )}
        </div>
        <div className="rail__hint mono">← → step · space play/pause · click a step</div>
      </aside>
    </div>
  );
}

function Quiz({ quiz }) {
  return (
    <div className="rail__quiz">
      <div className="rail__quiztitle mono">Check your understanding</div>
      {quiz.map((q, qi) => (
        <QuizItem key={qi} q={q} />
      ))}
    </div>
  );
}

function QuizItem({ q }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="quizitem">
      <div className="quizitem__q">{q.question}</div>
      <div className="quizitem__opts">
        {q.options.map((opt, oi) => {
          const chosen = picked === oi;
          const correct = oi === q.answer;
          const cls = picked == null ? '' : correct ? 'is-correct' : chosen ? 'is-wrong' : '';
          return (
            <button key={oi} className={`quizitem__opt ${cls}`} onClick={() => setPicked(oi)} disabled={picked != null}>
              {opt}
            </button>
          );
        })}
      </div>
      {picked != null && q.explanation && <div className="quizitem__exp">{q.explanation}</div>}
    </div>
  );
}
