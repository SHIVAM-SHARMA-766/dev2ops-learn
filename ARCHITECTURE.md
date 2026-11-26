# Architecture

A static Starlight site built from Markdown courses, deployed by GitHub Actions to a
directory on the web host and served by that host's Caddy.

```
courses/ ─┐
src/      ├─ astro build ─► dist/ ──rsync (rrsync-confined key)──► /srv/dev2ops-learn/site
config    ┘                                                         └─ Caddy: learn.dev2ops.in
```

## Layout

| Path | What it is |
|---|---|
| `site.config.json` | Title, description, URL, author, repo link, previous hostnames (redirected) |
| `courses/<course>/` | `course.json` (metadata, chapters, status), `index.md` (overview), one folder per chapter with lesson `.md` files |
| `astro.config.mjs` | Starlight config; builds the sidebar from `course.json` chapters and lesson `sidebar.order` |
| `src/content.config.ts` | The `docs` collection reads `courses/` (draft courses excluded); lesson front matter adds `difficulty`, `minutes`, `lab`, `quiz` |
| `src/components/` | Starlight overrides: `Head` (accent colour before paint), `ThemeSelect` (accent dots + dark/light), `Footer` (quiz, mark complete, course progress) |
| `src/scripts/progress.ts` | Progress in `localStorage` (`dl.progress.v1`): completed lessons and passed quizzes; syncs across tabs |
| `src/scripts/learn.ts` | Quizzes, "mark complete", progress bars, sidebar ticks, accent colour |
| `src/pages/index.astro` | Home: hero and course cards with progress |
| `tests/` | `build.test.mjs` (every published lesson built, sitemap) and `e2e.mjs` (browser: quiz → completion → persistence) |
| `deploy/` | `Caddyfile.tmpl` (this site's Caddy block) and `setup-server.sh` |

## Content model

Courses live outside `src/content/docs`, so two Starlight settings matter:
`markdown.processedDirs` includes `./courses` (callouts and heading links), and the
sidebar is built explicitly from `course.json` (Starlight's `autogenerate` only sees
`src/content/docs`). Lesson ids are `course/chapter/lesson`; a course's lesson order is
chapter order from `course.json`, then `sidebar.order`.

## Progress

No accounts: progress is per browser. A lesson is complete when the learner presses
"Mark lesson complete" or passes its quiz (all answers right). Course progress is the
share of its lessons completed. Accent colour is stored in `dl.prefs.v1`.

## Hosting and deploy

The site shares an always-free OCI VM (and its Caddy) with other projects but nothing
else: its own deploy user, directory and Caddy file.

- `deploy/setup-server.sh` (run by the owner) creates the `learn` user, whose SSH key
  may only rsync inside `/srv/dev2ops-learn` (`rrsync`), and writes
  `/etc/caddy/sites/dev2ops-learn.caddy` from `deploy/Caddyfile.tmpl`. The host's main
  Caddyfile (written by the portfolio's setup) imports `/etc/caddy/sites/*.caddy`.
- CI (`.github/workflows/ci.yml`) builds and tests every push and pull request; on `main`
  it rsyncs `dist/` to `site/` and smoke-tests the live URL.
- DNS: `learn.dev2ops.in` A record → the VM (Hostinger DNS).

## Gotchas

- Bundled build code can't rely on `import.meta.url`; `src/lib/courses.ts` resolves
  `courses/` from `process.cwd()` (builds run from the project root).
- Astro caches rendered Markdown in `.astro/` and `node_modules/.astro`; delete them after
  changing Markdown plugins.
- Lesson "last updated" dates come from git history (CI checks out with full history).
