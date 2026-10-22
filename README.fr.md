<p align="center">
  <img src="assets/rock-hand.png" alt="Main de squelette qui fait les cornes du métal" width="180">
  <br>
  <sub>Illustration: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · **Français** · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

**Empêche ton agent de réserver le Stade de France pour changer la couleur d'un bouton.**

Tu as installé un pack de skills. Super morceaux, super groupe. Puis tu demandes de corriger une faute de frappe et le batteur lance un opéra prog rock de 45 minutes : brainstorming, spec, plan, tâches, review. Tes tokens ont quitté la salle avant le premier accord.

RockstarRouter, c'est le régisseur. Il écoute la demande en premier et choisit la setlist : un morceau punk de deux minutes, ou le grand show au stade.

## 🎚️ La setlist

| Voie | Quand | Ce qui se passe |
|---|---|---|
| 🎸 QUICK | petit, clair, réversible | localiser, modifier, vérifier. Pas de skill, pas de cérémonie. |
| 🥁 STANDARD | un vrai bug, ou quelques fichiers | une skill ciblée au maximum (debugging, TDD) |
| 🎤 DEEP | schéma, migration, auth, paiement, transverse à plusieurs modules, nouvelle fonctionnalité | le workflow complet de ton pack, pyrotechnie comprise |
| 🎧 CLARIFY | personne ne sait à quoi ressemble "terminé" | deux questions max, puis retour sur scène |

L'artillerie lourde n'est jamais confisquée. Dès qu'une demande la mérite, RockstarRouter passe le micro au workflow de ton pack. Et si un run QUICK commence à enfler (plus de fichiers, une zone à risque, un test qui casse ailleurs), il coupe le morceau et réoriente.

Quand il dégage un excès de zèle, il te le dit :

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
🎸 ecc:orch-add-feature was ready to run a full research-plan-TDD-review set for one button. I sent it home.
```

L'attitude reste dans le chat. Le code, les commits et les PR restent sobres. Tu préfères un roadie discret ? `ROCKSTAR_ROUTER_TONE=sober`.

## 🤘 Joue avec n'importe quel groupe

Aucun code spécifique à un pack. RockstarRouter lit les skills que tu as installées et les classe d'après leurs descriptions : tout ce qui fait du brainstorming, des specs, des plans ou enchaîne d'autres skills ne joue qu'en DEEP ; debugging et TDD jouent en STANDARD ; tout ce qu'il n'arrive pas à lire est traité en DEEP et n'obtient jamais de créneau QUICK.

Les packs qui imposent leur workflow à chaque demande ("you MUST invoke a skill if there is even a 1% chance") sont repérés et désavoués sur les demandes QUICK.

Testé en live avec :

| Pack | Lance des workflows lourds de lui-même ? | Profil dans RockstarRouter |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | oui, souvent | oui |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | parfois | oui |
| [Spec Kit](https://github.com/github/spec-kit) | non | non, règles génériques |
| [ECC](https://github.com/affaan-m/ECC) | non | non, règles génériques |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | non | non, règles génériques |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | non | non, règles génériques |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | non | non, règles génériques |
| [Agent OS](https://github.com/buildermethods/agent-os) | non | non, règles génériques |

Six des huit packs ont tourné uniquement sur les règles génériques, et c'est ça le vrai test.

## 📊 Les chiffres

14 demandes sur un petit repo de démo, 8 packs, chaque run avec et sans RockstarRouter. Claude Code 2.1.308, Sonnet, headless. Données brutes dans `bench/results-2026-10-22.json`.

**Workflow lourd lancé alors qu'un chemin plus léger suffisait** (couleur, faute de frappe, niveau de log, format de date, petit bouton, résultats de recherche en double, export CSV, tests lents, deux demandes floues) :

| Pack | Sans | Avec RockstarRouter |
|---|---|---|
| superpowers (2 runs) | 3 et 5 fois, dont une pour la couleur d'un bouton | 0 |
| BMAD Method | 1, un workflow de build sur un export CSV, bloqué, rien livré | 0 |
| les 6 autres packs | 0 | 0 |

**Workflow lourd quand il est justifié** (renommer une colonne en base, multi-devises, passage des sessions à JWT, `/deep` explicite) :

| Pack | Sans | Avec RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 0/4 chacun : multi-devises codé direct dans 5 à 6 fichiers, sans spec | 4/4 chacun |

"Justifié" compte le workflow complet du pack, ou un arrêt pour demander confirmation avant un gros changement. Le renommage de colonne sur OpenSpec et cc-sdd a nécessité une correction de règle en v0.6 ("schema is always DEEP"), retestée deux fois sur 4 packs : 8/8.

Le second tableau est la surprise de la tournée : la plupart des packs ne sortent jamais leurs gros instruments quand le morceau l'exige. RockstarRouter le fait à leur place.

**Ce que ça coûte** : sur les demandes triviales, de +3k à +57k tokens par demande selon le pack, en plus d'une base de 110k à 280k. Quand RockstarRouter envoie une grosse demande vers le workflow complet, ce workflow peut coûter cher (cc-sdd a dépensé 1.2M tokens pour spécifier le multi-devises). C'est le show au stade que tu as commandé.

**Petites lignes** : un seul modèle, un petit repo, un ou deux runs par config. En mode headless, une skill de brainstorming s'arrête à sa première question, donc les runs "sans" paraissent moins chers qu'une vraie session interactive. Sans aucun pack installé, la ligne de rappel s'est quand même échappée une fois sur six runs.

Rejoue-le toi-même (il te faut git, node, npx, uvx et Claude Code) :

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## 🎫 Pass backstage

**Étape 1 : récupère la skill (choisis une option)**

| Agent | Commande | Ce que tu obtiens |
|---|---|---|
| **Claude Code** (recommandé) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, puis `/plugin install rockstar-router@rockstar-router` | Skill et hooks : règle de routage sur scène dès le démarrage de la session, `/deep` et `/quick` |
| **N'importe quel agent** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | Skill, dans le projet ou en global avec `-g` |
| **Sans skills.sh** | `npx rockstar-router-cli skills --yes` | Skill copiée dans `~/.agents/skills` et `~/.claude/skills` |

**Étape 2 : mets la règle de routage dans ton projet**

Les agents sans hooks ont besoin de la règle dans leur fichier d'instructions, sinon le router ne joue que si l'agent a envie de le charger, et un pack qui impose son propre workflow pique généralement le micro en premier.

- `npx rockstar-router-cli init` montre ce qu'il va écrire. Rien n'est écrit tant que tu n'as pas confirmé.
- `npx rockstar-router-cli init --yes` écrit la règle dans `AGENTS.md` (et `CLAUDE.md` ou `GEMINI.md` si ton projet les utilise), entre des marqueurs, sans toucher au reste du fichier.

Avec le plugin Claude Code, cette étape est optionnelle : les hooks mettent déjà la règle sur scène.

**Étape 3 : la balance**

- `npx rockstar-router-cli doctor`

**Mises à jour**

| Installé avec | Mise à jour |
|---|---|
| Plugin Claude Code | `claude plugin update rockstar-router@rockstar-router`, ou active la mise à jour automatique dans `/plugin` |
| skills.sh | `npx skills update` (`npx skills update -g` pour le global) |
| npm | `npx rockstar-router-cli@latest update` |

## 🎛️ Réglages

Demande, tout simplement. Pour forcer :
- `/deep` ou `deep:` en début de message : workflow complet, quelle que soit la taille ;
- `/quick` ou `quick:` : pas de workflow, direct au riff.

Sans le plugin Claude Code, `deep:` et `quick:` dépendent de l'agent qui doit les remarquer.

| Variable | Valeurs | Défaut |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 🩹 Limites connues

- Le routage est une décision du modèle guidée par un prompt, pas un verrou strict. Il se trompera parfois.
- Certains packs imposent leur workflow via des mécanismes qu'une skill ne voit pas. Le router nomme ce qu'il zappe pour que tu repères les conflits.
- Benchmark réalisé uniquement sur Claude Code avec Sonnet. Sur Codex CLI, on a vérifié que la skill et la règle de l'`AGENTS.md` sont bien chargées dans le contexte du modèle (`codex debug prompt-input`), mais le comportement de routage n'y est pas encore mesuré. Les retours sur d'autres agents et modèles sont bienvenus.

## Licence

MIT. Monte le son.
