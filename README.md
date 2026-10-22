<p align="center">
  <img src="assets/rock-hand.png" alt="Skeleton hand throwing the metal horns" width="180">
  <br>
  <sub>Illustration: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

**English** · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

**Stops your coding agent from booking a stadium tour to change a button color.**

RockstarRouter is a skill for coding agents (Claude Code, Codex, Cursor and others). It decides how much process a request deserves before any other skill runs.

## The problem

Skill packs such as superpowers or BMAD add heavy workflows to your agent: brainstorming, spec, plan, task list, review. They are useful for real features. But some packs start that workflow on any request, including a typo fix or a color change. You wait, and you spend tokens, for a one-line change.

Other packs have the opposite problem: they never start their workflow on their own, even for a large or risky change, unless you call it yourself.

## What RockstarRouter does

It reads the request and picks one of four lanes:

| Lane | When | What the agent does |
|---|---|---|
| 🎸 QUICK | small, clear and easy to undo | finds the code, changes it, checks it. No skill. |
| 🥁 STANDARD | a real bug, or a few files | uses at most one focused skill (debugging, TDD) |
| 🎤 DEEP | database schema, migration, auth, payment, several modules, new feature | runs your pack's full workflow |
| 🎧 CLARIFY | the expected result is unclear | asks at most two questions, then picks a lane |

If a QUICK change turns out bigger than expected (more files, a risky area, a test failing elsewhere), the agent stops and picks a new lane.

When it skips a heavy workflow, it says so in one line, with a bit of attitude:

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
```

The attitude stays in the chat. Code, commits and pull requests stay plain. For a plain message in the chat too, set `ROCKSTAR_ROUTER_TONE=sober`.

## Works with any skill pack

There is no pack-specific code. RockstarRouter reads the descriptions of the skills you have installed:
- skills that brainstorm, write specs or plans, or chain other skills are used only in DEEP;
- debugging and TDD skills can be used in STANDARD;
- a skill it cannot classify is treated as DEEP, so it never runs on a small request.

Some packs tell the agent to use a skill on every request. RockstarRouter detects that kind of rule and overrides it for small requests.

Tested with these packs:

| Pack | Starts its heavy workflow on its own? | Specific profile in RockstarRouter |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | yes, often | yes |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | sometimes | yes |
| [Spec Kit](https://github.com/github/spec-kit) | no | no, generic rules |
| [ECC](https://github.com/affaan-m/ECC) | no | no, generic rules |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | no | no, generic rules |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | no | no, generic rules |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | no | no, generic rules |
| [Agent OS](https://github.com/buildermethods/agent-os) | no | no, generic rules |

Six of the eight packs were handled by the generic rules alone.

## Benchmark

14 requests on a small demo repo, with each of the 8 packs, with and without RockstarRouter. Claude Code 2.1.308, Sonnet, headless mode. Raw data: `bench/results-2026-10-22.json`.

**Heavy workflow started when a simpler path was enough** (color, typo, log level, date format, small button, duplicate search results, CSV export, slow tests, two vague requests):

| Pack | Without | With RockstarRouter |
|---|---|---|
| superpowers (2 runs) | 3 and 5 times, once for a button color | 0 |
| BMAD Method | 1: a build workflow on a CSV export, which got stuck and delivered nothing | 0 |
| the 6 other packs | 0 | 0 |

**Heavy workflow started when it was needed** (rename a database column, multi-currency, sessions to JWT, explicit `/deep`):

| Pack | Without | With RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 0/4 each: multi-currency coded directly in 5 to 6 files, without a spec | 4/4 each |

"Needed" counts either the pack's full workflow or a stop to ask before a large change. The column rename on OpenSpec and cc-sdd required a rule fix in v0.6 ("a schema change is always DEEP"), then passed 8/8 when re-tested twice on 4 packs.

In short: with superpowers and BMAD, RockstarRouter prevents heavy workflows on small requests. With the other six packs, it makes the agent use the pack's workflow when a request actually needs it.

**Cost**: on small requests, from +3k to +57k tokens per request depending on the pack, on top of a 110k to 280k baseline. When RockstarRouter sends a large request to the full workflow, that workflow can cost a lot (cc-sdd used 1.2M tokens to specify multi-currency). That cost is the point of DEEP.

**Limits of this benchmark**: one model, one small repo, one or two runs per configuration. In headless mode a brainstorming skill stops at its first question, so runs without RockstarRouter look cheaper than a real interactive session would. With no pack installed, the skip message still appeared once in six runs.

To run it yourself (needs git, node, npx, uvx and Claude Code):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## Install

**Step 1: install the skill (pick one)**

| Agent | Command | What you get |
|---|---|---|
| **Claude Code** (recommended) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, then `/plugin install rockstar-router@rockstar-router` | Skill and hooks: routing rule loaded at session start, `/deep` and `/quick` |
| **Any agent** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | Skill, in the project or globally with `-g` |
| **No skills.sh** | `npx rockstar-router-cli skills --yes` | Skill copied to `~/.agents/skills` and `~/.claude/skills` |

**Step 2: add the routing rule to your project**

Agents without hooks need the rule in their instruction file. Without it, the agent only uses RockstarRouter when it decides to load the skill, and a pack that forces its own workflow often runs first.

- `npx rockstar-router-cli init` shows what it will write. Nothing is written until you confirm.
- `npx rockstar-router-cli init --yes` writes the rule into `AGENTS.md` (and `CLAUDE.md` or `GEMINI.md` if your project uses them), between markers, without touching the rest of the file.

With the Claude Code plugin, this step is optional: the hooks already load the rule.

**Step 3: check**

- `npx rockstar-router-cli doctor`

**Updates**

| Installed with | Update |
|---|---|
| Claude Code plugin | `claude plugin update rockstar-router@rockstar-router`, or turn on auto-update in `/plugin` |
| skills.sh | `npx skills update` (`npx skills update -g` for global) |
| npm | `npx rockstar-router-cli@latest update` |

## Usage

Nothing to do: ask your agent as usual. To force a lane, start your message with:
- `/deep` or `deep:` to run the full workflow, whatever the size of the change;
- `/quick` or `quick:` to skip any workflow.

Without the Claude Code plugin, `deep:` and `quick:` work only if the agent notices them.

| Variable | Values | Default |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## Known limits

- Routing is a decision made by the model from a prompt, not a hard rule. It will sometimes get it wrong.
- Some packs force their workflow through mechanisms a skill cannot see. RockstarRouter names the skills it skips, so you can spot a conflict.
- Benchmarked on Claude Code with Sonnet only. On Codex CLI, we checked that the skill and the `AGENTS.md` rule are loaded into the model context (`codex debug prompt-input`), but the routing behavior itself is not measured there yet. Results on other agents and models are welcome.

## License

MIT
