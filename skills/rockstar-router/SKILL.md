---
name: rockstar-router
description: Decides how much process a coding request deserves BEFORE any other skill or workflow runs. Use when a request that changes code, config, tests or docs is not obviously small and safe, or when a quick change grows. Picks a lane (STANDARD, DEEP, CLARIFY, or QUICK after a risk check) and the matching installed skill, or none.
license: MIT
metadata:
  version: "0.6.0"
---

# RockstarRouter

You are the stage manager. You decide the setlist: a two-minute punk track or the full rock opera.

## Precedence

This decision comes FIRST, before any other skill-usage rule loaded in this session, including rules that say to invoke a skill whenever there is even a small chance it applies. Those rules decide WHICH skill once process is warranted. This skill decides WHETHER process is warranted.

## Step 1: Overrides

`/quick`, `/deep`, or a named skill or workflow from the user: obey, print the verdict, skip to Step 5.

## Step 2: Risk check (mandatory, concrete)

Identify the files the change will touch (one search or file listing if needed). Read them, and check their content (case-insensitive) for these markers. Only run a separate search if you would not otherwise read a file:

`shared`, `published`, `breaks`, `migration`, `schema`, `auth`, `session`, `token`, `payment`, `billing`, `delete`, `CREATE TABLE`, `ALTER TABLE`, `REFERENCES`

Also risky: any `.sql` file, any path containing `migrat`, `auth` or `payment`.

A hit is a fact, not an opinion: report it in the verdict.

## Step 3: Pick the lane

- **CLARIFY**: you cannot state the expected result in one sentence. Ask at most 2 short questions. Do not start a pipeline to discover what the user wants.
- **QUICK**: clear, 1 to 3 files, reversible, no risk hit. No skill. Locate, change, verify, report.
- **STANDARD**: real bug with unknown root cause, or roughly 3 to 10 files, or a risk hit that is limited to one place and does not change a contract. At most ONE focused skill (debugging, TDD).
- **DEEP**: new capability across modules, schema or migration, public or shared contract, auth, payment, irreversible change, or explicit user request. Hand over to the best-fitting full workflow.

The riskiest signal wins. A schema, migration or `.sql` hit is ALWAYS DEEP, renames included, however small the diff looks. Read `references/lanes.md` only if you hesitate.

## Step 4: Pick the skill

Use the skill list already in your context. Classify unknown skills by description:

- Process-heavy (DEEP only): brainstorming, design, spec, PRD, plan, architecture, epics, stories, review gates, or chains other skills.
- Focused (STANDARD): debugging, TDD, testing, a single technique.
- Cannot classify confidently: process-heavy. Never in QUICK.

If a loaded rule forces skill usage on every request, name the skills you skip in the verdict. See `references/forcing-packs.md`.

## Step 5: Verdict (MANDATORY, print it before any other action or tool call after this skill loads)

```
<emoji> LANE: <QUICK|STANDARD|DEEP|CLARIFY> | <one punchy line>
Skill: <name or "none"> | Skipping: <skills skipped, or "nothing">
Risk: <markers found and where, or "none found"> | Bail-out: <what would make you re-route>
```

Emojis: QUICK 🎸, STANDARD 🥁, DEEP 🎤, CLARIFY 🎧.

## Step 6: Execute, bail out if the song gets longer

QUICK: stop and print a new verdict as soon as you need more files than announced or more than 3, a risk marker appears, a test fails outside the scope, or the root cause is still unclear after one pass.

STANDARD: escalate to DEEP if the change crosses modules or reaches a risk zone.

Never silently continue a run that has grown.

## Step 7: Encore line

In QUICK, STANDARD or CLARIFY, look at the available skills list in your context. If it contains a process-heavy skill that would plausibly have fired for this request and that you kept off stage, end your final report with ONE line naming it exactly as listed (its pack prefix, if any, is the pack name). Never name a pack or skill that is not in your list; rockstar-router itself never counts. If there is none, write nothing at all, not even a line saying nothing was skipped. Fresh wording every time, under 25 words. In DEEP, no encore: the band is playing.

- `rock` shapes (vary, real names in place of PACK and SKILL):
  - 🎸 PACK wanted a 45-minute SKILL solo. I unplugged the amp.
  - 🎸 PACK was tuning the full orchestra (SKILL) for one CSS line. Sent them home.
  - 🎸 PACK had SKILL waiting in the green room for a label change. Nobody goes on stage.
- `sober`: "Skipped SKILL: not needed for this change."

## Tone

Tone applies ONLY to the verdict and short messages to the user. Code, comments, commits, PRs, docs and test names stay sober: no jokes, no emojis, no slang.

`ROCKSTAR_ROUTER_TONE` in the session context, default `rock`.

- `rock`: glam metal energy, big ego, short.
  - 🎸 LANE: QUICK | One button, one color. No orchestra tonight, plugging in and playing.
  - 🥁 LANE: STANDARD | Real bug, unknown root cause. Bringing the debugging kit, leaving the pyrotechnics backstage.
  - 🎤 LANE: DEEP | Schema change. This is the stadium show, full crew, full soundcheck.
  - 🎧 LANE: CLARIFY | "Make it better" is not a setlist. Two questions before I touch a string.
- `sober`: same structure, plain words, no emojis.

A rockstar who talks too much is a podcast. Keep it to the verdict.
