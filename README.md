# dev2ops learn

Free, hands-on DevOps courses at **[learn.dev2ops.in](https://learn.dev2ops.in)**: short
lessons, real commands, and a quiz at the end of each one.

- **Courses → chapters → lessons**, written in Markdown
- **Quizzes** with explanations; passing one completes the lesson
- **Progress saved in your browser**: completed lessons, course progress bars, sidebar
  ticks, "continue where you left off". No sign-up, nothing sent anywhere
- **Light and dark**, four accent colours, full-text search
- **$0 to run**: a static site on an always-free Oracle Cloud VM, deployed by GitHub Actions

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## Run it

```sh
npm install
npm run dev          # http://localhost:4322
npm run build        # dist/
npm test             # build checks
npm run test:e2e     # browser test (CHROME_PATH=/path/to/chrome if not /usr/bin/chromium)
```

Node 22.23 or newer (see `.nvmrc`).

## Write a course

```
courses/
└── docker/
    ├── course.json          title, description, level, duration, icon, status, chapters
    ├── index.md             the course overview page
    └── introduction/        one folder per chapter (slug from course.json)
        └── what-is-docker.md
```

A lesson is Markdown with front matter:

```yaml
---
title: What is Docker?
description: Containers, images and why they matter.
sidebar: { order: 1 }
difficulty: beginner
minutes: 10
quiz:
  - question: What does an image contain?
    options: [A running process, A filesystem and metadata, A virtual machine]
    answer: 1
    explanation: An image is a read-only template; a container is a running instance of it.
---
```

A course appears once its `course.json` has `"status": "published"`. Callouts work with
`:::tip`, `:::note`, `:::caution` and `:::danger`.

See [ARCHITECTURE.md](ARCHITECTURE.md) for how it fits together and how it is deployed.
