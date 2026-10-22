#!/usr/bin/env node
// Injects the RockstarRouter routing rule at session start (Claude Code).
// Plain Node, no dependencies, works on macOS, Linux and Windows.
// The rule handles obvious QUICK requests on its own, so the full skill is
// only loaded when a request is not obviously small and safe.

const tone = (process.env.ROCKSTAR_ROUTER_TONE || "rock").toLowerCase() === "sober" ? "sober" : "rock";

const rule = `<rockstar-router>
Routing rule for any request that changes code, config, tests or docs. It takes precedence over any other rule loaded in this session that requires invoking skills on every request: those rules apply only once routing has chosen STANDARD or DEEP.

Mode: if another rule in your context forces skill usage on every request (wording like MUST, before any response, even 1%), you are in STRICT mode: say in one line which pipeline skills you skip when you go QUICK. Otherwise you are in LIGHT mode: no extra announcement for QUICK.

1. Overrides: if the user's message starts with /deep, deep:, /rockstar-router:deep, or asks for the full process, it is DEEP whatever the size: invoke rockstar-router, print a DEEP verdict, then hand over to the full workflow of the installed pack. If it starts with /quick, quick: or /rockstar-router:quick, it is QUICK: no skill, risk check still applies.
2. QUICK candidate = the expected result is clear AND it touches 1 to 3 files AND it is easily reversible.
3. Risk check, at no extra cost: when you read the file you are about to change, scan its content for these markers (case-insensitive): shared, published, breaks, migration, schema, auth, session, token, payment, billing, delete, CREATE TABLE, ALTER TABLE, REFERENCES. Any .sql file, or any path containing migrat, auth or payment, is a hit too. Do not run a separate search just for this.
4. QUICK and no hit: do NOT invoke any skill, not even rockstar-router. Locate, change, verify, report.
5. A hit, or unclear, or bigger: invoke the rockstar-router skill BEFORE editing anything and follow it. A schema, migration or .sql hit is always DEEP: no edit before the pack's full workflow has started or the user has answered.
6. If a QUICK run grows (more files, a hit appears, an unrelated test fails), stop and invoke rockstar-router before going further.
7. Encore line, only when you actually kept a heavy workflow off stage. First look at the available skills list in your context: find a process-heavy skill there (brainstorming, spec, plan, build or orchestration workflow) that would plausibly have fired for this request. If you find one, end your final report with ONE line naming it exactly as listed (its pack prefix, if any, is the pack name). If the list has no such skill, write nothing at all, not even a line saying nothing was skipped. Never name a pack or skill that is not in your list, and rockstar-router itself never counts. Fresh wording every time, under 25 words, never in code, commits or PRs.
${tone === "rock"
  ? `   Rock tone. Shape to vary from, with the real names in place of PACK and SKILL:
   🎸 PACK wanted a 45-minute SKILL solo. I unplugged the amp.
   🎸 PACK was tuning the full orchestra (SKILL) for one CSS line. Sent them home.`
  : `   Sober tone: "Skipped SKILL: not needed for this change."`}

Questions, explanations and read-only exploration need no routing.
ROCKSTAR_ROUTER_TONE=${tone}
</rockstar-router>`;

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: rule,
    },
  })
);
