<p align="center">
  <img src="assets/rock-hand.png" alt="Mão de esqueleto fazendo o chifrinho do metal" width="180">
  <br>
  <sub>Ilustração: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · **Português** · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

**Impede seu agente de marcar uma turnê de estádio só pra trocar a cor de um botão.**

Você instalou um skill pack. Músicas boas, banda boa. Aí você pede pra corrigir um typo e o baterista puxa uma ópera de rock progressivo de 45 minutos: brainstorming, spec, plano, tasks, review. Seus tokens já foram embora antes do primeiro acorde.

O RockstarRouter é o produtor de palco. Ele escuta o pedido primeiro e decide o setlist: um punk de dois minutos ou o show completo no estádio.

## 🎚️ O setlist

| Faixa | Quando | O que rola |
|---|---|---|
| 🎸 QUICK | pequeno, claro, reversível | localiza, muda, verifica. Sem skill, sem cerimônia. |
| 🥁 STANDARD | um bug de verdade, ou alguns arquivos | no máximo uma skill focada (debugging, TDD) |
| 🎤 DEEP | schema, migration, auth, pagamento, cross-module, nova funcionalidade | o workflow completo do seu pack, pirotecnia inclusa |
| 🎧 CLARIFY | ninguém sabe como é o "pronto" | duas perguntas no máximo, depois volta pro palco |

A artilharia pesada nunca é confiscada. Assim que um pedido merece, o RockstarRouter passa o microfone pro workflow do seu próprio pack. E se uma execução QUICK começa a crescer (mais arquivos, uma zona de risco, um teste falhando em outro lugar), ele para a música e muda a rota.

Quando ele corta um exagero, ele te avisa:

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
🎸 ecc:orch-add-feature was ready to run a full research-plan-TDD-review set for one button. I sent it home.
```

A atitude fica no chat. Código, commits e PRs ficam sóbrios. Prefere um roadie quietinho? `ROCKSTAR_ROUTER_TONE=sober`.

## 🤘 Toca com qualquer banda

Zero código específico de pack. O RockstarRouter lê as skills que você instalou e classifica cada uma pela descrição: tudo que faz brainstorming, spec, planejamento ou encadeia outras skills só toca no DEEP; debugging e TDD tocam no STANDARD; o que ele não consegue ler é tratado como DEEP e nunca ganha vaga no QUICK.

Packs que empurram o workflow deles em todo pedido ("you MUST invoke a skill if there is even a 1% chance") são identificados e passados por cima nos pedidos QUICK.

Testado ao vivo com:

| Pack | Dispara workflows pesados por conta própria? | Perfil no RockstarRouter |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | sim, com frequência | sim |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | às vezes | sim |
| [Spec Kit](https://github.com/github/spec-kit) | não | não, regras genéricas |
| [ECC](https://github.com/affaan-m/ECC) | não | não, regras genéricas |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | não | não, regras genéricas |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | não | não, regras genéricas |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | não | não, regras genéricas |
| [Agent OS](https://github.com/buildermethods/agent-os) | não | não, regras genéricas |

Seis dos oito packs rodaram só com as regras genéricas, e esse é o teste de verdade.

## 📊 Os números

14 pedidos num repo de demo pequeno, 8 packs, cada um rodado com e sem o RockstarRouter. Claude Code 2.1.308, Sonnet, headless. Dados brutos em `bench/results-2026-10-22.json`.

**Workflow pesado disparado quando um caminho mais leve bastava** (cor, typo, nível de log, formato de data, botão pequeno, resultados de busca duplicados, export CSV, testes lentos, dois pedidos vagos):

| Pack | Sem | Com RockstarRouter |
|---|---|---|
| superpowers (2 runs) | 3 e 5 vezes, uma delas pra cor de um botão | 0 |
| BMAD Method | 1, um workflow de build num export CSV, travou, nada entregue | 0 |
| os outros 6 packs | 0 | 0 |

**Workflow pesado quando ele se justifica** (renomear uma coluna do banco, multi-moeda, sessões pra JWT, `/deep` explícito):

| Pack | Sem | Com RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 0/4 cada: multi-moeda codado direto em 5 a 6 arquivos, sem spec | 4/4 cada |

"Se justifica" conta o workflow completo do pack, ou uma parada pra perguntar antes de uma mudança grande. O rename de coluna no OpenSpec e no cc-sdd precisou de um ajuste de regra na v0.6 ("schema é sempre DEEP"), retestado duas vezes em 4 packs: 8/8.

A segunda tabela é a surpresa da turnê. A maioria dos packs nunca pega os próprios instrumentos pesados quando a música pede. O RockstarRouter faz isso por eles.

**Quanto custa**: em pedidos triviais, de +3k a +57k tokens por pedido dependendo do pack, em cima de uma base de 110k a 280k. Quando o RockstarRouter manda um pedido grande pro workflow completo, esse workflow pode custar caro (o cc-sdd gastou 1.2M tokens especificando multi-moeda). Esse é o show de estádio que você pediu.

**Letras miúdas**: um modelo, um repo pequeno, uma ou duas runs por config. No modo headless, uma skill de brainstorming para na primeira pergunta, então as runs "sem" parecem mais baratas do que uma sessão interativa de verdade. Sem nenhum pack instalado, a frase de bis ainda escapou uma vez em seis runs.

Toque de novo você mesmo (precisa de git, node, npx, uvx e Claude Code):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## 🎫 Passe de backstage

**Passo 1: pegue a skill (escolha um jeito)**

| Agente | Comando | O que você leva |
|---|---|---|
| **Claude Code** (recomendado) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, depois `/plugin install rockstar-router@rockstar-router` | Skill e hooks: regra de roteamento no palco no início da sessão, `/deep` e `/quick` |
| **Qualquer agente** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | Skill, no projeto ou global com `-g` |
| **Sem skills.sh** | `npx rockstar-router-cli skills --yes` | Skill copiada pra `~/.agents/skills` e `~/.claude/skills` |

**Passo 2: coloque a regra de roteamento no seu projeto**

Agentes sem hooks precisam da regra no arquivo de instruções deles, senão o router só toca quando o agente tá a fim de carregá-lo, e um pack que força o próprio workflow geralmente pega o microfone primeiro.

- `npx rockstar-router-cli init` mostra o que ele vai escrever. Nada é escrito até você confirmar.
- `npx rockstar-router-cli init --yes` escreve a regra no `AGENTS.md` (e no `CLAUDE.md` ou `GEMINI.md` se o seu projeto usa), entre marcadores, sem mexer no resto do arquivo.

Com o plugin do Claude Code, esse passo é opcional: os hooks já levam a regra pro palco.

**Passo 3: passagem de som**

- `npx rockstar-router-cli doctor`

**Atualizações**

| Instalado com | Atualização |
|---|---|
| Plugin do Claude Code | `claude plugin update rockstar-router@rockstar-router`, ou ative o auto-update no `/plugin` |
| skills.sh | `npx skills update` (`npx skills update -g` pro global) |
| npm | `npx rockstar-router-cli@latest update` |

## 🎛️ Controles

É só pedir. Pra forçar:
- `/deep` ou `deep:` no início da mensagem: workflow completo, seja qual for o tamanho;
- `/quick` ou `quick:`: sem workflow, direto pro riff.

Sem o plugin do Claude Code, `deep:` e `quick:` dependem do agente perceber.

| Variável | Valores | Padrão |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 🩹 Limites conhecidos

- O roteamento é uma decisão do modelo guiada por um prompt, não uma trava rígida. Às vezes ele vai errar a mão.
- Alguns packs forçam o workflow por mecanismos que uma skill não enxerga. O router diz o que ele pula, pra você identificar os conflitos.
- Benchmark feito só no Claude Code com Sonnet. No Codex CLI, verificamos que a skill e a regra do `AGENTS.md` são carregadas no contexto do modelo (`codex debug prompt-input`), mas o comportamento do routing ainda não foi medido lá. Resultados com outros agentes e modelos são bem-vindos.

## Licença

MIT. Aumenta o som.
