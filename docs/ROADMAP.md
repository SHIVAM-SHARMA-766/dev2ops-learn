# Roadmap & known limitations

A single polished course (**Docker from zero** — 74 lessons across 18 chapters,
beginner-first, from the "works on my machine" problem to the kernel internals,
security, production and orchestration) on a reusable step-player platform.

## Done

- [x] Astro (static) + React islands; static `dist/` on the existing pipeline
- [x] Content model: `course.json` + YAML lessons (`scene` + `steps` + `quiz`)
- [x] Step-player engine: 3 panes, step timeline, auto-play
- [x] Widget library: text/code/compare (`codeWalk`, `terminalReplay`,
      `stagedReveal`, `compare`, `diagram`), animated 2D (`flow`, `packetJourney`,
      `buildCache`, `sizeScale`, `layerStack`, `vmVsContainer`, `volumeScene`,
      `isolationBox`, `problemScene`, `shipScene`, `iconReveal`), and **3D**
      (`layers3d`, lazy-loaded three.js)
- [x] **Graphics**: hand-crafted illustrated SVG (gradients, isometric depth,
      shadows) + vendored real brand logos (Devicon) / icons (Tabler)
- [x] Flagship animation quality: travelling packets on isometric grids, real
      WebGL 3D with drag-to-rotate — chosen per concept, not 3D-everywhere
- [x] Celebration (confetti + toast), per-lesson quiz
- [x] **Progress**: per-browser; home + course cards + sidebar show per-course /
      per-chapter progress, ticks, Resume, Reset; per-lesson resume-at-step
- [x] **Search** (Ctrl+K); **gamification** (XP, streak, achievement badges)
- [x] **UX**: collapsible chapter sidebar, mobile drawer, prev/next-lesson
      arrows + `[` `]`, breadcrumb, lesson transitions, 3D loading state
- [x] **a11y**: reduced-motion support, focus rings, skip-to-content, aria-labels
- [x] Light/dark + per-course accent; theme-contrast fixes; sitemap; OG meta
- [x] three.js code-split so only the 2 3D lessons download it

## Next

- [ ] **Lesson validation** at build time (zod schema for YAML, clear errors)
- [ ] **More widgets** as new concepts need them (timeline/sequence, metric tiles)
- [ ] **A second course** (Git / Linux / CI-CD / Kubernetes) on the same engine
- [ ] Richer narration Markdown (tables, links, inline images)
- [ ] Optional **Open Graph image** per course/lesson for nicer link previews
- [ ] **Practice / Cheatsheets** tabs, as the reference apps have

## Later

- [ ] More 3D scenes for other genuinely spatial concepts (kept deliberate —
      not everything should be 3D)
- [ ] Optional per-course theming beyond the accent (fonts, cover art)

## Known limitations

- The narration Markdown renderer is intentionally tiny (bold, italic, inline
  code, bullet lists, paragraphs) — no tables, images or links in narration yet.
  Note: in YAML, quote any `kind`/`text`/quiz string containing backticked code
  with a colon-space (e.g. `` `<<: *common` ``) or the build fails.
- The player ships JavaScript (`client:load`); the rest of the site is static.
  The 3D widget's three.js is a separate chunk, loaded only on 3D lessons.
- Completion marks when the learner reaches the last step; the quiz is
  reinforcement, not a gate.
- Widget props are not yet schema-validated — a typo in a lesson's `scene`
  surfaces as a blank or an "Unknown widget" note rather than a build error.
