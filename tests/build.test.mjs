// The build produced every published course, its lessons and the sitemap.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const courses = readdirSync(new URL('../courses/', import.meta.url), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => ({ slug: d.name, ...JSON.parse(readFileSync(new URL(`../courses/${d.name}/course.json`, import.meta.url), 'utf8')) }))
  .filter((c) => c.status === 'published');

test('home page lists every published course', () => {
  const html = readFileSync(new URL('index.html', dist), 'utf8');
  for (const c of courses) assert.match(html, new RegExp(`href="/${c.slug}/"`), c.slug);
});

test('every lesson of every published course is built', () => {
  for (const c of courses) {
    assert.ok(existsSync(new URL(`${c.slug}/index.html`, dist)), `${c.slug} overview`);
    for (const ch of c.chapters) {
      const dir = new URL(`../courses/${c.slug}/${ch.slug}/`, import.meta.url);
      if (!existsSync(dir)) continue;
      for (const f of readdirSync(dir).filter((x) => /\.mdx?$/.test(x))) {
        const src = readFileSync(new URL(f, dir), 'utf8');
        if (/^draft:\s*true/m.test(src)) continue;
        assert.ok(existsSync(new URL(`${c.slug}/${ch.slug}/${f.replace(/\.mdx?$/, '')}/index.html`, dist)), `${c.slug}/${ch.slug}/${f}`);
      }
    }
  }
});

test('sitemap exists and uses the configured URL', () => {
  const { url } = JSON.parse(readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
  assert.match(readFileSync(new URL('sitemap-0.xml', dist), 'utf8'), new RegExp(url.replace(/\./g, '\\.')));
});
