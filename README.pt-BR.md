<p align="center">
  <img src="assets/rock-hand.png" alt="Mão de esqueleto fazendo o sinal de chifres do metal" width="180">
  <br>
  <sub>Ilustração: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · **Português** · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

**Impede que seu agente de programação organize uma turnê de estádio só para mudar a cor de um botão.**

RockstarRouter é uma skill para agentes de programação (Claude Code, Codex, Cursor e outros). Ela decide quanto processo um pedido merece antes que qualquer outra skill seja executada.

## O problema

Packs de skills como superpowers ou BMAD adicionam workflows pesados ao seu agente: brainstorming, spec, plano, lista de tarefas, review. Eles são úteis para funcionalidades de verdade. Mas alguns packs iniciam esse workflow em qualquer pedido, inclusive na correção de um erro de digitação ou na troca de uma cor. Você espera, e gasta tokens, por uma alteração de uma linha.

Outros packs têm o problema oposto: nunca iniciam o workflow por conta própria, mesmo para uma alteração grande ou arriscada, a menos que você mesmo o chame.

## O que o RockstarRouter faz

Ele lê o pedido e escolhe uma de quatro faixas:

| Faixa | Quando | O que o agente faz |
|---|---|---|
| 🎸 QUICK | pequeno, claro e fácil de desfazer | encontra o código, altera e verifica. Nenhuma skill. |
| 🥁 STANDARD | um bug real, ou alguns arquivos | usa no máximo uma skill específica (debugging, TDD) |
| 🎤 DEEP | schema do banco de dados, migração, autenticação, pagamento, vários módulos, nova funcionalidade | executa o workflow completo do seu pack |
| 🎧 CLARIFY | o resultado esperado não está claro | faz no máximo duas perguntas e depois escolhe uma faixa |

Se uma alteração QUICK se revelar maior do que o esperado (mais arquivos, uma área arriscada, um teste falhando em outro lugar), o agente para e escolhe uma nova faixa.

Quando pula um workflow pesado, ele avisa em uma linha, com um pouco de atitude:

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
```

A atitude fica no chat. Código, commits e pull requests continuam neutros. Para ter uma mensagem neutra também no chat, defina `ROCKSTAR_ROUTER_TONE=sober`.

## Funciona com qualquer pack de skills

Não há código específico para nenhum pack. O RockstarRouter lê as descrições das skills que você instalou:
- skills que fazem brainstorming, escrevem specs ou planos, ou encadeiam outras skills são usadas apenas em DEEP;
- skills de debugging e TDD podem ser usadas em STANDARD;
- uma skill que ele não consegue classificar é tratada como DEEP, então nunca é executada em um pedido pequeno.

Alguns packs mandam o agente usar uma skill em todo pedido. O RockstarRouter detecta esse tipo de regra e a ignora nos pedidos pequenos.

Testado com estes packs:

| Pack | Inicia o workflow pesado por conta própria? | Perfil específico no RockstarRouter |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | sim, com frequência | sim |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | às vezes | sim |
| [Spec Kit](https://github.com/github/spec-kit) | não | não, regras genéricas |
| [ECC](https://github.com/affaan-m/ECC) | não | não, regras genéricas |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | não | não, regras genéricas |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | não | não, regras genéricas |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | não | não, regras genéricas |
| [Agent OS](https://github.com/buildermethods/agent-os) | não | não, regras genéricas |

Seis dos oito packs foram tratados apenas pelas regras genéricas.

## Benchmark

14 pedidos em um pequeno repo de demonstração, com cada um dos 8 packs, com e sem RockstarRouter. Claude Code 2.1.308, Sonnet, modo headless. Dados brutos: `bench/results-2026-10-22.json`.

**Workflow pesado iniciado quando um caminho mais simples bastava** (cor, erro de digitação, nível de log, formato de data, botão pequeno, resultados de busca duplicados, exportação CSV, testes lentos, dois pedidos vagos):

| Pack | Sem | Com RockstarRouter |
|---|---|---|
| superpowers (2 execuções) | 3 e 5 vezes, uma delas para a cor de um botão | 0 |
| BMAD Method | 1: um workflow de build em uma exportação CSV, que travou e não entregou nada | 0 |
| os outros 6 packs | 0 | 0 |

**Workflow pesado iniciado quando era necessário** (renomear uma coluna do banco de dados, múltiplas moedas, trocar sessões por JWT, `/deep` explícito):

| Pack | Sem | Com RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 0/4 cada: múltiplas moedas implementado direto em 5 a 6 arquivos, sem spec | 4/4 cada |

"Necessário" conta tanto o workflow completo do pack quanto uma parada para perguntar antes de uma alteração grande. A renomeação de coluna no OpenSpec e no cc-sdd exigiu uma correção de regra na v0.6 ("uma alteração de schema é sempre DEEP") e depois passou 8/8 ao ser testada de novo duas vezes em 4 packs.

Resumindo: com superpowers e BMAD, o RockstarRouter evita workflows pesados em pedidos pequenos. Com os outros seis packs, ele faz o agente usar o workflow do pack quando um pedido realmente precisa.

**Custo**: em pedidos pequenos, de +3k a +57k tokens por pedido dependendo do pack, além de uma base de 110k a 280k. Quando o RockstarRouter envia um pedido grande para o workflow completo, esse workflow pode custar muito (o cc-sdd usou 1,2M de tokens para especificar múltiplas moedas). Esse custo é justamente o objetivo do DEEP.

**Limites deste benchmark**: um modelo, um repo pequeno, uma ou duas execuções por configuração. No modo headless, uma skill de brainstorming para na primeira pergunta, então as execuções sem RockstarRouter parecem mais baratas do que uma sessão interativa real seria. Sem nenhum pack instalado, a mensagem de pulo ainda apareceu uma vez em seis execuções.

Para executar você mesmo (requer git, node, npx, uvx e Claude Code):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## Instalação

**Passo 1: instale a skill (escolha uma opção)**

| Agente | Comando | O que você recebe |
|---|---|---|
| **Claude Code** (recomendado) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, depois `/plugin install rockstar-router@rockstar-router` | Skill e hooks: regra de roteamento carregada no início da sessão, `/deep` e `/quick` |
| **Qualquer agente** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | Skill, no projeto ou globalmente com `-g` |
| **Sem skills.sh** | `npx rockstar-router-cli skills --yes` | Skill copiada para `~/.agents/skills` e `~/.claude/skills` |

**Passo 2: adicione a regra de roteamento ao seu projeto**

Agentes sem hooks precisam da regra no arquivo de instruções. Sem ela, o agente só usa o RockstarRouter quando decide carregar a skill, e um pack que impõe o próprio workflow costuma ser executado primeiro.

- `npx rockstar-router-cli init` mostra o que vai escrever. Nada é escrito até você confirmar.
- `npx rockstar-router-cli init --yes` escreve a regra em `AGENTS.md` (e em `CLAUDE.md` ou `GEMINI.md`, se o seu projeto os usar), entre marcadores, sem tocar no resto do arquivo.

Com o plugin do Claude Code, este passo é opcional: os hooks já carregam a regra.

**Passo 3: verifique**

- `npx rockstar-router-cli doctor`

**Atualizações**

| Instalado com | Atualização |
|---|---|
| Plugin do Claude Code | `claude plugin update rockstar-router@rockstar-router`, ou ative a atualização automática em `/plugin` |
| skills.sh | `npx skills update` (`npx skills update -g` para a instalação global) |
| npm | `npx rockstar-router-cli@latest update` |

## Uso

Não há nada a fazer: peça ao seu agente como de costume. Para forçar uma faixa, comece sua mensagem com:
- `/deep` ou `deep:` para executar o workflow completo, qualquer que seja o tamanho da alteração;
- `/quick` ou `quick:` para pular qualquer workflow.

Sem o plugin do Claude Code, `deep:` e `quick:` só funcionam se o agente percebê-los.

| Variável | Valores | Padrão |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## Limites conhecidos

- O roteamento é uma decisão tomada pelo modelo a partir de um prompt, não uma regra rígida. Às vezes ele vai errar.
- Alguns packs impõem o próprio workflow por mecanismos que uma skill não consegue ver. O RockstarRouter informa as skills que pula, para que você possa identificar um conflito.
- Benchmark feito apenas no Claude Code com Sonnet. No Codex CLI, verificamos que a skill e a regra do `AGENTS.md` são carregadas no contexto do modelo (`codex debug prompt-input`), mas o comportamento de roteamento em si ainda não foi medido lá. Resultados em outros agentes e modelos são bem-vindos.

## Licença

MIT
