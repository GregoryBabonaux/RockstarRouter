import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { snippetSource } from './paths.js';
import { upsertBlock, toLf, matchEol } from './writers.js';

const readOrNull = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);

export function gitRoot(cwd) {
  try { return execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; }
}

// Instruction files the routing rule goes into. AGENTS.md is read by Codex, Cursor, Copilot,
// OpenCode and most agents; CLAUDE.md and GEMINI.md only when the project already uses them.
export const TARGETS = [
  { file: 'AGENTS.md', always: true },
  { file: 'CLAUDE.md', detect: ['CLAUDE.md', '.claude'] },
  { file: 'GEMINI.md', detect: ['GEMINI.md', '.gemini'] },
];

export function ruleBody(version) {
  const src = snippetSource();
  if (!src) throw new Error('no bundled AGENTS.snippet.md found');
  return `<!-- rockstar-router ${version} -->\n${toLf(fs.readFileSync(src, 'utf8')).trim()}`;
}

export function selectTargets(root, only) {
  return TARGETS.filter((t) => (only ? only.includes(t.file) : t.always || t.detect.some((p) => fs.existsSync(path.join(root, p)))));
}

// `only`: restrict to these files (used by update, which never adds new files).
export function planInit(root, { version, only = null }) {
  const body = ruleBody(version);
  const changes = [];
  for (const t of selectTargets(root, only)) {
    const before = readOrNull(path.join(root, t.file));
    const after = upsertBlock(before === null ? '' : toLf(before), body);
    if (before !== null && toLf(before) === after) continue;
    changes.push({ path: t.file, before, after: matchEol(before, after) });
  }
  return changes;
}

// Backups live under .git/ so they are never committed by accident.
export function applyChanges(root, changes) {
  const backupDir = path.join(root, '.git', 'rockstar-router-backup');
  for (const c of changes) {
    if (c.before !== null) {
      const backup = path.join(backupDir, c.path);
      if (!fs.existsSync(backup)) {
        fs.mkdirSync(path.dirname(backup), { recursive: true });
        fs.writeFileSync(backup, c.before);
      }
    }
    fs.writeFileSync(path.join(root, c.path), c.after);
  }
}

export function runInit(io, opts, version) {
  const root = gitRoot(io.cwd);
  if (!root) { io.stderr.write('rockstar-router: init must run inside a git repository\n'); return 1; }
  const changes = planInit(root, { version });
  if (!changes.length) { io.stdout.write('rockstar-router: routing rule already in place\n'); return 0; }
  for (const c of changes) io.stdout.write(`${c.before === null ? '+ create' : '~ update'} ${c.path} (routing rule between rockstar-router markers)\n`);
  if (!opts.yes || opts.dryRun) { io.stdout.write('rockstar-router: nothing written yet, re-run with --yes to apply\n'); return 0; }
  applyChanges(root, changes);
  io.stdout.write(`rockstar-router: routing rule installed in ${changes.map((c) => c.path).join(', ')}. The stage manager is in. 🎸\n`);
  if (fs.existsSync(path.join(root, '.claude')) || fs.existsSync(path.join(root, 'CLAUDE.md'))) {
    io.stdout.write('rockstar-router: on Claude Code, the plugin adds the session-start and /deep hooks: /plugin marketplace add GregoryBabonaux/RockstarRouter\n');
  }
  return 0;
}
