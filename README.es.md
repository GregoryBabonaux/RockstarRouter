<p align="center">
  <img src="assets/rock-hand.png" alt="Mano de esqueleto haciendo los cuernos del metal" width="180">
  <br>
  <sub>Ilustración: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · **Español** · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

🌐 [Sitio web](https://gregorybabonaux.github.io/RockstarRouter/)

**Evita que tu agente de código organice una gira por estadios para cambiar el color de un botón.**

RockstarRouter es una skill para agentes de código (Claude Code, Codex, Cursor y otros). Decide cuánto proceso merece una petición antes de que se ejecute cualquier otra skill.

## El problema

Los packs de skills como superpowers o BMAD añaden workflows pesados a tu agente: brainstorming, spec, plan, lista de tareas, review. Son útiles para funcionalidades reales. Pero algunos packs inician ese workflow con cualquier petición, incluida la corrección de una errata o un cambio de color. Esperas, y gastas tokens, por un cambio de una línea.

Otros packs tienen el problema contrario: nunca inician su workflow por sí solos, ni siquiera para un cambio grande o arriesgado, salvo que lo invoques tú.

## Qué hace RockstarRouter

Lee la petición y elige una de estas cuatro vías:

| Vía | Cuándo | Qué hace el agente |
|---|---|---|
| 🎸 QUICK | pequeño, claro y fácil de deshacer | encuentra el código, lo cambia, lo comprueba. Sin skill. |
| 🥁 STANDARD | un bug real, o unos pocos archivos | usa como máximo una skill concreta (debugging, TDD) |
| 🎤 DEEP | esquema de base de datos, migración, auth, pagos, varios módulos, nueva funcionalidad | ejecuta el workflow completo de tu pack |
| 🎧 CLARIFY | el resultado esperado no está claro | hace como máximo dos preguntas y luego elige una vía |

Si un cambio QUICK resulta más grande de lo previsto (más archivos, una zona arriesgada, un test que falla en otro sitio), el agente se detiene y elige una nueva vía.

Cuando se salta un workflow pesado, lo indica en una línea, con un poco de actitud:

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
```

La actitud se queda en el chat. El código, los commits y las pull requests siguen siendo sobrios. Para un mensaje sobrio también en el chat, define `ROCKSTAR_ROUTER_TONE=sober`.

## Funciona con cualquier pack de skills

No hay código específico para ningún pack. RockstarRouter lee las descripciones de las skills que tienes instaladas:
- las skills que hacen brainstorming, escriben specs o planes, o encadenan otras skills solo se usan en DEEP;
- las skills de debugging y TDD se pueden usar en STANDARD;
- una skill que no sabe clasificar se trata como DEEP, para que nunca se ejecute con una petición pequeña.

Algunos packs le dicen al agente que use una skill en cada petición. RockstarRouter detecta ese tipo de regla y la anula para las peticiones pequeñas.

Probado con estos packs:

| Pack | ¿Inicia su workflow pesado por sí solo? | Perfil específico en RockstarRouter |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | sí, a menudo | sí |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | a veces | sí |
| [Spec Kit](https://github.com/github/spec-kit) | no | no, reglas genéricas |
| [ECC](https://github.com/affaan-m/ECC) | no | no, reglas genéricas |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | no | no, reglas genéricas |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | no | no, reglas genéricas |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | no | no, reglas genéricas |
| [Agent OS](https://github.com/buildermethods/agent-os) | no | no, reglas genéricas |

Seis de los ocho packs se gestionaron solo con las reglas genéricas.

## Benchmark

14 peticiones sobre un pequeño repo de demo, con cada uno de los 8 packs, con y sin RockstarRouter. Claude Code 2.1.308, Sonnet, modo headless. Datos en bruto: `bench/results-2026-10-22.json`.

**Workflow pesado iniciado cuando bastaba una vía más simple** (color, errata, nivel de log, formato de fecha, botón pequeño, resultados de búsqueda duplicados, exportación CSV, tests lentos, dos peticiones vagas):

| Pack | Sin | Con RockstarRouter |
|---|---|---|
| superpowers (2 runs) | 3 y 5 veces, una de ellas para un color de botón | 0 |
| BMAD Method | 1: un workflow de build para una exportación CSV, que se atascó y no entregó nada | 0 |
| los otros 6 packs | 0 | 0 |

**Workflow pesado iniciado cuando hacía falta** (renombrar una columna de base de datos, multidivisa, pasar de sesiones a JWT, `/deep` explícito):

| Pack | Sin | Con RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 0/4 cada uno: multidivisa programado directamente en 5 a 6 archivos, sin spec | 4/4 cada uno |

"Hacía falta" cuenta tanto el workflow completo del pack como una parada para preguntar antes de un cambio grande. El renombrado de columna en OpenSpec y cc-sdd requirió corregir una regla en la v0.6 ("un cambio de esquema siempre es DEEP"), y después pasó 8/8 al volver a probarse dos veces en 4 packs.

En resumen: con superpowers y BMAD, RockstarRouter evita workflows pesados en peticiones pequeñas. Con los otros seis packs, hace que el agente use el workflow del pack cuando una petición realmente lo necesita.

**Coste**: en peticiones pequeñas, de +3k a +57k tokens por petición según el pack, sobre una base de 110k a 280k. Cuando RockstarRouter envía una petición grande al workflow completo, ese workflow puede costar mucho (cc-sdd usó 1.2M tokens para especificar la multidivisa). Ese coste es justamente el propósito de DEEP.

**Límites de este benchmark**: un solo modelo, un solo repo pequeño, uno o dos runs por configuración. En modo headless, una skill de brainstorming se detiene en su primera pregunta, así que los runs sin RockstarRouter parecen más baratos de lo que sería una sesión interactiva real. Sin ningún pack instalado, el mensaje de salto apareció igualmente una vez de cada seis runs.

Para ejecutarlo tú mismo (necesitas git, node, npx, uvx y Claude Code):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## Instalación

**Paso 1: instala la skill (elige una opción)**

| Agente | Comando | Qué obtienes |
|---|---|---|
| **Claude Code** (recomendado) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, después `/plugin install rockstar-router@rockstar-router` | Skill y hooks: regla de enrutamiento cargada al inicio de la sesión, `/deep` y `/quick` |
| **Cualquier agente** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | Skill, en el proyecto o global con `-g` |
| **Sin skills.sh** | `npx rockstar-router-cli skills --yes` | Skill copiada en `~/.agents/skills` y `~/.claude/skills` |

**Paso 2: añade la regla de enrutamiento a tu proyecto**

Los agentes sin hooks necesitan la regla en su archivo de instrucciones. Sin ella, el agente solo usa RockstarRouter cuando decide cargar la skill, y un pack que impone su propio workflow suele ejecutarse antes.

- `npx rockstar-router-cli init` muestra lo que va a escribir. No se escribe nada hasta que confirmes.
- `npx rockstar-router-cli init --yes` escribe la regla en `AGENTS.md` (y en `CLAUDE.md` o `GEMINI.md` si tu proyecto los usa), entre marcadores, sin tocar el resto del archivo.

Con el plugin de Claude Code, este paso es opcional: los hooks ya cargan la regla.

**Paso 3: comprueba**

- `npx rockstar-router-cli doctor`

**Actualizaciones**

| Instalado con | Actualización |
|---|---|
| Plugin de Claude Code | `claude plugin update rockstar-router@rockstar-router`, o activa la actualización automática en `/plugin` |
| skills.sh | `npx skills update` (`npx skills update -g` para la instalación global) |
| npm | `npx rockstar-router-cli@latest update` |

## Uso

No tienes que hacer nada: pídele cosas a tu agente como siempre. Para forzar una vía, empieza tu mensaje con:
- `/deep` o `deep:` para ejecutar el workflow completo, sea cual sea el tamaño del cambio;
- `/quick` o `quick:` para saltarte cualquier workflow.

Sin el plugin de Claude Code, `deep:` y `quick:` solo funcionan si el agente se fija en ellos.

| Variable | Valores | Por defecto |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## Limitaciones conocidas

- El enrutamiento es una decisión que toma el modelo a partir de un prompt, no una regla estricta. A veces se equivocará.
- Algunos packs imponen su workflow mediante mecanismos que una skill no puede ver. RockstarRouter nombra las skills que se salta, para que puedas detectar un conflicto.
- Solo se ha hecho el benchmark en Claude Code con Sonnet. En Codex CLI comprobamos que la skill y la regla de `AGENTS.md` se cargan en el contexto del modelo (`codex debug prompt-input`), pero el comportamiento de enrutamiento en sí todavía no se ha medido allí. Se agradecen resultados en otros agentes y modelos.

## Licencia

MIT
