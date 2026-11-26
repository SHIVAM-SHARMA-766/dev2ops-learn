// dev2ops learn — an interactive course platform.
//
// One site, many courses. A course is a folder under courses/ with a
// course.json and YAML lessons; see src/lib/courses.js for the content model.
// Pages are static; the lesson "step player" is a React island.
//
// The build output is a plain static dist/, so the deploy pipeline
// (.github + deploy/) is unchanged: rsync dist/ to the host, Caddy serves it.
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

const site = JSON.parse(readFileSync(new URL('./site.config.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: site.url,
  integrations: [react(), sitemap()],
  build: { format: 'directory' },
});
