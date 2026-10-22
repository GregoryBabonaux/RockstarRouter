<p align="center">
  <img src="assets/rock-hand.png" alt="Skeletthand, die die Metal-Pommesgabel zeigt" width="180">
  <br>
  <sub>Illustration: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · **Deutsch** · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

**Hält deinen Coding-Agent davon ab, eine Stadiontour zu buchen, nur um die Farbe eines Buttons zu ändern.**

RockstarRouter ist eine Skill für Coding-Agents (Claude Code, Codex, Cursor und andere). Sie entscheidet, wie viel Prozess eine Anfrage verdient, bevor irgendeine andere Skill läuft.

## Das Problem

Skill-Packs wie superpowers oder BMAD fügen deinem Agent schwere Workflows hinzu: Brainstorming, Spec, Plan, Aufgabenliste, Review. Für echte Features sind sie nützlich. Manche Packs starten diesen Workflow aber bei jeder Anfrage, auch bei einem Tippfehler oder einer Farbänderung. Du wartest und verbrauchst Tokens für eine Änderung an einer einzigen Zeile.

Andere Packs haben das umgekehrte Problem: Sie starten ihren Workflow nie von selbst, selbst bei einer großen oder riskanten Änderung, außer du rufst ihn selbst auf.

## Was RockstarRouter macht

Es liest die Anfrage und wählt eine von vier Spuren:

| Spur | Wann | Was der Agent macht |
|---|---|---|
| 🎸 QUICK | klein, klar und leicht rückgängig zu machen | findet den Code, ändert ihn, prüft ihn. Keine Skill. |
| 🥁 STANDARD | ein echter Bug oder ein paar Dateien | nutzt höchstens eine gezielte Skill (debugging, TDD) |
| 🎤 DEEP | Datenbankschema, Migration, Auth, Zahlung, mehrere Module, neues Feature | führt den vollständigen Workflow deines Packs aus |
| 🎧 CLARIFY | das erwartete Ergebnis ist unklar | stellt höchstens zwei Fragen und wählt dann eine Spur |

Stellt sich eine QUICK-Änderung als größer heraus als erwartet (mehr Dateien, ein riskanter Bereich, ein Test, der an anderer Stelle fehlschlägt), hält der Agent an und wählt eine neue Spur.

Wenn er einen schweren Workflow überspringt, sagt er das in einer Zeile, mit etwas Attitüde:

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
```

Die Attitüde bleibt im Chat. Code, Commits und Pull Requests bleiben nüchtern. Für eine nüchterne Meldung auch im Chat setzt du `ROCKSTAR_ROUTER_TONE=sober`.

## Funktioniert mit jedem Skill-Pack

Es gibt keinen Pack-spezifischen Code. RockstarRouter liest die Beschreibungen der Skills, die du installiert hast:
- Skills, die brainstormen, Specs oder Pläne schreiben oder andere Skills verketten, werden nur in DEEP genutzt;
- Debugging- und TDD-Skills können in STANDARD genutzt werden;
- eine Skill, die es nicht einordnen kann, wird als DEEP behandelt, damit sie nie bei einer kleinen Anfrage läuft.

Manche Packs weisen den Agent an, bei jeder Anfrage eine Skill zu nutzen. RockstarRouter erkennt diese Art von Regel und setzt sie bei kleinen Anfragen außer Kraft.

Getestet mit diesen Packs:

| Pack | Startet seinen schweren Workflow von selbst? | Eigenes Profil in RockstarRouter |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | ja, oft | ja |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | manchmal | ja |
| [Spec Kit](https://github.com/github/spec-kit) | nein | nein, generische Regeln |
| [ECC](https://github.com/affaan-m/ECC) | nein | nein, generische Regeln |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | nein | nein, generische Regeln |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | nein | nein, generische Regeln |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | nein | nein, generische Regeln |
| [Agent OS](https://github.com/buildermethods/agent-os) | nein | nein, generische Regeln |

Sechs der acht Packs wurden allein durch die generischen Regeln abgedeckt.

## Benchmark

14 Anfragen auf einem kleinen Demo-Repo, mit jedem der 8 Packs, mit und ohne RockstarRouter. Claude Code 2.1.308, Sonnet, Headless-Modus. Rohdaten: `bench/results-2026-10-22.json`.

**Schwerer Workflow gestartet, obwohl ein einfacherer Weg gereicht hätte** (Farbe, Tippfehler, Log-Level, Datumsformat, kleiner Button, doppelte Suchergebnisse, CSV-Export, langsame Tests, zwei vage Anfragen):

| Pack | Ohne | Mit RockstarRouter |
|---|---|---|
| superpowers (2 Runs) | 3 und 5 Mal, einmal davon für eine Buttonfarbe | 0 |
| BMAD Method | 1: ein Build-Workflow für einen CSV-Export, der hängen blieb und nichts lieferte | 0 |
| die 6 anderen Packs | 0 | 0 |

**Schwerer Workflow gestartet, wenn er nötig war** (eine Datenbankspalte umbenennen, Mehrwährungsfähigkeit, Umstellung von Sessions auf JWT, explizites `/deep`):

| Pack | Ohne | Mit RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | jeweils 0/4: Mehrwährungsfähigkeit direkt in 5 bis 6 Dateien programmiert, ohne Spec | jeweils 4/4 |

"Nötig" zählt entweder den vollständigen Workflow des Packs oder einen Halt für eine Rückfrage vor einer großen Änderung. Die Spaltenumbenennung mit OpenSpec und cc-sdd erforderte in v0.6 eine Regelkorrektur ("eine Schemaänderung ist immer DEEP") und bestand danach 8/8, als sie zweimal auf 4 Packs erneut getestet wurde.

Kurz gesagt: Mit superpowers und BMAD verhindert RockstarRouter schwere Workflows bei kleinen Anfragen. Mit den anderen sechs Packs bringt es den Agent dazu, den Workflow des Packs zu nutzen, wenn eine Anfrage ihn wirklich braucht.

**Kosten**: Bei kleinen Anfragen +3k bis +57k Tokens pro Anfrage je nach Pack, zusätzlich zu einer Basis von 110k bis 280k. Wenn RockstarRouter eine große Anfrage an den vollständigen Workflow schickt, kann dieser Workflow viel kosten (cc-sdd brauchte 1.2M Tokens, um die Mehrwährungsfähigkeit zu spezifizieren). Genau dafür ist DEEP da.

**Grenzen dieses Benchmarks**: ein Modell, ein kleines Repo, ein oder zwei Runs pro Konfiguration. Im Headless-Modus hält eine Brainstorming-Skill bei ihrer ersten Frage an, daher wirken Runs ohne RockstarRouter günstiger, als es eine echte interaktive Session wäre. Ohne installiertes Pack erschien die Überspring-Meldung trotzdem einmal in sechs Runs.

So führst du ihn selbst aus (benötigt git, node, npx, uvx und Claude Code):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## Installation

**Schritt 1: die Skill installieren (wähle eine Variante)**

| Agent | Befehl | Was du bekommst |
|---|---|---|
| **Claude Code** (empfohlen) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, dann `/plugin install rockstar-router@rockstar-router` | Skill und Hooks: Routing-Regel wird beim Session-Start geladen, `/deep` und `/quick` |
| **Jeder Agent** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | Skill, im Projekt oder global mit `-g` |
| **Ohne skills.sh** | `npx rockstar-router-cli skills --yes` | Skill wird nach `~/.agents/skills` und `~/.claude/skills` kopiert |

**Schritt 2: die Routing-Regel zu deinem Projekt hinzufügen**

Agents ohne Hooks brauchen die Regel in ihrer Anweisungsdatei. Ohne sie nutzt der Agent RockstarRouter nur, wenn er selbst entscheidet, die Skill zu laden, und ein Pack, das seinen eigenen Workflow erzwingt, läuft oft zuerst.

- `npx rockstar-router-cli init` zeigt, was geschrieben wird. Nichts wird geschrieben, bevor du bestätigst.
- `npx rockstar-router-cli init --yes` schreibt die Regel in `AGENTS.md` (und in `CLAUDE.md` oder `GEMINI.md`, falls dein Projekt sie nutzt), zwischen Markierungen, ohne den Rest der Datei anzufassen.

Mit dem Claude-Code-Plugin ist dieser Schritt optional: Die Hooks laden die Regel bereits.

**Schritt 3: prüfen**

- `npx rockstar-router-cli doctor`

**Updates**

| Installiert mit | Update |
|---|---|
| Claude-Code-Plugin | `claude plugin update rockstar-router@rockstar-router`, oder aktiviere Auto-Update in `/plugin` |
| skills.sh | `npx skills update` (`npx skills update -g` für global) |
| npm | `npx rockstar-router-cli@latest update` |

## Verwendung

Nichts zu tun: Frag deinen Agent wie gewohnt. Um eine Spur zu erzwingen, beginne deine Nachricht mit:
- `/deep` oder `deep:`, um den vollständigen Workflow auszuführen, egal wie groß die Änderung ist;
- `/quick` oder `quick:`, um jeden Workflow zu überspringen.

Ohne das Claude-Code-Plugin funktionieren `deep:` und `quick:` nur, wenn der Agent sie bemerkt.

| Variable | Werte | Standard |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## Bekannte Grenzen

- Das Routing ist eine Entscheidung, die das Modell anhand eines Prompts trifft, keine feste Regel. Es wird manchmal danebenliegen.
- Manche Packs erzwingen ihren Workflow über Mechanismen, die eine Skill nicht sehen kann. RockstarRouter nennt die Skills, die es überspringt, damit du einen Konflikt erkennen kannst.
- Der Benchmark lief nur auf Claude Code mit Sonnet. Auf Codex CLI haben wir geprüft, dass die Skill und die `AGENTS.md`-Regel in den Modellkontext geladen werden (`codex debug prompt-input`), aber das Routing-Verhalten selbst ist dort noch nicht gemessen. Ergebnisse mit anderen Agents und Modellen sind willkommen.

## Lizenz

MIT
