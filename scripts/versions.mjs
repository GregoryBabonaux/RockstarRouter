// One version everywhere: cli/package.json, plugin.json, marketplace.json, SKILL.md metadata.
// node scripts/versions.mjs --check     fails if they differ
// node scripts/versions.mjs <x.y.z>     bumps them all
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (rel) => path.join(root, rel);

const json = (rel) => ({
  get: () => JSON.parse(fs.readFileSync(p(rel), 'utf8')),
  set: (fn) => { const j = JSON.parse(fs.readFileSync(p(rel), 'utf8')); fn(j); fs.writeFileSync(p(rel), `${JSON.stringify(j, null, 2)}\n`); },
});
const skill = 'skills/rockstar-router/SKILL.md';
const SKILL_RE = /(\n\s+version:\s*")(\d+\.\d+\.\d+)(")/;

const sources = {
  'cli/package.json': { read: () => json('cli/package.json').get().version, write: (v) => json('cli/package.json').set((j) => { j.version = v; }) },
  '.claude-plugin/plugin.json': { read: () => json('.claude-plugin/plugin.json').get().version, write: (v) => json('.claude-plugin/plugin.json').set((j) => { j.version = v; }) },
  '.claude-plugin/marketplace.json': {
    read: () => json('.claude-plugin/marketplace.json').get().plugins[0].version,
    write: (v) => json('.claude-plugin/marketplace.json').set((j) => { j.plugins[0].version = v; }),
  },
  [skill]: {
    read: () => fs.readFileSync(p(skill), 'utf8').match(SKILL_RE)?.[2],
    write: (v) => fs.writeFileSync(p(skill), fs.readFileSync(p(skill), 'utf8').replace(SKILL_RE, `$1${v}$3`)),
  },
};

const arg = process.argv[2];
if (arg && arg !== '--check') {
  if (!/^\d+\.\d+\.\d+$/.test(arg)) { console.error(`not a version: ${arg}`); process.exit(1); }
  for (const s of Object.values(sources)) s.write(arg);
  console.log(`version set to ${arg} everywhere`);
} else {
  const found = Object.entries(sources).map(([file, s]) => [file, s.read()]);
  const distinct = new Set(found.map(([, v]) => v));
  for (const [file, v] of found) console.log(`${v ?? 'MISSING'}  ${file}`);
  if (distinct.size !== 1 || distinct.has(undefined)) { console.error('versions differ'); process.exit(1); }
  console.log('one version everywhere');
}
