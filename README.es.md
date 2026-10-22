<p align="center">
  <img src="assets/rock-hand.png" alt="Mano de esqueleto haciendo los cuernos del metal" width="180">
  <br>
  <sub>Ilustración: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · **Español** · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

**Evita que tu agente reserve una gira de estadios para cambiar el color de un botón.**

Instalaste un skill pack. Grandes temas, gran banda. Luego pides corregir una errata y el baterista marca el inicio de una ópera de rock progresivo de 45 minutos: brainstorming, spec, plan, tareas, review. Tus tokens abandonan el recinto antes del primer acorde.

RockstarRouter es el jefe de escenario. Escucha la petición primero y decide el setlist: un tema punk de dos minutos o el show completo de estadio.

## 🎚️ El setlist

| Carril | Cuándo | Qué pasa |
|---|---|---|
| 🎸 QUICK | pequeño, claro, reversible | localizar, cambiar, verificar. Sin skill, sin ceremonia. |
| 🥁 STANDARD | un bug de verdad, o unos pocos archivos | como mucho un skill específico (debugging, TDD) |
| 🎤 DEEP | schema, migración, auth, pagos, varios módulos, funcionalidad nueva | el workflow completo de tu pack, pirotecnia incluida |
| 🎧 CLARIFY | nadie sabe qué significa "terminado" | dos preguntas como máximo, y de vuelta al escenario |

La artillería pesada nunca se confisca. En cuanto una petición la merece, RockstarRouter le pasa el micro al workflow de tu propio pack. Y si una ejecución QUICK empieza a crecer (más archivos, una zona de riesgo, un test que falla en otro sitio), corta la canción y cambia de ruta.

Cuando se carga un exceso, te lo dice:

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
🎸 ecc:orch-add-feature was ready to run a full research-plan-TDD-review set for one button. I sent it home.
```

La actitud se queda en el chat. El código, los commits y las PR se mantienen sobrios. ¿Prefieres un roadie discreto? `ROCKSTAR_ROUTER_TONE=sober`.

## 🤘 Toca con cualquier banda

Nada de código específico por pack. RockstarRouter lee los skills que tienes instalados y los clasifica según sus descripciones: todo lo que hace brainstorming, specs, planes o encadena otros skills solo toca en DEEP; debugging y TDD tocan en STANDARD; lo que no puede leer se trata como DEEP y nunca consigue un hueco en QUICK.

Los packs que imponen su workflow en cada petición ("you MUST invoke a skill if there is even a 1% chance") quedan detectados y desautorizados en las peticiones QUICK.

Probado en directo con:

| Pack | ¿Lanza workflows pesados por su cuenta? | Perfil en RockstarRouter |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | sí, a menudo | sí |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | a veces | sí |
| [Spec Kit](https://github.com/github/spec-kit) | no | no, reglas genéricas |
| [ECC](https://github.com/affaan-m/ECC) | no | no, reglas genéricas |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | no | no, reglas genéricas |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | no | no, reglas genéricas |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | no | no, reglas genéricas |
| [Agent OS](https://github.com/buildermethods/agent-os) | no | no, reglas genéricas |

Seis de los ocho packs funcionaron solo con reglas genéricas, y esa es la prueba de fuego.

## 📊 Los números

14 peticiones sobre un pequeño repo de demo, 8 packs, cada ejecución con y sin RockstarRouter. Claude Code 2.1.308, Sonnet, headless. Datos en bruto en `bench/results-2026-10-22.json`.

**Workflow pesado lanzado cuando bastaba con algo más ligero** (color, errata, nivel de log, formato de fecha, botón pequeño, resultados de búsqueda duplicados, exportación CSV, tests lentos, dos peticiones vagas):

| Pack | Sin | Con RockstarRouter |
|---|---|---|
| superpowers (2 ejecuciones) | 3 y 5 veces, una de ellas por el color de un botón | 0 |
| BMAD Method | 1, un workflow de build para una exportación CSV, atascado, nada entregado | 0 |
| los otros 6 packs | 0 | 0 |

**Workflow pesado cuando está justificado** (renombrar una columna de la BD, multimoneda, pasar de sesiones a JWT, `/deep` explícito):

| Pack | Sin | Con RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 0/4 cada uno: multimoneda programada directamente en 5 a 6 archivos, sin spec | 4/4 cada uno |

"Justificado" cuenta el workflow completo del pack, o una parada para preguntar antes de un cambio grande. El renombrado de columna en OpenSpec y cc-sdd necesitó un ajuste de regla en la v0.6 ("schema is always DEEP"), probado de nuevo dos veces en 4 packs: 8/8.

La segunda tabla es la sorpresa de la gira. La mayoría de los packs nunca sacan sus propios instrumentos pesados cuando la canción lo pide. RockstarRouter lo hace por ellos.

**Lo que cuesta**: en peticiones triviales, de +3k a +57k tokens por petición según el pack, sobre una base de 110k a 280k. Cuando RockstarRouter manda una petición grande al workflow completo, ese workflow puede salir caro (cc-sdd gastó 1.2M tokens especificando la multimoneda). Ese es el show de estadio que pediste.

**Letra pequeña**: un modelo, un repo pequeño, una o dos ejecuciones por configuración. En modo headless, un skill de brainstorming se detiene en su primera pregunta, así que las ejecuciones "sin" parecen más baratas que una sesión interactiva real. Sin ningún pack instalado, la frase de bis aun así se coló una vez de cada seis ejecuciones.

Tócalo tú mismo otra vez (necesitas git, node, npx, uvx y Claude Code):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## 🎫 Pase de backstage

**Paso 1: consigue el skill (elige una opción)**

| Agente | Comando | Qué obtienes |
|---|---|---|
| **Claude Code** (recomendado) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, luego `/plugin install rockstar-router@rockstar-router` | Skill y hooks: regla de enrutamiento en el escenario desde el inicio de la sesión, `/deep` y `/quick` |
| **Cualquier agente** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | Skill, en el proyecto o global con `-g` |
| **Sin skills.sh** | `npx rockstar-router-cli skills --yes` | Skill copiado en `~/.agents/skills` y `~/.claude/skills` |

**Paso 2: pon la regla de enrutamiento en tu proyecto**

Los agentes sin hooks necesitan la regla en su archivo de instrucciones; si no, el router solo toca cuando al agente le apetece cargarlo, y un pack que impone su propio workflow suele quedarse con el micro primero.

- `npx rockstar-router-cli init` muestra lo que va a escribir. No se escribe nada hasta que confirmes.
- `npx rockstar-router-cli init --yes` escribe la regla en `AGENTS.md` (y en `CLAUDE.md` o `GEMINI.md` si tu proyecto los usa), entre marcadores, sin tocar el resto del archivo.

Con el plugin de Claude Code, este paso es opcional: los hooks ya suben la regla al escenario.

**Paso 3: prueba de sonido**

- `npx rockstar-router-cli doctor`

**Actualizaciones**

| Instalado con | Actualizar |
|---|---|
| Plugin de Claude Code | `claude plugin update rockstar-router@rockstar-router`, o activa la actualización automática en `/plugin` |
| skills.sh | `npx skills update` (`npx skills update -g` para la instalación global) |
| npm | `npx rockstar-router-cli@latest update` |

## 🎛️ Controles

Tú solo pide. Para forzar el modo:
- `/deep` o `deep:` al inicio de tu mensaje: workflow completo, sea cual sea el tamaño;
- `/quick` o `quick:`: sin workflow, directo al riff.

Sin el plugin de Claude Code, `deep:` y `quick:` dependen de que el agente se fije en ellos.

| Variable | Valores | Por defecto |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 🩹 Límites conocidos

- El enrutamiento es una decisión del modelo guiada por un prompt, no una barrera infranqueable. A veces se equivocará.
- Algunos packs imponen su workflow mediante mecanismos que un skill no puede ver. El router nombra lo que se salta para que puedas detectar conflictos.
- Benchmark hecho solo en Claude Code con Sonnet. En Codex CLI comprobamos que la skill y la regla de `AGENTS.md` se cargan en el contexto del modelo (`codex debug prompt-input`), pero el comportamiento del routing todavía no se ha medido allí. Se agradecen resultados con otros agentes y modelos.

## Licencia

MIT. Súbele el volumen.
