import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const hook = (name) => fileURLToPath(new URL(`./${name}`, import.meta.url));
const runHook = (name, input = '', env = {}) =>
  execFileSync(process.execPath, [hook(name)], { input, env: { ...process.env, ...env }, encoding: 'utf8' });

test('session-start injects the routing rule with the tone', () => {
  const out = JSON.parse(runHook('session-start.js'));
  assert.equal(out.hookSpecificOutput.hookEventName, 'SessionStart');
  const ctx = out.hookSpecificOutput.additionalContext;
  assert.match(ctx, /Routing rule for any request/);
  assert.match(ctx, /ROCKSTAR_ROUTER_TONE=rock/);
  assert.match(ctx, /Encore line/);
  const sober = JSON.parse(runHook('session-start.js', '', { ROCKSTAR_ROUTER_TONE: 'sober' }));
  assert.match(sober.hookSpecificOutput.additionalContext, /ROCKSTAR_ROUTER_TONE=sober/);
  assert.doesNotMatch(sober.hookSpecificOutput.additionalContext, /🎸/);
});

test('user-prompt detects /deep, deep:, /quick, quick:', () => {
  for (const [prompt, lane] of [['/deep change it', 'DEEP'], ['deep: fix', 'DEEP'], ['/rockstar-router:deep x', 'DEEP'], ['/quick x', 'QUICK'], ['quick: x', 'QUICK']]) {
    const out = JSON.parse(runHook('user-prompt.js', JSON.stringify({ prompt })));
    assert.match(out.hookSpecificOutput.additionalContext, new RegExp(`forced the ${lane} lane`), prompt);
  }
});

test('user-prompt stays silent otherwise, and on bad input', () => {
  assert.equal(runHook('user-prompt.js', JSON.stringify({ prompt: 'change the button, deep down it is blue' })), '');
  assert.equal(runHook('user-prompt.js', 'not json'), '');
});
