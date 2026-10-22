import fs from 'node:fs';
import path from 'node:path';
import { refreshStampedSkills } from './skills.js';
import { gitRoot, planInit, applyChanges, TARGETS } from './init.js';
import { hasBlock } from './writers.js';

const CHANNELS = [
  'rockstar-router: copies installed by another channel are updated there:\n',
  '  claude plugin update rockstar-router@rockstar-router   (Claude Code plugin)\n',
  '  npx skills update                                      (skills.sh)\n',
];

export function runUpdate(io, opts, version) {
  // skill copies first: they live in the home directory and need no repository
  const refreshed = refreshStampedSkills(io.env ?? process.env, version);
  if (refreshed) io.stdout.write(`rockstar-router: refreshed ${refreshed} skill cop${refreshed === 1 ? 'y' : 'ies'}\n`);

  const root = gitRoot(io.cwd);
  // only refresh files that already carry the block: never install by surprise
  const only = root ? TARGETS.map((t) => t.file).filter((f) => {
    const p = path.join(root, f);
    return fs.existsSync(p) && hasBlock(fs.readFileSync(p, 'utf8'));
  }) : [];
  if (!only.length) {
    io.stdout.write('rockstar-router: no routing rule in this repository, run rockstar-router init to add one\n');
  } else {
    const changes = planInit(root, { version, only });
    applyChanges(root, changes);
    io.stdout.write(`rockstar-router: routing rule ${changes.length ? `updated in ${changes.map((c) => c.path).join(', ')}` : 'already up to date'}\n`);
  }
  for (const line of CHANNELS) io.stdout.write(line);
  return 0;
}
