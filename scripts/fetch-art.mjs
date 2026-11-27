// Vendor open-licensed brand logos + icons into public/art/.
// Run with network access:  node scripts/fetch-art.mjs
//
// Sources: Devicon (MIT) for tech logos, Tabler Icons (MIT) for UI objects.
// Files are saved locally and served via <img>, so no CDN at runtime.
// See public/art/LICENSES.md.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'art');
mkdirSync(join(ROOT, 'logos'), { recursive: true });
mkdirSync(join(ROOT, 'icons'), { recursive: true });

const DEV = (t, v) => `https://raw.githubusercontent.com/devicons/devicon/master/icons/${t}/${t}-${v}.svg`;

// [outfile, tech, preferred variant]
const logos = [
  ['docker', 'docker', 'original'], ['nodejs', 'nodejs', 'original'],
  ['postgresql', 'postgresql', 'original'], ['redis', 'redis', 'original'],
  ['nginx', 'nginx', 'original'], ['linux', 'linux', 'original'],
  ['git', 'git', 'original'], ['python', 'python', 'original'],
  ['go', 'go', 'original'], ['kubernetes', 'kubernetes', 'plain'],
  ['mysql', 'mysql', 'original'], ['mongodb', 'mongodb', 'original'],
  ['grafana', 'grafana', 'original'], ['prometheus', 'prometheus', 'original'],
  ['ubuntu', 'ubuntu', 'plain'], ['debian', 'debian', 'original'],
];

const icons = [
  'server', 'device-laptop', 'database', 'cloud', 'box', 'package', 'terminal-2',
  'network', 'lock', 'settings', 'arrow-right', 'world', 'cpu', 'stack-2',
  'shield-lock', 'refresh', 'rocket', 'bug', 'plug-connected', 'versions',
];

async function get(urls) {
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        const t = await r.text();
        if (t.includes('<svg') && t.length < 300000) return t;
      }
    } catch { /* try next */ }
  }
  return null;
}

let ok = 0;
const fail = [];
for (const [name, tech, v] of logos) {
  const svg = await get([DEV(tech, v), DEV(tech, 'original'), DEV(tech, 'plain')]);
  if (svg) { writeFileSync(join(ROOT, 'logos', `${name}.svg`), svg); ok++; } else fail.push(`logo:${name}`);
}
for (const n of icons) {
  const svg = await get([
    `https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/${n}.svg`,
    `https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/${n}.svg`,
  ]);
  if (svg) { writeFileSync(join(ROOT, 'icons', `${n}.svg`), svg); ok++; } else fail.push(`icon:${n}`);
}
console.log(`Saved ${ok} assets to public/art/`);
if (fail.length) console.log('Could not fetch:', fail.join(', '));
