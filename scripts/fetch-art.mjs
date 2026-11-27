// Vendor open-licensed brand logos + icons into public/art/ by copying from npm
// packages (reliable — uses the npm registry, no raw GitHub / CDN).
//
//   npm install -D devicon @tabler/icons   # once
//   node scripts/fetch-art.mjs             # copy the curated set into public/art/
//
// Sources: Devicon (MIT) for tech logos, Tabler Icons (MIT) for UI objects.
// Files are served via <img>, so no CDN at runtime. See public/art/LICENSES.md.
import { copyFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const ART = join(APP, 'public', 'art');
mkdirSync(join(ART, 'logos'), { recursive: true });
mkdirSync(join(ART, 'icons'), { recursive: true });

// [outfile, devicon tech folder, file stem]
const logos = [
  ['docker', 'docker', 'docker-original'], ['nodejs', 'nodejs', 'nodejs-original'],
  ['postgresql', 'postgresql', 'postgresql-original'], ['redis', 'redis', 'redis-original'],
  ['nginx', 'nginx', 'nginx-original'], ['linux', 'linux', 'linux-original'],
  ['git', 'git', 'git-original'], ['python', 'python', 'python-original'],
  ['go', 'go', 'go-original'], ['kubernetes', 'kubernetes', 'kubernetes-plain'],
  ['mysql', 'mysql', 'mysql-original'], ['mongodb', 'mongodb', 'mongodb-original'],
  ['grafana', 'grafana', 'grafana-original'], ['prometheus', 'prometheus', 'prometheus-original'],
  ['ubuntu', 'ubuntu', 'ubuntu-plain'], ['debian', 'debian', 'debian-original'],
];
const icons = [
  'server', 'device-laptop', 'database', 'cloud', 'box', 'package', 'terminal-2',
  'network', 'lock', 'settings', 'arrow-right', 'world', 'cpu', 'stack-2',
  'shield-lock', 'refresh', 'rocket', 'bug', 'plug-connected', 'versions',
];

const valid = (p) => existsSync(p) && readFileSync(p, 'utf8').includes('<svg');
let ok = 0;
const fail = [];

for (const [name, folder, stem] of logos) {
  const src = join(APP, 'node_modules', 'devicon', 'icons', folder, `${stem}.svg`);
  if (valid(src)) { copyFileSync(src, join(ART, 'logos', `${name}.svg`)); ok++; } else fail.push(`logo:${name}`);
}
for (const n of icons) {
  let src = join(APP, 'node_modules', '@tabler', 'icons', 'icons', `${n}.svg`);
  if (!existsSync(src)) src = join(APP, 'node_modules', '@tabler', 'icons', 'icons', 'outline', `${n}.svg`);
  if (valid(src)) { copyFileSync(src, join(ART, 'icons', `${n}.svg`)); ok++; } else fail.push(`icon:${n}`);
}

console.log(`Vendored ${ok} assets into public/art/`);
if (fail.length) console.log('Missing (install devicon / @tabler/icons first):', fail.join(', '));
