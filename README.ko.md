<p align="center">
  <img src="assets/rock-hand.png" alt="메탈 손가락 사인(뿔 모양)을 하는 해골 손" width="180">
  <br>
  <sub>일러스트: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · **한국어**

**버튼 색 하나 바꾸는데 코딩 에이전트가 스타디움 투어부터 잡는 일을 막아 줍니다.**

RockstarRouter는 코딩 에이전트(Claude Code, Codex, Cursor 등)용 skill입니다. 다른 skill이 실행되기 전에, 요청에 어느 정도의 프로세스가 필요한지 판단합니다.

## 문제

superpowers나 BMAD 같은 skill pack은 에이전트에 무거운 workflow를 추가합니다. 브레인스토밍, spec, 계획, 작업 목록, review 같은 것들입니다. 실제 기능 개발에는 유용합니다. 하지만 어떤 pack은 오타 수정이나 색 변경을 포함해 모든 요청에서 이 workflow를 시작합니다. 한 줄짜리 변경에 시간을 기다리고 token도 씁니다.

반대 문제를 가진 pack도 있습니다. 크거나 위험한 변경이라도, 직접 호출하지 않으면 workflow를 스스로 시작하지 않습니다.

## RockstarRouter가 하는 일

요청을 읽고 다음 네 가지 레인 중 하나를 고릅니다.

| 레인 | 언제 | 에이전트가 하는 일 |
|---|---|---|
| 🎸 QUICK | 작고, 명확하고, 되돌리기 쉬움 | 코드를 찾아 수정하고 확인합니다. skill은 쓰지 않습니다. |
| 🥁 STANDARD | 실제 버그, 또는 파일 몇 개 | 목적에 맞는 skill을 최대 하나 사용 (debugging, TDD) |
| 🎤 DEEP | 데이터베이스 스키마, 마이그레이션, 인증, 결제, 여러 모듈, 새 기능 | pack의 전체 workflow 실행 |
| 🎧 CLARIFY | 기대하는 결과가 불분명함 | 질문은 최대 두 개, 그다음 레인 선택 |

QUICK 변경이 예상보다 크다고 드러나면(파일이 늘어남, 위험한 영역, 다른 곳에서 테스트 실패), 에이전트는 작업을 멈추고 레인을 다시 고릅니다.

무거운 workflow를 건너뛸 때는 약간의 개성을 담은 한 줄로 그 사실을 알립니다.

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
```

이런 말투는 채팅 안에서만 씁니다. 코드, commit, pull request는 평범한 문장 그대로입니다. 채팅 메시지도 평범하게 받고 싶다면 `ROCKSTAR_ROUTER_TONE=sober`를 설정하세요.

## 어떤 skill pack과도 동작

pack 전용 코드는 없습니다. RockstarRouter는 설치된 skill의 설명을 읽습니다.
- 브레인스토밍을 하거나, spec이나 계획을 작성하거나, 다른 skill을 연달아 실행하는 skill은 DEEP에서만 사용합니다.
- debugging과 TDD skill은 STANDARD에서 사용할 수 있습니다.
- 분류할 수 없는 skill은 DEEP으로 취급하므로, 작은 요청에서는 절대 실행되지 않습니다.

어떤 pack은 모든 요청에서 특정 skill을 쓰라고 에이전트에 지시합니다. RockstarRouter는 이런 규칙을 감지하고, 작은 요청에서는 이를 무시하도록 덮어씁니다.

다음 pack으로 테스트했습니다.

| Pack | 무거운 workflow를 스스로 시작하나? | RockstarRouter 내 전용 프로필 |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | 예, 자주 | 있음 |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | 가끔 | 있음 |
| [Spec Kit](https://github.com/github/spec-kit) | 아니요 | 없음, 일반 규칙 |
| [ECC](https://github.com/affaan-m/ECC) | 아니요 | 없음, 일반 규칙 |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | 아니요 | 없음, 일반 규칙 |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | 아니요 | 없음, 일반 규칙 |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | 아니요 | 없음, 일반 규칙 |
| [Agent OS](https://github.com/buildermethods/agent-os) | 아니요 | 없음, 일반 규칙 |

8개 pack 중 6개는 일반 규칙만으로 처리되었습니다.

## 벤치마크

작은 데모 repo에서 요청 14개를, 8개 pack 각각에 대해 RockstarRouter가 있을 때와 없을 때로 실행했습니다. Claude Code 2.1.308, Sonnet, headless 모드. 원본 데이터: `bench/results-2026-10-22.json`.

**더 간단한 방법으로 충분했는데 무거운 workflow가 시작된 경우** (색, 오타, 로그 레벨, 날짜 형식, 작은 버튼, 중복된 검색 결과, CSV 내보내기, 느린 테스트, 모호한 요청 두 개):

| Pack | 없음 | RockstarRouter 사용 |
|---|---|---|
| superpowers (2회 실행) | 3회와 5회, 그중 한 번은 버튼 색 | 0 |
| BMAD Method | 1: CSV 내보내기에서 build workflow가 시작되었고, 중간에 멈춰 아무것도 전달하지 못함 | 0 |
| 나머지 6개 pack | 0 | 0 |

**필요할 때 무거운 workflow가 시작된 경우** (데이터베이스 컬럼 이름 변경, 다중 통화, 세션에서 JWT로 전환, 명시적인 `/deep`):

| Pack | 없음 | RockstarRouter 사용 |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 각각 0/4: 다중 통화를 spec 없이 파일 5~6개에 바로 구현 | 각각 4/4 |

"필요할 때"에는 pack의 전체 workflow 실행과, 큰 변경 전에 멈추고 질문하는 경우를 모두 포함합니다. OpenSpec과 cc-sdd에서의 컬럼 이름 변경은 v0.6에서 규칙 수정("스키마 변경은 항상 DEEP")이 필요했고, 이후 4개 pack에서 두 번씩 다시 테스트해 8/8로 통과했습니다.

요약하면, superpowers와 BMAD에서는 RockstarRouter가 작은 요청에서 무거운 workflow가 시작되는 것을 막습니다. 나머지 6개 pack에서는 요청이 실제로 필요로 할 때 에이전트가 pack의 workflow를 사용하게 합니다.

**비용**: 작은 요청에서는 pack에 따라 요청당 +3k에서 +57k token이 110k에서 280k의 기준치에 더해집니다. RockstarRouter가 큰 요청을 전체 workflow로 보내면, 그 workflow의 비용은 클 수 있습니다(cc-sdd는 다중 통화 spec 작성에 1.2M token을 사용했습니다). 그 비용을 쓰는 것이 바로 DEEP의 목적입니다.

**이 벤치마크의 한계**: 모델 하나, 작은 repo 하나, 구성당 한두 번 실행. headless 모드에서는 브레인스토밍 skill이 첫 질문에서 멈추기 때문에, RockstarRouter 없는 실행이 실제 대화형 세션보다 저렴해 보입니다. pack을 하나도 설치하지 않은 상태에서도, 여섯 번 중 한 번은 건너뛰기 메시지가 나타났습니다.

직접 실행하려면 (git, node, npx, uvx, Claude Code 필요):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## 설치

**1단계: skill 설치 (하나 선택)**

| 에이전트 | 명령어 | 결과 |
|---|---|---|
| **Claude Code** (권장) | `/plugin marketplace add GregoryBabonaux/RockstarRouter` 실행 후 `/plugin install rockstar-router@rockstar-router` | skill과 hook: 세션 시작 시 라우팅 규칙 로드, `/deep`과 `/quick` 사용 가능 |
| **모든 에이전트** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | skill을 프로젝트에, 또는 `-g`로 전역 설치 |
| **skills.sh 없음** | `npx rockstar-router-cli skills --yes` | skill을 `~/.agents/skills`와 `~/.claude/skills`에 복사 |

**2단계: 프로젝트에 라우팅 규칙 추가**

hook이 없는 에이전트는 지시 파일에 규칙이 있어야 합니다. 규칙이 없으면 에이전트는 skill을 로드하기로 스스로 판단할 때만 RockstarRouter를 사용하고, 자체 workflow를 강제하는 pack이 먼저 실행되는 경우가 많습니다.

- `npx rockstar-router-cli init`은 무엇을 쓸지 보여 줍니다. 확인하기 전에는 아무것도 쓰지 않습니다.
- `npx rockstar-router-cli init --yes`는 규칙을 `AGENTS.md`(프로젝트에서 사용한다면 `CLAUDE.md`나 `GEMINI.md`에도)의 마커 사이에 쓰며, 파일의 나머지 부분은 건드리지 않습니다.

Claude Code plugin을 사용한다면 이 단계는 선택 사항입니다. hook이 이미 규칙을 로드합니다.

**3단계: 확인**

- `npx rockstar-router-cli doctor`

**업데이트**

| 설치 방법 | 업데이트 |
|---|---|
| Claude Code plugin | `claude plugin update rockstar-router@rockstar-router`, 또는 `/plugin`에서 자동 업데이트 켜기 |
| skills.sh | `npx skills update` (전역 설치는 `npx skills update -g`) |
| npm | `npx rockstar-router-cli@latest update` |

## 사용법

따로 할 일은 없습니다. 평소처럼 에이전트에게 요청하세요. 레인을 강제로 지정하려면 메시지를 다음으로 시작합니다.
- `/deep` 또는 `deep:`: 변경 규모와 상관없이 전체 workflow를 실행합니다.
- `/quick` 또는 `quick:`: 모든 workflow를 건너뜁니다.

Claude Code plugin이 없으면 `deep:`과 `quick:`은 에이전트가 이를 알아챘을 때만 작동합니다.

| 변수 | 값 | 기본값 |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 알려진 한계

- 라우팅은 prompt를 바탕으로 모델이 내리는 판단이지, 강제 규칙이 아닙니다. 가끔 틀립니다.
- 어떤 pack은 skill이 볼 수 없는 방식으로 workflow를 강제합니다. RockstarRouter는 건너뛴 skill의 이름을 알려 주므로, 충돌을 발견할 수 있습니다.
- 벤치마크는 Claude Code와 Sonnet 조합에서만 했습니다. Codex CLI에서는 skill과 `AGENTS.md` 규칙이 모델 컨텍스트에 로드되는 것을 확인했지만(`codex debug prompt-input`), 라우팅 동작 자체는 아직 측정하지 않았습니다. 다른 에이전트와 모델에서의 결과를 환영합니다.

## 라이선스

MIT
