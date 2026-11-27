# Architecture

A static Astro site. Pages (home, course overview, lesson) are generated at
build time; the lesson **step player** is a React island. Output is a plain
`dist/`, deployed by GitHub Actions to a directory on the web host and served by
that host's Caddy.

```
courses/ ─┐
src/      ├─ astro build ─► dist/ ──rsync (rrsync-confined key)──► /srv/dev2ops-learn/site
config    ┘                                                         └─ Caddy: learn.dev2ops.in
```

## Layout

| Path | What it is |
|---|---|
| `site.config.json` | Title, description, URL, author, repo link, previous hostnames (redirected) |
| `courses/<course>/` | `course.json` (metadata + chapters) and one folder per chapter holding lesson `.yml` files |
| `src/lib/courses.js` | The content loader: reads `courses/` at build time, returns courses, chapters, lessons and step data |
| `src/pages/index.astro` | Home: hero + course catalogue cards |
| `src/pages/[course]/index.astro` | Course overview: chapters and lessons |
| `src/pages/[course]/[chapter]/[lesson].astro` | Mounts `<StepPlayer>` with the course tree, the lesson, and prev/next |
| `src/islands/StepPlayer.jsx` | The lesson engine: three panes + step timeline, keyboard nav, progress. Renders every lesson. |
| `src/islands/widgets/` | The visual widget library + `Scene` dispatcher (the registry) |
| `src/islands/progress.js` | Progress in `localStorage` (`d2o-progress`): completed lessons per course, last opened |
| `src/islands/md.jsx` | A tiny Markdown renderer for narration (no bundle dependency) |
| `src/layouts/Base.astro`, `src/components/TopNav.astro` | Page shell, theme toggle, nav |
| `src/styles/app.css`, `src/styles/player.css` | Design tokens + chrome, and the player/widget styles |
| `tests/build.test.mjs` | Build checks (every published lesson built, has steps, sitemap) |
| `deploy/` | `Caddyfile.tmpl` (this site's Caddy block) and `setup-server.sh` |

## Content model

A course is a folder with `course.json` (title, `tagline`, `accent`, `icon`,
`level`, `order`, `status`, `chapters[]`). Each chapter is a folder named by its
`slug`; each lesson is a `.yml` file in it.

A lesson has:

- **metadata** — `title`, `summary`, `minutes`, `difficulty`, `order`
- **`scene`** — one visual, `{ widget, ...props }`. It stays on screen for the
  whole lesson and receives the active step index. A step may override it with
  its own `viz`.
- **`steps[]`** — ordered. Each is `{ kind, title, label, body, callout? }`.
  `kind` is the badge (CONCEPT, PROBLEM, …); `label` is the short step-timeline
  caption; `body` is Markdown narration; `callout` is an optional highlighted
  aside `{ kind, text }`.
- **`quiz[]`** — optional `{ question, options[], answer, explanation }`, shown
  on the final step.

Only `status: "published"` courses build in production (`NODE_ENV=production`);
the rest are visible in `npm run dev`. Lesson order is chapter order from
`course.json`, then each lesson's `order`.

## The step player

`StepPlayer` is one React component used by every lesson. State is the active
step index. Arrow keys (or `h`/`l`) and the clickable timeline move between
steps; reaching the last step marks the lesson complete. The left pane renders
the course tree with completion ticks and a progress bar, hydrated from
`localStorage` after mount (so server and client markup match).

## The widget library

This is what lets the platform scale: a lesson *composes* widgets instead of
shipping custom code. `src/islands/widgets/index.jsx` is a registry mapping a
widget name to a React component; `scene.widget` (or `step.viz.widget`) selects
one and the rest of the object is its props, plus `activeStep` and `steps`.

Pick the medium per concept — don't animate for its own sake. Rough guide:
3D for stacking/volume, flow for movement/network, terminal for commands,
codeWalk for files, compare for comparisons, diagram for branching state
machines, illustrated scenes for metaphors.

Current widgets:

- **Text / code / compare** — `codeWalk` (code block, lines light up per step,
  copy button), `terminalReplay` (fake terminal revealing command/output blocks),
  `stagedReveal` (a column revealed one per step), `compare` (two columns with
  per-step row highlight), `diagram` (node/edge graph, `active[stepIndex]` lights
  nodes — good for branching state machines).
- **Animated 2D scenes** — `flow` (a dot travels a path one hop per step),
  `packetJourney` (a glowing packet continuously loops the active hop on an
  isometric grid, flowing dashed connector, real logos at nodes — the flagship
  flow), `buildCache` (animated `docker build`, CACHED/BUILDING per step),
  `sizeScale` (bars shrinking), `layerStack` (2D layer stack), `vmVsContainer`,
  `volumeScene`, `isolationBox`, `problemScene`, `shipScene`, `iconReveal`
  (real logos/icons revealed per step).
- **3D (WebGL)** — `layers3d`: a real three.js scene (lit slabs, soft shadows,
  drag-to-rotate, auto-orbit). **Lazy-loaded** via a client-only dynamic import
  so three.js is a separate chunk, downloaded only on the 3D lessons — the other
  lessons' island bundle stays ~37KB.

Add a component to `index.jsx` and register it, and every course can use it.

The player also has **auto-play** (Play/Replay + space) and keyboard nav
(← → steps, `[` `]` lessons, `R` replay, Ctrl+K search, `?` help).

## Graphics & assets

Scenes are drawn with a hand-crafted SVG illustration library
(`src/islands/widgets/illustrations.jsx`): a shipping container, laptop, server,
database, cloud and box, with gradients, isometric depth and soft shadows
(render `<ArtDefs/>` once per scene `<svg>`).

Real brand logos and icons live under `public/art/` (`logos/` from Devicon,
`icons/` from Tabler — both MIT, see `public/art/LICENSES.md`) and are vendored
locally by `scripts/fetch-art.mjs` (copies from the `devicon` / `@tabler/icons`
npm packages — the npm registry is reachable where raw GitHub is not). They're
served via `<img>` / `<Logo>` (brand colour) or a CSS mask (tinted to the
accent), never from a CDN, so the build stays $0 and offline.

## Progress

No accounts: progress is per browser, in `localStorage` under `d2o-progress`,
shaped `{ "<course>": { completed: { "<chapter>/<lesson>": ts }, last, stepAt },
_resume: {...} }` (`stepAt` resumes a lesson at its step; `_resume` is the
most-recent lesson for the home "continue" banner). Reads/writes are wrapped in
try/catch so private mode just doesn't persist. The static home and course pages
read it with small inline progressive-enhancement scripts to show per-course /
per-chapter progress, ticks and Resume; the sidebar and `StatsCard` island read
it directly.

## Hosting and deploy

The site shares an always-free OCI VM (and its Caddy) with other projects but
nothing else: its own deploy user, directory and Caddy file. The build is a
plain static `dist/`, so this pipeline is unchanged from the previous stack.

- `deploy/setup-server.sh` (run by the owner) creates the `learn` user, whose
  SSH key may only rsync inside `/srv/dev2ops-learn` (`rrsync`), and writes
  `/etc/caddy/sites/dev2ops-learn.caddy` from `deploy/Caddyfile.tmpl`. The host's
  main Caddyfile (written by the portfolio's setup) imports
  `/etc/caddy/sites/*.caddy`.
- CI (`.github/workflows/ci.yml`) builds and tests every push and PR; on `main`
  it rsyncs `dist/` to `site/`.
- DNS: `learn.dev2ops.in` A record → the VM (Hostinger DNS).

## Gotchas

- Bundled build code can't rely on `import.meta.url`; `src/lib/courses.js`
  resolves `courses/` from `process.cwd()` (builds run from the project root).
- Fonts load from Google Fonts; the Caddy CSP already allows
  `fonts.googleapis.com` / `fonts.gstatic.com`.
- The player is `client:load` — it is interactive, so it ships JS. Keep the
  widget bundle lean.
