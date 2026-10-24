<p align="center">
  <img src="assets/rock-hand.png" alt="Main de squelette faisant les cornes du metal" width="180">
  <br>
  <sub>Illustration: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · **Français** · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

🌐 [Site web](https://gregorybabonaux.github.io/RockstarRouter/)

**Empêche ton agent de code de réserver une tournée des stades pour changer la couleur d'un bouton.**

RockstarRouter est une skill pour les agents de code (Claude Code, Codex, Cursor et d'autres). Elle décide du niveau de process que mérite une demande, avant que toute autre skill ne s'exécute.

## Le problème

Les packs de skills comme superpowers ou BMAD ajoutent des workflows lourds à ton agent : brainstorming, spec, plan, liste de tâches, review. Ils sont utiles pour de vraies fonctionnalités. Mais certains packs lancent ce workflow sur n'importe quelle demande, y compris la correction d'une faute de frappe ou un changement de couleur. Tu attends, et tu consommes des tokens, pour une modification d'une ligne.

D'autres packs ont le problème inverse : ils ne lancent jamais leur workflow d'eux-mêmes, même pour un changement important ou risqué, sauf si tu l'appelles toi-même.

## Ce que fait RockstarRouter

Il lit la demande et choisit l'une de ces quatre voies :

| Voie | Quand | Ce que fait l'agent |
|---|---|---|
| 🎸 QUICK | petit, clair et facile à annuler | trouve le code, le modifie, vérifie. Aucune skill. |
| 🥁 STANDARD | un vrai bug, ou quelques fichiers | utilise au plus une skill ciblée (debugging, TDD) |
| 🎤 DEEP | schéma de base de données, migration, auth, paiement, plusieurs modules, nouvelle fonctionnalité | exécute le workflow complet de ton pack |
| 🎧 CLARIFY | le résultat attendu n'est pas clair | pose au plus deux questions, puis choisit une voie |

Si un changement QUICK s'avère plus gros que prévu (plus de fichiers, une zone risquée, un test qui échoue ailleurs), l'agent s'arrête et choisit une nouvelle voie.

Quand il saute un workflow lourd, il le signale en une ligne, sur un ton un peu insolent :

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
```

Ce ton reste dans le chat. Le code, les commits et les pull requests restent neutres. Pour un message neutre dans le chat aussi, définis `ROCKSTAR_ROUTER_TONE=sober`.

## Compatible avec n'importe quel pack de skills

Il n'y a aucun code spécifique à un pack. RockstarRouter lit les descriptions des skills que tu as installées :
- les skills qui font du brainstorming, rédigent des specs ou des plans, ou enchaînent d'autres skills ne sont utilisées qu'en DEEP ;
- les skills de debugging et de TDD peuvent être utilisées en STANDARD ;
- une skill qu'il ne sait pas classer est traitée comme DEEP, pour qu'elle ne s'exécute jamais sur une petite demande.

Certains packs demandent à l'agent d'utiliser une skill à chaque demande. RockstarRouter détecte ce type de règle et la contourne pour les petites demandes.

Testé avec ces packs :

| Pack | Lance son workflow lourd de lui-même ? | Profil spécifique dans RockstarRouter |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | oui, souvent | oui |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | parfois | oui |
| [Spec Kit](https://github.com/github/spec-kit) | non | non, règles génériques |
| [ECC](https://github.com/affaan-m/ECC) | non | non, règles génériques |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | non | non, règles génériques |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | non | non, règles génériques |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | non | non, règles génériques |
| [Agent OS](https://github.com/buildermethods/agent-os) | non | non, règles génériques |

Six des huit packs ont été gérés par les seules règles génériques.

## Benchmark

14 demandes sur un petit repo de démo, avec chacun des 8 packs, avec et sans RockstarRouter. Claude Code 2.1.308, Sonnet, mode headless. Données brutes : `bench/results-2026-10-22.json`.

**Workflow lourd lancé alors qu'une voie plus simple suffisait** (couleur, faute de frappe, niveau de log, format de date, petit bouton, résultats de recherche en double, export CSV, tests lents, deux demandes vagues) :

| Pack | Sans | Avec RockstarRouter |
|---|---|---|
| superpowers (2 runs) | 3 et 5 fois, dont une pour une couleur de bouton | 0 |
| BMAD Method | 1 : un workflow de build sur un export CSV, qui s'est bloqué sans rien livrer | 0 |
| les 6 autres packs | 0 | 0 |

**Workflow lourd lancé quand il était nécessaire** (renommer une colonne de base de données, multi-devises, passage des sessions à JWT, `/deep` explicite) :

| Pack | Sans | Avec RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 0/4 chacun : multi-devises codé directement dans 5 à 6 fichiers, sans spec | 4/4 chacun |

"Nécessaire" compte soit le workflow complet du pack, soit un arrêt pour poser une question avant un changement important. Le renommage de colonne sur OpenSpec et cc-sdd a demandé une correction de règle en v0.6 ("un changement de schéma est toujours DEEP"), puis est passé à 8/8 lors de deux nouveaux tests sur 4 packs.

En résumé : avec superpowers et BMAD, RockstarRouter évite les workflows lourds sur les petites demandes. Avec les six autres packs, il fait utiliser à l'agent le workflow du pack quand une demande en a réellement besoin.

**Coût** : sur les petites demandes, de +3k à +57k tokens par demande selon le pack, en plus d'une base de 110k à 280k. Quand RockstarRouter envoie une grosse demande vers le workflow complet, ce workflow peut coûter cher (cc-sdd a utilisé 1.2M tokens pour spécifier le multi-devises). Ce coût est la raison d'être de DEEP.

**Limites de ce benchmark** : un seul modèle, un seul petit repo, un ou deux runs par configuration. En mode headless, une skill de brainstorming s'arrête à sa première question, donc les runs sans RockstarRouter paraissent moins chers qu'une vraie session interactive. Sans aucun pack installé, le message de saut est quand même apparu une fois sur six runs.

Pour le lancer toi-même (nécessite git, node, npx, uvx et Claude Code) :

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## Installation

**Étape 1 : installer la skill (choisis une option)**

| Agent | Commande | Ce que tu obtiens |
|---|---|---|
| **Claude Code** (recommandé) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, puis `/plugin install rockstar-router@rockstar-router` | Skill et hooks : règle de routage chargée au démarrage de la session, `/deep` et `/quick` |
| **N'importe quel agent** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | Skill, dans le projet ou en global avec `-g` |
| **Sans skills.sh** | `npx rockstar-router-cli skills --yes` | Skill copiée dans `~/.agents/skills` et `~/.claude/skills` |

**Étape 2 : ajouter la règle de routage à ton projet**

Les agents sans hooks ont besoin de la règle dans leur fichier d'instructions. Sans elle, l'agent n'utilise RockstarRouter que s'il décide de charger la skill, et un pack qui impose son propre workflow passe souvent en premier.

- `npx rockstar-router-cli init` affiche ce qu'il va écrire. Rien n'est écrit tant que tu n'as pas confirmé.
- `npx rockstar-router-cli init --yes` écrit la règle dans `AGENTS.md` (et dans `CLAUDE.md` ou `GEMINI.md` si ton projet les utilise), entre des marqueurs, sans toucher au reste du fichier.

Avec le plugin Claude Code, cette étape est facultative : les hooks chargent déjà la règle.

**Étape 3 : vérifier**

- `npx rockstar-router-cli doctor`

**Mises à jour**

| Installé avec | Mise à jour |
|---|---|
| Plugin Claude Code | `claude plugin update rockstar-router@rockstar-router`, ou active la mise à jour automatique dans `/plugin` |
| skills.sh | `npx skills update` (`npx skills update -g` pour le global) |
| npm | `npx rockstar-router-cli@latest update` |

## Utilisation

Rien à faire : demande à ton agent comme d'habitude. Pour forcer une voie, commence ton message par :
- `/deep` ou `deep:` pour exécuter le workflow complet, quelle que soit la taille du changement ;
- `/quick` ou `quick:` pour sauter tout workflow.

Sans le plugin Claude Code, `deep:` et `quick:` ne fonctionnent que si l'agent les remarque.

| Variable | Valeurs | Défaut |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## Limites connues

- Le routage est une décision prise par le modèle à partir d'un prompt, pas une règle stricte. Il se trompera parfois.
- Certains packs imposent leur workflow par des mécanismes qu'une skill ne peut pas voir. RockstarRouter nomme les skills qu'il saute, pour que tu puisses repérer un conflit.
- Benchmarké uniquement sur Claude Code avec Sonnet. Sur Codex CLI, nous avons vérifié que la skill et la règle `AGENTS.md` sont bien chargées dans le contexte du modèle (`codex debug prompt-input`), mais le comportement de routage lui-même n'y est pas encore mesuré. Les résultats sur d'autres agents et modèles sont les bienvenus.

## Licence

MIT
