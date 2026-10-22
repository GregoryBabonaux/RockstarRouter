# Packs that force their workflow

Some skill packs load a rule at session start telling the agent to invoke skills on every request, sometimes on the slightest chance one applies, and to reject "this is overkill" as an excuse.

RockstarRouter does not fight those packs. It narrows WHEN their rule applies:

- Their rule answers "which skill, once process is warranted".
- RockstarRouter answers "is process warranted at all".

## How to recognize one (generic, works on unknown packs)

- A rule present in your context from session start that says to check or invoke skills before ANY response or action.
- Imperative wording: MUST, always, before any, not negotiable, even 1%.
- A list of "rationalizations" or "excuses" you are told to reject.

## What to do in QUICK

1. Announce in the verdict which skills you skip, by name.
2. Do not invoke them. Do not load them "just to check".
3. If the user disagrees, they say `/deep` and you hand over.

## What to do in STANDARD

Invoke at most one focused skill from that pack (debugging, TDD). Skip brainstorming, design, spec and plan skills.

## What to do in DEEP

Hand over fully. Follow the pack's workflow as written. RockstarRouter steps aside.

## Known packs

These profiles correct the generic heuristic. PRs welcome.

| Pack | Process-heavy (DEEP only) | Focused (STANDARD) | Notes |
|---|---|---|---|
| superpowers | brainstorming, writing-plans, executing-plans, subagent-driven-development | systematic-debugging, test-driven-development, verification-before-completion | Injects `using-superpowers` at session start via hook |
| BMAD Method | PRD, architecture, epics and stories workflows | quick-dev, quick-spec | Already has its own Quick Flow with scope detection: prefer it over the full method in STANDARD |
