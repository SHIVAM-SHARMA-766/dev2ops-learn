// Build checks: every published course and lesson is in dist/, the home page
// lists them, and the sitemap uses the configured URL.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { getCourses } from '../src/lib/courses.js';

const dist = new URL('../dist/', import.meta.url);
const courses = getCourses().filter((c) => c.status === 'published');

test('at least one published course exists', () => {
  assert.ok(courses.length > 0, 'no published courses found');
});

test('home page names every published course', () => {
  const html = readFileSync(new URL('index.html', dist), 'utf8');
  for (const c of courses) assert.ok(html.includes(c.title), `home missing: ${c.title}`);
});

test('every course overview and lesson page is built', () => {
  for (const c of courses) {
    assert.ok(existsSync(new URL(`${c.slug}/index.html`, dist)), `${c.slug} overview`);
    for (const ch of c.chapters) {
      for (const l of ch.lessons) {
        assert.ok(
          existsSync(new URL(`${c.slug}/${ch.slug}/${l.slug}/index.html`, dist)),
          `${c.slug}/${ch.slug}/${l.slug}`,
        );
      }
    }
  }
});

test('every lesson has at least one step', () => {
  for (const c of courses) {
    for (const ch of c.chapters) {
      for (const l of ch.lessons) {
        assert.ok(l.stepCount > 0, `${c.slug}/${ch.slug}/${l.slug} has no steps`);
      }
    }
  }
});

test('sitemap exists and uses the configured URL', () => {
  const { url } = JSON.parse(readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
  const sm = new URL('sitemap-0.xml', dist);
  assert.ok(existsSync(sm), 'sitemap-0.xml missing');
  assert.match(readFileSync(sm, 'utf8'), new RegExp(url.replace(/\./g, '\\.')));
});
