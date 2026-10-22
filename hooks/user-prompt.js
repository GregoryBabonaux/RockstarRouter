#!/usr/bin/env node
// Detects RockstarRouter overrides in the user's message (Claude Code, UserPromptSubmit).
// Deterministic: the agent does not have to notice "/deep" or "/quick" by itself.
// Plain Node, no dependencies.

let input = "";
process.stdin.on("data", c => (input += c));
process.stdin.on("end", () => {
  let prompt = "";
  try { prompt = (JSON.parse(input).prompt || "").trim(); } catch { /* no input: do nothing */ }

  const deep = /^(\/(rockstar-router:)?deep\b|deep:)/i.test(prompt);
  const quick = /^(\/(rockstar-router:)?quick\b|quick:)/i.test(prompt);
  if (!deep && !quick) return; // no output: normal routing applies

  const context = deep
    ? "<rockstar-router-override>The user forced the DEEP lane for this message. Invoke the rockstar-router skill now, print a DEEP verdict, then hand over to the full workflow of the installed pack (spec, plan, brainstorming or equivalent), even if the change looks small. Do not edit any file before that workflow has started.</rockstar-router-override>"
    : "<rockstar-router-override>The user forced the QUICK lane for this message. Do not invoke any skill or workflow: locate, change, verify, report.</rockstar-router-override>";

  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: context } }));
});
