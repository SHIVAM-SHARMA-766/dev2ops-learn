// Browser test against the built site: pass a quiz, see the lesson completed,
// the progress survive a reload and show on the course overview.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import assert from 'node:assert/strict';

const dist = new URL('../dist/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.json': 'application/json' };
const srv = createServer(async (req, res) => {
  let p = join(dist, decodeURIComponent(req.url.split('?')[0]));
  try { if ((await stat(p)).isDirectory()) p = join(p, 'index.html'); res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' }); res.end(await readFile(p)); }
  catch { res.writeHead(404); res.end('not found'); }
}).listen(4610);
const U = 'http://localhost:4610';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
const step = async (name, fn) => { try { await fn(); results.push(['✓', name]); } catch (e) { results.push(['✗', name, e.message.split('\n')[0]]); } };
const errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());

  await step('home lists courses with a start button', async () => {
    await page.goto(`${U}/`);
    assert.ok(await page.locator('.course-card').count() > 0);
  });

  let lesson = '';
  await step('a quiz passes and completes the lesson', async () => {
    await page.goto(`${U}/docker/`);
    const first = await page.locator('[data-cp-next]').getAttribute('href');
    lesson = first.replace(/^\/|\/$/g, '');
    await page.goto(`${U}${first}`);
    const qs = page.locator('form[data-quiz] .quiz-q');
    const n = await qs.count();
    assert.ok(n > 0, 'the first lesson has a quiz');
    for (let i = 0; i < n; i++) {
      const answer = await qs.nth(i).getAttribute('data-answer');
      await qs.nth(i).locator(`input[value="${answer}"]`).check();
    }
    await page.click('form[data-quiz] button[type=submit]');
    await page.waitForSelector('[data-complete]:disabled');
    assert.match(await page.locator('.quiz-result').innerText(), /correct/);
  });

  await step('progress survives a reload and shows in the sidebar and overview', async () => {
    await page.reload();
    await page.waitForSelector('[data-complete]:disabled');
    assert.equal(await page.locator(`#starlight__sidebar a.lesson-done[href="/${lesson}/"]`).count(), 1);
    await page.goto(`${U}/docker/`);
    assert.match(await page.locator('.cp-text').innerText(), /^1 of \d+ lessons completed/);
    assert.match(await page.locator('[data-cp-next]').innerText(), /Continue/);
  });

  await step('accent colour is remembered', async () => {
    await page.click('[data-learn-palette="amber"]');
    await page.reload();
    assert.equal(await page.evaluate(() => document.documentElement.dataset.palette), 'amber');
  });

  await step('no JavaScript errors', async () => assert.deepEqual(errors, []));
} finally {
  await browser.close();
  srv.close();
}
for (const r of results) console.log(r.join('  '));
const failed = results.filter((r) => r[0] === '✗').length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
