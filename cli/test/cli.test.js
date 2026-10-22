import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { run, VERSION } from '../src/cli.js';
import { STAMP } from '../src/skills.js';
import { START, END } from '../src/writers.js';

function io(cwd, home) {
  const out = []; const err = [];
  return {
    cwd, env: { ROCKSTAR_ROUTER_HOME: home },
    stdout: { write: (s) => out.push(s) }, stderr: { write: (s) => err.push(s) },
    out: () => out.join(''), err: () => err.join(''),
  };
}
const tmp = (name) => fs.mkdtempSync(path.join(os.tmpdir(), `rr-${name}-`));
function repo() {
  const dir = tmp('repo');
  execFileSync('git', ['init', '-q'], { cwd: dir });
  return dir;
}

test('--version and help', async () => {
  const x = io(tmp('cwd'), tmp('home'));
  assert.equal(await run(['--version'], x), 0);
  assert.equal(x.out().trim(), VERSION);
  const y = io(tmp('cwd'), tmp('home'));
  assert.equal(await run([], y), 0);
  assert.match(y.out(), /skills.*init.*doctor.*update/s);
});

test('skills: dry run writes nothing, --yes installs stamped copies in both targets', async () => {
  const home = tmp('home');
  const dry = io(tmp('cwd'), home);
  assert.equal(await run(['skills'], dry), 0);
  assert.match(dry.out(), /re-run with --yes/);
  assert.equal(fs.existsSync(path.join(home, '.agents/skills/rockstar-router')), false);

  const x = io(tmp('cwd'), home);
  assert.equal(await run(['skills', '--yes'], x), 0);
  for (const t of ['.agents/skills', '.claude/skills']) {
    const dir = path.join(home, t, 'rockstar-router');
    assert.ok(fs.existsSync(path.join(dir, 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(dir, 'references/lanes.md')));
    assert.equal(fs.readFileSync(path.join(dir, STAMP), 'utf8').trim(), VERSION);
  }
  const again = io(tmp('cwd'), home);
  await run(['skills', '--yes'], again);
  assert.match(again.out(), /already up to date/);
});

test('skills: a copy installed by another channel is left untouched', async () => {
  const home = tmp('home');
  const foreign = path.join(home, '.agents/skills/rockstar-router');
  fs.mkdirSync(foreign, { recursive: true });
  fs.writeFileSync(path.join(foreign, 'SKILL.md'), 'from skills.sh');
  const x = io(tmp('cwd'), home);
  await run(['skills', '--yes'], x);
  assert.equal(fs.readFileSync(path.join(foreign, 'SKILL.md'), 'utf8'), 'from skills.sh');
  assert.match(x.err(), /managed elsewhere/);
  assert.ok(fs.existsSync(path.join(home, '.claude/skills/rockstar-router', STAMP)));
});

test('init: outside git fails, dry run writes nothing', async () => {
  assert.equal(await run(['init', '--yes'], io(tmp('nogit'), tmp('home'))), 1);
  const dir = repo();
  const x = io(dir, tmp('home'));
  assert.equal(await run(['init'], x), 0);
  assert.match(x.out(), /\+ create AGENTS\.md/);
  assert.equal(fs.existsSync(path.join(dir, 'AGENTS.md')), false);
});

test('init: creates AGENTS.md, keeps existing content, is idempotent, adds CLAUDE.md only when used', async () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# My project\n\nUse pnpm.\n');
  assert.equal(await run(['init', '--yes'], io(dir, tmp('home'))), 0);
  const text = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.ok(text.startsWith('# My project\n\nUse pnpm.\n'));
  assert.ok(text.includes(START) && text.includes(END));
  assert.ok(text.includes(`<!-- rockstar-router ${VERSION} -->`));
  assert.ok(text.includes('Routing rule for any request'));
  assert.equal(fs.existsSync(path.join(dir, 'CLAUDE.md')), false);
  assert.ok(fs.existsSync(path.join(dir, '.git/rockstar-router-backup/AGENTS.md')));

  const again = io(dir, tmp('home'));
  await run(['init', '--yes'], again);
  assert.match(again.out(), /already in place/);
  assert.equal((fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8').match(/rockstar-router:start/g) || []).length, 1);

  fs.mkdirSync(path.join(dir, '.claude'));
  await run(['init', '--yes'], io(dir, tmp('home')));
  assert.ok(fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8').includes(START));
});

test('init: keeps CRLF line endings', async () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# Title\r\n\r\nRule.\r\n');
  await run(['init', '--yes'], io(dir, tmp('home')));
  const text = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.ok(!/[^\r]\n/.test(text), 'every newline stays CRLF');
});

test('update: replaces an old block, never adds new files', async () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), `intro\n\n${START}\n<!-- rockstar-router 0.0.1 -->\nold rule\n${END}\noutro\n`);
  const x = io(dir, tmp('home'));
  assert.equal(await run(['update'], x), 0);
  const text = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.ok(!text.includes('old rule'));
  assert.ok(text.includes(`<!-- rockstar-router ${VERSION} -->`));
  assert.ok(text.startsWith('intro\n') && text.trimEnd().endsWith('outro'));
  assert.equal(fs.existsSync(path.join(dir, 'CLAUDE.md')), false);

  const empty = repo();
  const y = io(empty, tmp('home'));
  await run(['update'], y);
  assert.match(y.out(), /run rockstar-router init/);
  assert.equal(fs.existsSync(path.join(empty, 'AGENTS.md')), false);
});

test('update: refreshes stamped skill copies only', async () => {
  const home = tmp('home');
  await run(['skills', '--yes'], io(tmp('cwd'), home));
  const stamp = path.join(home, '.agents/skills/rockstar-router', STAMP);
  fs.writeFileSync(stamp, '0.0.1\n');
  const x = io(tmp('cwd'), home);
  await run(['update'], x);
  assert.equal(fs.readFileSync(stamp, 'utf8').trim(), VERSION);
  assert.match(x.out(), /refreshed 1 skill copy/);
});

test('doctor: reports missing pieces, then a clean install', async () => {
  const dir = repo(); const home = tmp('home');
  const before = io(dir, home);
  await run(['doctor'], before);
  assert.match(before.out(), /! no rockstar-router skill/);
  assert.match(before.out(), /! no AGENTS\.md routing rule/);

  await run(['skills', '--yes'], io(dir, home));
  await run(['init', '--yes'], io(dir, home));
  const after = io(dir, home);
  await run(['doctor'], after);
  assert.ok(!after.out().includes('! '), after.out());
  assert.match(after.out(), new RegExp(`routing rule ${VERSION.replace(/\./g, '\\.')} in AGENTS\\.md`));
});

test('unknown command fails', async () => {
  assert.equal(await run(['nope'], io(tmp('cwd'), tmp('home'))), 1);
});
