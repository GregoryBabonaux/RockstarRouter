<p align="center">
  <img src="assets/rock-hand.png" alt="Skeletthand, die die Metal-Pommesgabel zeigt" width="180">
  <br>
  <sub>Illustration: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · **Deutsch** · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

**Damit dein Agent keine Stadiontour bucht, nur um eine Buttonfarbe zu ändern.**

Du hast ein Skill-Pack installiert. Starke Songs, starke Band. Dann bittest du um einen Tippfehler-Fix, und der Drummer zählt eine 45-minütige Prog-Rock-Oper ein: Brainstorming, Spec, Plan, Tasks, Review. Deine Tokens haben die Halle verlassen, bevor der erste Akkord sitzt.

RockstarRouter ist der Stage Manager. Er hört den Request zuerst und legt die Setlist fest: ein Zwei-Minuten-Punksong oder die volle Stadionshow.

## 🎚️ Die Setlist

| Lane | Wann | Was passiert |
|---|---|---|
| 🎸 QUICK | klein, klar, umkehrbar | finden, ändern, prüfen. Kein Skill, kein Zeremoniell. |
| 🥁 STANDARD | ein echter Bug oder ein paar Dateien | höchstens ein gezielter Skill (debugging, TDD) |
| 🎤 DEEP | Schema, Migration, Auth, Payment, modulübergreifend, neue Funktion | der komplette Workflow deines Packs, Pyrotechnik inklusive |
| 🎧 CLARIFY | keiner weiß, wie "fertig" aussieht | maximal zwei Fragen, dann zurück auf die Bühne |

Die schwere Artillerie wird nie beschlagnahmt. Sobald ein Request sie verdient, reicht RockstarRouter das Mikro an den Workflow deines Packs weiter. Und wenn ein QUICK-Run anfängt zu wachsen (mehr Dateien, eine riskante Zone, ein Test, der woanders rot wird), bricht er den Song ab und routet neu.

Wenn er tatsächlich einen Overkill abwürgt, sagt er dir Bescheid:

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
🎸 ecc:orch-add-feature was ready to run a full research-plan-TDD-review set for one button. I sent it home.
```

Die Attitüde bleibt im Chat. Code, Commits und PRs bleiben nüchtern. Lieber ein stiller Roadie? `ROCKSTAR_ROUTER_TONE=sober`.

## 🤘 Spielt mit jeder Band

Kein Pack-spezifischer Code. RockstarRouter liest die Skills, die du installiert hast, und ordnet sie anhand ihrer Beschreibungen ein: Alles, was brainstormt, Specs schreibt, plant oder andere Skills verkettet, spielt nur DEEP; debugging und TDD spielen STANDARD; alles, was er nicht lesen kann, gilt als DEEP und bekommt nie einen QUICK-Slot.

Packs, die ihren Workflow jedem Request aufzwingen ("you MUST invoke a skill if there is even a 1% chance"), werden erkannt und bei QUICK-Requests überstimmt.

Live auf der Bühne getestet mit:

| Pack | Startet von sich aus schwere Workflows? | Profil in RockstarRouter |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | ja, oft | ja |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | manchmal | ja |
| [Spec Kit](https://github.com/github/spec-kit) | nein | nein, generische Regeln |
| [ECC](https://github.com/affaan-m/ECC) | nein | nein, generische Regeln |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | nein | nein, generische Regeln |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | nein | nein, generische Regeln |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | nein | nein, generische Regeln |
| [Agent OS](https://github.com/buildermethods/agent-os) | nein | nein, generische Regeln |

Sechs der acht Packs liefen nur mit generischen Regeln, und genau das ist der eigentliche Test.

## 📊 Die Zahlen

14 Requests auf einem kleinen Demo-Repo, 8 Packs, jeder Run mit und ohne RockstarRouter. Claude Code 2.1.308, Sonnet, headless. Rohdaten in `bench/results-2026-10-22.json`.

**Schwerer Workflow gestartet, obwohl ein leichterer Weg gereicht hätte** (Farbe, Tippfehler, Log-Level, Datumsformat, kleiner Button, doppelte Suchergebnisse, CSV-Export, langsame Tests, zwei vage Requests):

| Pack | Ohne | Mit RockstarRouter |
|---|---|---|
| superpowers (2 Runs) | 3 und 5 Mal, einmal für eine Buttonfarbe | 0 |
| BMAD Method | 1, ein Build-Workflow für einen CSV-Export, hängen geblieben, nichts ausgeliefert | 0 |
| die 6 anderen Packs | 0 | 0 |

**Schwerer Workflow, wenn er angebracht ist** (eine DB-Spalte umbenennen, Multi-Currency, Sessions zu JWT, explizites `/deep`):

| Pack | Ohne | Mit RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | je 0/4: Multi-Currency direkt in 5 bis 6 Dateien reingehackt, keine Spec | je 4/4 |

"Angebracht" zählt den kompletten Workflow des Packs oder einen Stopp mit Rückfrage vor einer großen Änderung. Die Spaltenumbenennung bei OpenSpec und cc-sdd brauchte einen Regel-Fix in v0.6 ("schema is always DEEP"), zweimal auf 4 Packs nachgetestet: 8/8.

Die zweite Tabelle ist die Überraschung der Tour. Die meisten Packs greifen nie zu ihren eigenen schweren Instrumenten, wenn der Song danach verlangt. RockstarRouter erledigt das für sie.

**Was es kostet**: Bei trivialen Requests +3k bis +57k Tokens pro Request, je nach Pack, zusätzlich zu einer Baseline von 110k bis 280k. Wenn RockstarRouter einen großen Request an den kompletten Workflow schickt, kann dieser Workflow richtig teuer werden (cc-sdd hat 1.2M Tokens für die Spec von Multi-Currency verbraten). Das ist eben die Stadionshow, die du bestellt hast.

**Das Kleingedruckte**: ein Modell, ein kleines Repo, ein oder zwei Runs pro Config. Im headless-Modus bleibt ein Brainstorming-Skill bei seiner ersten Frage stehen, deshalb wirken die "Ohne"-Runs billiger als eine echte interaktive Session. Ganz ohne installiertes Pack ist die Zugabe-Zeile trotzdem einmal in sechs Runs rausgerutscht.

Spiel es selbst nach (braucht git, node, npx, uvx und Claude Code):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## 🎫 Backstage-Pass

**Schritt 1: hol dir den Skill (such dir einen Weg aus)**

| Agent | Befehl | Was du bekommst |
|---|---|---|
| **Claude Code** (empfohlen) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, dann `/plugin install rockstar-router@rockstar-router` | Skill und Hooks: Routing-Regel beim Session-Start auf der Bühne, `/deep` und `/quick` |
| **Jeder Agent** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | Skill, im Projekt oder global mit `-g` |
| **Kein skills.sh** | `npx rockstar-router-cli skills --yes` | Skill, kopiert nach `~/.agents/skills` und `~/.claude/skills` |

**Schritt 2: bring die Routing-Regel in dein Projekt**

Agents ohne Hooks brauchen die Regel in ihrer Instruktionsdatei, sonst spielt der Router nur, wenn der Agent gerade Lust hat, ihn zu laden, und ein Pack, das seinen eigenen Workflow erzwingt, schnappt sich meistens zuerst das Mikro.

- `npx rockstar-router-cli init` zeigt dir, was es schreiben wird. Nichts wird geschrieben, bevor du bestätigst.
- `npx rockstar-router-cli init --yes` schreibt die Regel in `AGENTS.md` (und in `CLAUDE.md` oder `GEMINI.md`, falls dein Projekt sie nutzt), zwischen Markern, ohne den Rest der Datei anzufassen.

Mit dem Claude-Code-Plugin ist dieser Schritt optional: Die Hooks bringen die Regel schon auf die Bühne.

**Schritt 3: Soundcheck**

- `npx rockstar-router-cli doctor`

**Updates**

| Installiert mit | Update |
|---|---|
| Claude-Code-Plugin | `claude plugin update rockstar-router@rockstar-router`, oder Auto-Update in `/plugin` einschalten |
| skills.sh | `npx skills update` (`npx skills update -g` für global) |
| npm | `npx rockstar-router-cli@latest update` |

## 🎛️ Regler

Frag einfach. Zum Übersteuern:
- `/deep` oder `deep:` am Anfang deiner Nachricht: kompletter Workflow, egal wie groß;
- `/quick` oder `quick:`: kein Workflow, direkt ins Riff.

Ohne das Claude-Code-Plugin hängen `deep:` und `quick:` davon ab, dass der Agent sie bemerkt.

| Variable | Werte | Standard |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 🩹 Bekannte Grenzen

- Das Routing ist eine Modellentscheidung, gesteuert durch einen Prompt, keine harte Schranke. Es wird manchmal danebenliegen.
- Manche Packs erzwingen ihren Workflow über Mechanismen, die ein Skill nicht sehen kann. Der Router nennt, was er überspringt, damit du Konflikte erkennst.
- Benchmark bisher nur auf Claude Code mit Sonnet. Bei Codex CLI haben wir geprüft, dass die Skill und die Regel aus `AGENTS.md` im Modellkontext landen (`codex debug prompt-input`), das Routing-Verhalten selbst ist dort aber noch nicht gemessen. Ergebnisse mit anderen Agents und Modellen sind willkommen.

## Lizenz

MIT. Dreh auf.
