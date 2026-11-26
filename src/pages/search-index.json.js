// Build-time search index: one entry per lesson, with step titles folded in as
// keywords. Served as a static /search-index.json the Search island fetches.
import { getCourses, getLesson } from '../lib/courses.js';

export function GET() {
  const entries = [];
  for (const course of getCourses()) {
    for (const ch of course.chapters) {
      for (const l of ch.lessons) {
        const full = getLesson(course.slug, ch.slug, l.slug);
        const keywords = (full?.steps || [])
          .flatMap((s) => [s.title, s.label])
          .filter(Boolean)
          .join(' · ');
        entries.push({
          title: l.title,
          summary: l.summary,
          course: course.title,
          courseIcon: course.icon,
          chapter: ch.title,
          accent: course.accent,
          path: l.path,
          difficulty: l.difficulty,
          minutes: l.minutes,
          keywords,
        });
      }
    }
  }
  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json' },
  });
}
