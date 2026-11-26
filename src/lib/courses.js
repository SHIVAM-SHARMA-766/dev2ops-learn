// Content model for dev2ops learn.
//
//   courses/
//     <course>/
//       course.json              title, tagline, accent, icon, level, order, status, chapters[]
//       <chapter>/
//         <lesson>.yml           title, minutes, difficulty, summary, scene, steps[], quiz[]
//
// Adding a course or lesson is a content change only — no code edits. Courses
// whose course.json status is not "published" are dropped from production
// builds but kept while developing.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

// Resolve from the project root (cwd), not import.meta.url: this module is
// bundled during the Astro build, which moves import.meta.url to dist/.
const COURSES_DIR = join(process.cwd(), 'courses');
const IS_PROD = process.env.NODE_ENV === 'production';

function dirs(p) {
  if (!existsSync(p)) return [];
  return readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

// ---- courses -------------------------------------------------------------

/** All courses, published first filtered in prod, sorted by `order`. */
export function getCourses() {
  const courses = dirs(COURSES_DIR)
    .filter((slug) => existsSync(join(COURSES_DIR, slug, 'course.json')))
    .map((slug) => loadCourse(slug))
    .filter((c) => (IS_PROD ? c.status === 'published' : true))
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.title.localeCompare(b.title));
  return courses;
}

export function getCourse(slug) {
  if (!existsSync(join(COURSES_DIR, slug, 'course.json'))) return null;
  return loadCourse(slug);
}

function loadCourse(slug) {
  const meta = readJson(join(COURSES_DIR, slug, 'course.json'));
  const chapters = (meta.chapters ?? []).map((ch) => ({
    slug: ch.slug,
    title: ch.title,
    lessons: loadChapterLessons(slug, ch.slug),
  }));
  const lessonCount = chapters.reduce((n, ch) => n + ch.lessons.length, 0);
  return {
    slug,
    title: meta.title ?? slug,
    tagline: meta.tagline ?? '',
    description: meta.description ?? '',
    accent: meta.accent ?? 'green',
    icon: meta.icon ?? '',
    level: meta.level ?? '',
    order: meta.order ?? 100,
    status: meta.status ?? 'draft',
    chapters,
    lessonCount,
  };
}

// ---- lessons -------------------------------------------------------------

/** Lesson metadata (no steps) for one chapter, sorted by file name / `order`. */
function loadChapterLessons(course, chapter) {
  const dir = join(COURSES_DIR, course, chapter);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.ya?ml$/.test(f))
    .map((f) => {
      const data = parseYaml(readFileSync(join(dir, f), 'utf8')) ?? {};
      const lessonSlug = f.replace(/\.ya?ml$/, '');
      return {
        slug: lessonSlug,
        course,
        chapter,
        path: `/${course}/${chapter}/${lessonSlug}`,
        title: data.title ?? lessonSlug,
        summary: data.summary ?? '',
        minutes: data.minutes ?? null,
        difficulty: data.difficulty ?? '',
        order: data.order ?? 999,
        draft: data.draft === true,
        stepCount: Array.isArray(data.steps) ? data.steps.length : 0,
      };
    })
    .filter((l) => !l.draft || !IS_PROD)
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

/** The full lesson, including steps, scene and quiz. */
export function getLesson(course, chapter, slug) {
  for (const ext of ['yml', 'yaml']) {
    const file = join(COURSES_DIR, course, chapter, `${slug}.${ext}`);
    if (existsSync(file)) {
      const data = parseYaml(readFileSync(file, 'utf8')) ?? {};
      return {
        course,
        chapter,
        slug,
        title: data.title ?? slug,
        summary: data.summary ?? '',
        minutes: data.minutes ?? null,
        difficulty: data.difficulty ?? '',
        scene: data.scene ?? null,
        steps: Array.isArray(data.steps) ? data.steps : [],
        quiz: Array.isArray(data.quiz) ? data.quiz : [],
      };
    }
  }
  return null;
}

/** Flat, ordered list of every lesson in a course — for prev/next and progress. */
export function courseLessonOrder(course) {
  return course.chapters.flatMap((ch) =>
    ch.lessons.map((l) => ({ ...l, chapterTitle: ch.title })),
  );
}

/** Every lesson path across all courses — for getStaticPaths. */
export function allLessonParams() {
  const out = [];
  for (const course of getCourses()) {
    for (const ch of course.chapters) {
      for (const l of ch.lessons) {
        out.push({ course: course.slug, chapter: ch.slug, lesson: l.slug });
      }
    }
  }
  return out;
}
