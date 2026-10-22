import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { skillsSource } from './paths.js';

export const STAMP = '.rockstar-router-version';

export function listSkills(dir) {
  return fs.readdirSync(dir).filter((d) => fs.existsSync(path.join(dir, d, 'SKILL.md'))).sort();
}

// ~/.agents/skills is read by Codex, Copilot CLI, Gemini CLI, Cursor and OpenCode; ~/.claude/skills by Claude Code.
export function defaultTargets(env) {
  const home = env.ROCKSTAR_ROUTER_HOME || os.homedir();
  return [path.join(home, '.agents', 'skills'), path.join(home, '.claude', 'skills')];
}

// install: not there yet; update: installed by this CLI, older version; skip: managed by another channel.
export function planSkills({ source, targets, version }) {
  const actions = [];
  for (const target of targets) {
    for (const skill of listSkills(source)) {
      const dest = path.join(target, skill);
      const stampFile = path.join(dest, STAMP);
      if (!fs.existsSync(dest)) actions.push({ skill, target, dest, action: 'install' });
      else if (!fs.existsSync(stampFile)) actions.push({ skill, target, dest, action: 'skip' });
      else if (fs.readFileSync(stampFile, 'utf8').trim() !== version) actions.push({ skill, target, dest, action: 'update' });
    }
  }
  return actions;
}

export function applySkills(actions, source, version) {
  for (const a of actions) {
    if (a.action === 'skip') continue;
    fs.rmSync(a.dest, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(a.dest), { recursive: true });
    fs.cpSync(path.join(source, a.skill), a.dest, { recursive: true });
    fs.writeFileSync(path.join(a.dest, STAMP), `${version}\n`);
  }
}

export function runSkills(io, opts, version) {
  const source = skillsSource();
  if (!source) { io.stderr.write('rockstar-router: no bundled skills found\n'); return 1; }
  const targets = opts.target ? [opts.target] : defaultTargets(io.env ?? process.env);
  const actions = planSkills({ source, targets, version });
  for (const a of actions.filter((x) => x.action === 'skip')) {
    io.stderr.write(`rockstar-router: ${a.skill} in ${a.target} is managed elsewhere (no ${STAMP}), left untouched\n`);
  }
  const work = actions.filter((a) => a.action !== 'skip');
  if (!work.length) { io.stdout.write('rockstar-router: skills already up to date\n'); return 0; }
  for (const a of work) io.stdout.write(`${a.action === 'install' ? '+ install' : '~ update'} ${a.skill} → ${a.target}\n`);
  if (!opts.yes || opts.dryRun) { io.stdout.write('rockstar-router: re-run with --yes to apply\n'); return 0; }
  applySkills(work, source, version);
  io.stdout.write(`rockstar-router: installed ${work.length} skill cop${work.length === 1 ? 'y' : 'ies'}. 🎸\n`);
  return 0;
}

// Used by `update`: refresh only copies this CLI installed (stamped), never install new ones.
export function refreshStampedSkills(env, version) {
  const source = skillsSource();
  if (!env || !source) return 0;
  const updates = planSkills({ source, targets: defaultTargets(env), version }).filter((a) => a.action === 'update');
  applySkills(updates, source, version);
  return updates.length;
}
