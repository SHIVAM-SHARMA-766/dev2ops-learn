# Roadmap & known limitations

The platform is being built in phases. What exists now is a working vertical
slice: the content model, the step-player engine, three visual widgets, the home
and course pages, progress, light/dark, and the static build on the existing
deploy pipeline. One course (Docker) is authored on it.

## Done

- [x] Astro (static) + React islands, replacing the Starlight docs theme
- [x] Content model: `course.json` + YAML lessons with `scene` and `steps`
- [x] Step-player engine: 3 panes, keyboard nav, step timeline
- [x] Widget library v1: `stagedReveal`, `codeWalk`, `diagram`
- [x] Home catalogue, course overview, 404
- [x] Per-browser progress (completed ticks, progress bars)
- [x] Light/dark + per-course accent
- [x] Build checks green; sitemap
- [x] Widgets: `terminalReplay` (animated terminal) and `compare` (before/after)
- [x] Copy-to-clipboard on code and terminal widgets
- [x] Completion celebration: confetti + toast on lesson/course complete
- [x] "Continue where you left off" banner on the home page
- [x] Animated widgets: `flow` (travelling dot, hop per step) and `buildCache`
      (live docker build: CACHED / BUILDING)
- [x] Auto-play: Play / Replay control + space bar steps a lesson like an animation
- [x] Pro-tier chapters: Securing containers, Going to production
- [x] Docker now ~37 lessons across 12 chapters, from the kernel up:
      Getting started · Under the hood · Images & containers · Building images ·
      Advanced builds · Data & volumes · Networking · Compose · Security ·
      Production · Beyond one host · Operating & debugging

## Next

Goal: Docker covers *everything*, in a fun way. Candidate additions —

- [ ] **Data deep**: tmpfs mounts, volume backup/restore, volume drivers
- [ ] **Compose deep**: profiles, override files, env interpolation, `build:` in Compose
- [ ] **Registry deep**: run your own registry, image signing (cosign), content trust
- [ ] **Dev workflow**: `docker init`, dev containers, hot reload, debugging apps
- [ ] **Observability**: logging drivers, log rotation, monitoring containers
- [ ] **A cheatsheet / command reference** chapter
- [ ] **Search** (Ctrl+K) across lessons — navigation matters at 37+ lessons
- [ ] **Achievements / streak / XP** — lightweight, fun progress on top of ticks
- [ ] **More widgets** — timeline/sequence, metric tiles, annotated screenshot
- [ ] **Lesson validation** at build time (zod schema for YAML) with clear errors
- [ ] Keyboard shortcut help overlay (press `?`)

- [ ] **Search** (Ctrl+K) across lessons and concepts
- [ ] **Achievements / streak / XP** — lightweight, fun progress on top of ticks
- [ ] **Per-lesson resume** — reopen at the step you left on
- [ ] **More widgets** — timeline/sequence, metric tiles, annotated screenshot
- [ ] **Lesson validation** at build time (zod schema for YAML) with clear errors
- [ ] **Cheatsheets / Practice** tabs, as the templates have
- [ ] Keyboard shortcut help overlay (press `?`)

## Later

- [ ] **Bespoke, hand-animated scenes** for flagship lessons (added as their own
      widgets) — the per-lesson custom visuals are open-ended by nature
- [ ] Per-lesson "resume at step" memory
- [ ] Optional per-course theming beyond the accent (fonts, cover art)

## Known limitations

- The narration Markdown renderer is intentionally tiny (bold, italic, inline
  code, bullet lists, paragraphs). It is not full Markdown — no tables, images or
  links in narration yet.
- The player ships JavaScript (`client:load`); the rest of the site is static.
- Completion marks when the learner reaches the last step; the quiz is
  reinforcement, not a gate.
- Widget props are not yet schema-validated — a typo in a lesson's `scene`
  surfaces as a blank or an "Unknown widget" note rather than a build error.
