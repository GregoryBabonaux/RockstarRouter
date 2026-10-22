<p align="center">
  <img src="assets/rock-hand.png" alt="메탈 혼을 치켜든 해골 손" width="180">
  <br>
  <sub>일러스트: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · **한국어**

**버튼 색 하나 바꾸자고 잠실 주경기장 투어부터 잡는 agent, 이제 그만.**

skill pack을 설치했습니다. 곡도 좋고 밴드도 끝내줍니다. 그런데 오타 하나 고쳐 달라고 했더니 드러머가 "원, 투, 쓰리, 포!" 하면서 45분짜리 프로그레시브 록 오페라를 시작합니다: brainstorming, spec, plan, tasks, review. 첫 코드를 잡기도 전에 token은 이미 공연장을 떠났습니다.

RockstarRouter는 무대 감독입니다. 요청을 제일 먼저 듣고 셋리스트를 정합니다: 2분짜리 펑크 한 곡이냐, 풀 스타디움 공연이냐.

## 🎚️ 셋리스트

| Lane | 언제 | 무슨 일이 일어나나 |
|---|---|---|
| 🎸 QUICK | 작고, 명확하고, 되돌릴 수 있을 때 | 찾고, 고치고, 확인. skill도 없고 의전도 없음. |
| 🥁 STANDARD | 진짜 버그, 또는 파일 몇 개 | 집중된 skill 최대 하나 (debugging, TDD) |
| 🎤 DEEP | schema, migration, auth, payment, cross-module, 새 기능 | pack의 풀 workflow, 불꽃놀이 포함 |
| 🎧 CLARIFY | "완료"가 뭔지 아무도 모를 때 | 질문은 최대 두 개, 그리고 바로 무대 복귀 |

중화기는 절대 압수하지 않습니다. 요청이 그럴 만한 순간, RockstarRouter는 pack 자체 workflow에 마이크를 넘깁니다. 그리고 QUICK으로 시작한 작업이 커지기 시작하면 (파일이 늘어나거나, 위험 구역에 들어가거나, 엉뚱한 데서 테스트가 깨지면) 곡을 멈추고 경로를 다시 잡습니다.

오버킬을 쳐냈을 때는 이렇게 알려 줍니다:

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
🎸 ecc:orch-add-feature was ready to run a full research-plan-TDD-review set for one button. I sent it home.
```

허세는 채팅에서만 부립니다. 코드, commit, PR은 멀쩡한 정신으로 남습니다. 조용한 로디가 더 좋다면? `ROCKSTAR_ROUTER_TONE=sober`.

## 🤘 어떤 밴드와도 합주 가능

pack 전용 코드는 없습니다. RockstarRouter는 설치된 skill을 읽고 description을 보고 분류합니다: brainstorming, spec, plan을 하거나 다른 skill을 줄줄이 엮는 건 DEEP에서만 연주하고, debugging과 TDD는 STANDARD에서 연주합니다. 읽을 수 없는 건 DEEP으로 취급하고 QUICK 무대에는 절대 세우지 않습니다.

모든 요청에 자기 workflow를 강요하는 pack ("1%라도 가능성이 있으면 반드시 skill을 호출해야 한다(MUST)")은 감지되고, QUICK 요청에서는 기각됩니다.

실제 무대에서 테스트한 밴드:

| Pack | 혼자서 무거운 workflow를 돌리나? | RockstarRouter 전용 프로필 |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | 예, 자주 | 있음 |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | 가끔 | 있음 |
| [Spec Kit](https://github.com/github/spec-kit) | 아니요 | 없음, 일반 규칙 |
| [ECC](https://github.com/affaan-m/ECC) | 아니요 | 없음, 일반 규칙 |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | 아니요 | 없음, 일반 규칙 |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | 아니요 | 없음, 일반 규칙 |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | 아니요 | 없음, 일반 규칙 |
| [Agent OS](https://github.com/buildermethods/agent-os) | 아니요 | 없음, 일반 규칙 |

8개 pack 중 6개는 일반 규칙만으로 돌아갔습니다. 진짜 실력은 여기서 드러납니다.

## 📊 숫자로 보기

작은 데모 repo에서 요청 14개, pack 8개, 각각 RockstarRouter 있을 때와 없을 때로 실행했습니다. Claude Code 2.1.308, Sonnet, headless. 원본 데이터는 `bench/results-2026-10-22.json`에 있습니다.

**가벼운 경로로 충분했는데 무거운 workflow가 터진 경우** (색상, 오타, log level, 날짜 포맷, 작은 버튼, 중복 검색 결과, CSV export, 느린 테스트, 모호한 요청 두 개):

| Pack | 없을 때 | RockstarRouter 있을 때 |
|---|---|---|
| superpowers (2 runs) | 3번과 5번, 그중 한 번은 버튼 색 때문에 | 0 |
| BMAD Method | 1번, CSV export에 build workflow를 돌리다 멈춤, 결과물 없음 | 0 |
| 나머지 6개 pack | 0 | 0 |

**무거운 workflow가 필요한 경우** (DB 컬럼 이름 변경, 다중 통화, 세션을 JWT로 전환, 명시적 `/deep`):

| Pack | 없을 때 | RockstarRouter 있을 때 |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 각 0/4: 다중 통화를 spec 없이 파일 5~6개에 바로 코딩 | 각 4/4 |

"필요한 경우"는 pack의 풀 workflow를 돌렸거나, 큰 변경 전에 멈춰서 물어본 경우를 셉니다. OpenSpec과 cc-sdd의 컬럼 이름 변경은 v0.6에서 규칙 수정이 필요했고 ("schema는 무조건 DEEP"), 4개 pack에서 두 번씩 재테스트해 8/8이 나왔습니다.

두 번째 표가 이번 투어 최대의 반전입니다. 대부분의 pack은 곡이 원할 때도 자기 중장비 악기를 집어 들지 않습니다. RockstarRouter가 대신 들어 줍니다.

**비용**: 사소한 요청에서는 pack에 따라 요청당 +3k에서 +57k token, 기본 110k에서 280k 위에 얹힙니다. RockstarRouter가 큰 요청을 풀 workflow로 보내면 그 workflow는 꽤 비쌀 수 있습니다 (cc-sdd는 다중 통화 spec 작성에 1.2M token을 썼습니다). 그게 바로 당신이 주문한 스타디움 공연입니다.

**깨알 같은 주의사항**: 모델 하나, 작은 repo 하나, 설정당 1~2회 실행. headless 모드에서는 brainstorming skill이 첫 질문에서 멈추기 때문에, "없을 때" 실행이 실제 대화형 세션보다 싸게 보입니다. pack이 하나도 없을 때도 앵콜 멘트가 여섯 번 중 한 번은 새어 나왔습니다.

직접 다시 연주해 보세요 (git, node, npx, uvx, Claude Code 필요):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## 🎫 백스테이지 패스

**1단계: skill 받기 (하나만 고르세요)**

| Agent | 명령어 | 받는 것 |
|---|---|---|
| **Claude Code** (추천) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`, 이어서 `/plugin install rockstar-router@rockstar-router` | skill과 hook: 세션 시작부터 라우팅 규칙이 무대에 오르고, `/deep`과 `/quick`도 사용 가능 |
| **아무 agent나** (Codex, Cursor, Gemini CLI, Copilot, OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | skill, 프로젝트에 설치하거나 `-g`로 전역 설치 |
| **skills.sh 없음** | `npx rockstar-router-cli skills --yes` | skill이 `~/.agents/skills`와 `~/.claude/skills`에 복사됨 |

**2단계: 라우팅 규칙을 프로젝트에 넣기**

hook이 없는 agent는 지시 파일에 규칙이 들어 있어야 합니다. 안 그러면 router는 agent가 내킬 때만 연주하고, 자기 workflow를 강요하는 pack이 보통 먼저 마이크를 낚아챕니다.

- `npx rockstar-router-cli init`은 무엇을 쓸지 먼저 보여 줍니다. 확인하기 전에는 아무것도 쓰지 않습니다.
- `npx rockstar-router-cli init --yes`는 규칙을 `AGENTS.md`에 (프로젝트에서 `CLAUDE.md`나 `GEMINI.md`를 쓰고 있다면 거기에도) 마커 사이에 쓰고, 파일의 나머지는 건드리지 않습니다.

Claude Code plugin을 쓰고 있다면 이 단계는 선택입니다: hook이 이미 규칙을 무대에 올려 둡니다.

**3단계: 사운드체크**

- `npx rockstar-router-cli doctor`

**업데이트**

| 설치 방법 | 업데이트 |
|---|---|
| Claude Code plugin | `claude plugin update rockstar-router@rockstar-router`, 또는 `/plugin`에서 자동 업데이트 켜기 |
| skills.sh | `npx skills update` (전역 설치라면 `npx skills update -g`) |
| npm | `npx rockstar-router-cli@latest update` |

## 🎛️ 컨트롤

그냥 요청하면 됩니다. 강제로 바꾸고 싶다면:
- 메시지 맨 앞에 `/deep` 또는 `deep:`: 크기와 상관없이 풀 workflow;
- `/quick` 또는 `quick:`: workflow 없이 바로 리프로 직행.

Claude Code plugin이 없으면 `deep:`과 `quick:`은 agent가 알아채 주기만을 기대해야 합니다.

| 변수 | 값 | 기본값 |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 🩹 알려진 한계

- 라우팅은 prompt가 이끄는 모델의 판단이지, 하드 게이트가 아닙니다. 가끔 잘못 판단합니다.
- 일부 pack은 skill이 볼 수 없는 방식으로 workflow를 강제합니다. router는 자기가 건너뛴 걸 이름으로 밝히니, 충돌을 찾아낼 수 있습니다.
- 벤치마크는 Claude Code와 Sonnet에서만 했습니다. Codex CLI에서는 skill과 `AGENTS.md` 규칙이 모델 컨텍스트에 로드되는 것까지 확인했지만(`codex debug prompt-input`), 라우팅 동작 자체는 아직 측정하지 않았습니다. 다른 agent와 모델에서의 결과 제보 환영합니다.

## License

MIT. 볼륨 올려.
