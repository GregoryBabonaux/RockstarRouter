<p align="center">
  <img src="assets/rock-hand.png" alt="Skeleton hand throwing the metal horns" width="180">
  <br>
  <sub>Illustration: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

**English** · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

**Stops your agent from booking a stadium tour to change a button color.**

You installed a skill pack. Great songs, great band. Then you ask for a typo fix and the drummer counts in a 45-minute prog rock opera: brainstorming, spec, plan, tasks, review. Your tokens leave the building before the first chord.

RockstarRouter is the stage manager. It hears the request first and decides the setlist: a two-minute punk track, or the full stadium show.

## 🎚️ The setlist

| Lane | When | What happens |
|---|---|---|
| 🎸 QUICK | small, clear, reversible | locate, change, verify. No skill, no ceremony. |
| 🥁 STANDARD | a real bug, or a few files | one focused skill at most (debugging, TDD) |
| 🎤 DEEP | schema, migration, auth, payment, cross-module, new capability | your pack's full workflow, pyrotechnics included |
| 🎧 CLARIFY | nobody knows what "done" looks like | two questions max, then back on stage |

The heavy artillery is never confiscated. The moment a request deserves it, RockstarRouter hands the mic to your pack's own workflow. And if a QUICK run starts growing (more files, a risky zone, a test failing somewhere else), it stops the song and re-routes.

When it does kill an overkill, it tells you:

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
🎸 ecc:orch-add-feature was ready to run a full research-plan-TDD-review set for one button. I sent it home.
```

The attitude stays in the chat. Code, commits and PRs stay sober. Prefer a quiet roadie? `ROCKSTAR_ROUTER_TONE=sober`.

## 🤘 Plays with any band

No pack-specific code. RockstarRouter reads the skills you have installed and classifies them from their descriptions: anything that brainstorms, specs, plans or chains other skills only plays DEEP; debugging and TDD play STANDARD; anything it can't read is treated as DEEP and never gets a QUICK slot.

Packs that force their workflow on every request ("you MUST invoke a skill if there is even a 1% chance") get spotted and overruled for QUICK requests.

Tested on stage with:

| Pack | Fires heavy workflows on its own? | Profile in RockstarRouter |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | yes, often | yes |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | sometimes | yes |
| [Spec Kit](https://github.com/github/spec-kit) | no | no, generic rules |
| [ECC](https://github.com/affaan-m/ECC) | no | no, generic rules |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | no | no, generic rules |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | no | no, generic rules |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | no | no, generic rules |
| [Agent OS](https://github.com/buildermethods/agent-os) | no | no, generic rules |

Six of the eight packs ran on generic rules only, which is the real test.

## 📊 The numbers

14 requests on a small demo repo, 8 packs, each run with and without RockstarRouter. Claude Code 2.1.308, Sonnet, headless. Raw data in `bench/results-2026-10-22.json`.

**Heavy workflow fired when a lighter path was enough** (color, typo, log level, date format, small button, duplicate search results, CSV export, slow tests, two vague requests):

| Pack | Without | With RockstarRouter |
|---|---|---|
| superpowers (2 runs) | 3 and 5 times, once for a button color | 0 |
| BMAD Method | 1, a build workflow on a CSV export, stuck, nothing shipped | 0 |
| the 6 other packs | 0 | 0 |

**Heavy workflow when it is warranted** (rename a DB column, multi-currency, sessions to JWT, explicit `/deep`):

| Pack | Without | With RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 0/4 each: multi-currency coded straight into 5 to 6 files, no spec | 4/4 each |

"Warranted" counts the pack's full workflow, or a stop to ask before a large change. The column rename on OpenSpec and cc-sdd needed a rule fix in v0.6 ("schema is always DEEP"), re-tested twice on 4 packs: 8/8.

The second table is the surprise of the tour. Most packs never pick up their own heavy instruments when the song calls for them. RockstarRouter does it for them.

**What it costs**: on trivial requests, from +3k to +57k tokens per request depending on the pack, on top of a 110k to 280k baseline. When RockstarRouter sends a big request to the full workflow, that workflow can cost a lot (cc-sdd spent 1.2M tokens specifying multi-currency). That is the stadium show you asked for.

**Fine print**: one model, one small repo, one or two runs per config. In headless mode a brainstorming skill stops at its first question, so the "without" runs look cheaper than a real interactive session. With no pack installed, the encore line still slipped out once in six runs.

Play it again yourself (needs git, node, npx, uvx and Claude Code):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## 🎫 Backstage pass

**Step 1: get the skill (pick one)**

| Agent | Command | What you get |
|---|---|---|
| **Claude Code** (recommended) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, then `/plugin install rockstar-router@rockstar-router` | Skill and hooks: routing rule on stage at session start, `/deep` and `/quick` |
| **Any agent** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | Skill, in the project or globally with `-g` |
| **No skills.sh** | `npx rockstar-router-cli skills --yes` | Skill copied to `~/.agents/skills` and `~/.claude/skills` |

**Step 2: put the routing rule in your project**

Agents without hooks need the rule in their instruction file, otherwise the router only plays when the agent feels like loading it, and a pack that forces its own workflow usually grabs the mic first.

- `npx rockstar-router-cli init` shows what it will write. Nothing is written until you confirm.
- `npx rockstar-router-cli init --yes` writes the rule into `AGENTS.md` (and `CLAUDE.md` or `GEMINI.md` if your project uses them), between markers, without touching the rest of the file.

With the Claude Code plugin, this step is optional: the hooks already bring the rule on stage.

**Step 3: soundcheck**

- `npx rockstar-router-cli doctor`

**Updates**

| Installed with | Update |
|---|---|
| Claude Code plugin | `claude plugin update rockstar-router@rockstar-router`, or turn on auto-update in `/plugin` |
| skills.sh | `npx skills update` (`npx skills update -g` for global) |
| npm | `npx rockstar-router-cli@latest update` |

## 🎛️ Controls

Just ask. To override:
- `/deep` or `deep:` at the start of your message: full workflow, whatever the size;
- `/quick` or `quick:`: no workflow, straight to the riff.

Without the Claude Code plugin, `deep:` and `quick:` rely on the agent noticing them.

| Variable | Values | Default |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 🩹 Known limits

- Routing is a model decision guided by a prompt, not a hard gate. It will sometimes misjudge.
- Some packs force their workflow through mechanisms a skill can't see. The router names what it skips so you can spot conflicts.
- Benchmarked on Claude Code with Sonnet only. On Codex CLI, we checked that the skill and the `AGENTS.md` rule load into the model context (`codex debug prompt-input`), but the routing behavior itself is not benchmarked there yet. Results on other agents and models welcome.

## License

MIT. Turn it up.
