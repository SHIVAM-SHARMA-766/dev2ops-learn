# dev2ops learn

An interactive course platform at **[learn.dev2ops.in](https://learn.dev2ops.in)**.
One site, many courses. Each lesson is a sequence of **steps** that drive a live
visual on screen — watch a container's lifecycle, a Dockerfile build layer by
layer, a request travel hop by hop — then answer a short quiz.

- **A step player, not a wall of text.** Left: chapter tree with progress.
  Centre: a visual that reacts to the current step. Right: the narration. Move
  with the arrow keys.
- **Courses are content, not code.** A course is a folder of YAML lessons;
  adding one needs no code change.
- **Reusable visuals.** Lessons compose a shared library of widgets
  (staged reveal, code walkthrough, node diagram, …) — so a new course is
  authored, not engineered.
- **Progress saved in your browser.** Completed lessons, progress bars, sidebar
  ticks. No sign-up, nothing sent anywhere.
- **Light and dark**, a per-course accent colour.
- **$0 to run.** A static site on an always-free Oracle Cloud VM, deployed by
  GitHub Actions.

Built with [Astro](https://astro.build) (static) and React islands.

## Run it

```sh
npm install
npm run dev          # http://localhost:4322
npm run build        # dist/
npm test             # build checks (run after build)
```

Node 22.23 or newer (see `.nvmrc`).

## Write a course

```
courses/
└── docker/
    ├── course.json              title, tagline, accent, icon, level, order, status, chapters
    └── introduction/            one folder per chapter (slug from course.json)
        └── what-is-docker.yml   one lesson
```

A lesson is a YAML file: metadata, one `scene` (the on-screen visual) and an
ordered list of `steps`. The scene reacts to the active step.

```yaml
title: What is Docker?
summary: Why containers exist.
minutes: 8
difficulty: beginner

scene:
  widget: stagedReveal          # see src/islands/widgets/
  items:
    - { label: Your code, note: The program you wrote. }
    - { label: + Runtime, note: The version it needs. }

steps:
  - kind: PROBLEM               # the small badge in the narration panel
    title: "“Works on my machine”"
    label: The problem          # short label for the step timeline
    body: Your app runs here and breaks there…
    callout: { kind: KEY IDEA, text: Environment drift, not bugs. }

quiz:
  - question: What does a container share with its host?
    options: [Nothing, The host's kernel]
    answer: 1
    explanation: Containers are processes on the host kernel.
```

Set `status: published` in `course.json` to include a course in production
builds; anything else is visible only in `npm run dev`.

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for the content model and the widget
API, and **[docs/ROADMAP.md](docs/ROADMAP.md)** for what's next.
