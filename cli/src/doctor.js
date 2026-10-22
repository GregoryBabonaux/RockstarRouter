import fs from 'node:fs';
import path from 'node:path';
import { defaultTargets, STAMP } from './skills.js';
import { gitRoot, TARGETS } from './init.js';
import { hasBlock, blockVersion } from './writers.js';

export function diagnose({ root, env, version }) {
  const out = [];
  const ok = (message) => out.push({ level: 'ok', message });
  const warn = (message) => out.push({ level: 'warn', message });
  ok(`rockstar-router-cli ${version}`);

  let skillFound = false;
  for (const target of defaultTargets(env)) {
    const dir = path.join(target, 'rockstar-router');
    if (!fs.existsSync(path.join(dir, 'SKILL.md'))) continue;
    skillFound = true;
    const stampFile = path.join(dir, STAMP);
    if (!fs.existsSync(stampFile)) ok(`skill in ${target} (managed by another channel: plugin or skills.sh)`);
    else {
      const v = fs.readFileSync(stampFile, 'utf8').trim();
      if (v === version) ok(`skill ${v} in ${target}`);
      else warn(`skill ${v} in ${target}, CLI is ${version}: run rockstar-router update`);
    }
  }
  if (!skillFound) warn('no rockstar-router skill in ~/.agents/skills or ~/.claude/skills: fine if installed in the project or by the Claude Code plugin, otherwise run rockstar-router skills --yes');

  if (!root) { warn('not inside a git repository: project checks skipped'); return out; }
  for (const projectSkills of ['.agents/skills', '.claude/skills', '.cursor/skills', '.github/skills']) {
    if (fs.existsSync(path.join(root, projectSkills, 'rockstar-router', 'SKILL.md'))) ok(`skill in the project (${projectSkills})`);
  }
  let ruleFound = false;
  for (const t of TARGETS) {
    const file = path.join(root, t.file);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (!hasBlock(text)) {
      if (t.always) warn(`${t.file} has no routing rule: run rockstar-router init`);
      continue;
    }
    ruleFound = true;
    const v = blockVersion(text);
    if (v === version) ok(`routing rule ${v} in ${t.file}`);
    else warn(`routing rule ${v ?? '(no version)'} in ${t.file}, CLI is ${version}: run rockstar-router update`);
  }
  if (!ruleFound && !fs.existsSync(path.join(root, 'AGENTS.md'))) warn('no AGENTS.md routing rule: run rockstar-router init (not needed with the Claude Code plugin)');
  return out;
}

export function runDoctor(io, opts, version) {
  const results = diagnose({ root: gitRoot(io.cwd), env: io.env ?? process.env, version });
  for (const r of results) {
    if (r.level === 'ok' && opts.quiet) continue;
    io.stdout.write(`${r.level === 'ok' ? '✓' : '!'} ${r.message}\n`);
  }
  return 0;
}
