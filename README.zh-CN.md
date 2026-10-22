<p align="center">
  <img src="assets/rock-hand.png" alt="骷髅手比出金属礼手势" width="180">
  <br>
  <sub>插图: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · **简体中文** · [日本語](README.ja.md) · [한국어](README.ko.md)

**改个按钮颜色而已，别让你的 agent 去包下整座体育场开巡演。**

你装了一个 skill 包。歌好听，乐队也牛。结果你只想修个错别字，鼓手直接起拍，来了一场 45 分钟的前卫摇滚歌剧：头脑风暴、写 spec、做计划、拆任务、搞 review。第一个和弦还没响，你的 token 已经散场走光了。

RockstarRouter 就是舞台监督。需求先过它的耳朵，由它来定歌单：是两分钟的朋克快歌，还是体育场全套大秀。

## 🎚️ 歌单

| 通道 | 什么时候 | 会发生什么 |
|---|---|---|
| 🎸 QUICK | 小、清楚、可回滚 | 定位、修改、验证。不用 skill，不走仪式。 |
| 🥁 STANDARD | 一个真 bug，或者涉及几个文件 | 最多一个专注的 skill（debugging、TDD） |
| 🎤 DEEP | schema、迁移、auth、支付、跨模块、新能力 | 你那个包的完整 workflow，烟火特效全上 |
| 🎧 CLARIFY | 没人知道"做完"长啥样 | 最多问两个问题，然后回到舞台 |

重型火力从来不会被没收。只要需求配得上，RockstarRouter 立刻把麦克风交给你那个包自己的 workflow。要是一个 QUICK 任务越弹越长（文件变多、碰到高风险区域、别处有测试挂了），它会喊停这首歌，重新分流。

每次它掐掉一场用力过猛的演出，都会告诉你：

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
🎸 ecc:orch-add-feature was ready to run a full research-plan-TDD-review set for one button. I sent it home.
```

摇滚范儿只留在聊天里。代码、commit 和 PR 保持正经。想要一个安静干活的 roadie？设置 `ROCKSTAR_ROUTER_TONE=sober`。

## 🤘 跟哪支乐队都能合

没有任何针对特定包的代码。RockstarRouter 读取你已安装的 skill，根据它们的描述来分类：凡是搞头脑风暴、写 spec、做计划或者串联其他 skill 的，只能上 DEEP；debugging 和 TDD 上 STANDARD；读不懂的一律当 DEEP 处理，绝不给 QUICK 的出场机会。

那些逼着每个请求都走它们 workflow 的包（"哪怕只有 1% 的可能，你也 MUST 调用 skill"）会被识破，在 QUICK 请求上被直接否决。

已经上台实测过的乐队：

| 包 | 会自己启动重型 workflow？ | RockstarRouter 里有专属 profile？ |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | 会，经常 | 有 |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | 有时会 | 有 |
| [Spec Kit](https://github.com/github/spec-kit) | 不会 | 没有，走通用规则 |
| [ECC](https://github.com/affaan-m/ECC) | 不会 | 没有，走通用规则 |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | 不会 | 没有，走通用规则 |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | 不会 | 没有，走通用规则 |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | 不会 | 没有，走通用规则 |
| [Agent OS](https://github.com/buildermethods/agent-os) | 不会 | 没有，走通用规则 |

八个包里有六个只靠通用规则跑，这才是真正的考验。

## 📊 数据说话

在一个小型 demo repo 上跑 14 个请求，8 个包，每个都分别在有和没有 RockstarRouter 的情况下跑一遍。Claude Code 2.1.308，Sonnet，headless 模式。原始数据在 `bench/results-2026-10-22.json`。

**明明轻量路径就够了，却启动了重型 workflow**（颜色、错别字、日志级别、日期格式、小按钮、搜索结果重复、CSV 导出、测试太慢、两个模糊需求）：

| 包 | 不用 | 用 RockstarRouter |
|---|---|---|
| superpowers（跑了 2 轮） | 3 次和 5 次，其中一次是为了改按钮颜色 | 0 |
| BMAD Method | 1 次，为了一个 CSV 导出启动了 build workflow，卡死，啥也没交付 | 0 |
| 其余 6 个包 | 0 | 0 |

**该上重型 workflow 的时候**（重命名一个 DB 列、多币种、session 换成 JWT、显式 `/deep`）：

| 包 | 不用 | 用 RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 各 0/4：多币种直接硬写进 5 到 6 个文件，没有 spec | 各 4/4 |

"该上"的判定标准：要么跑了包的完整 workflow，要么在大改动之前停下来先问。OpenSpec 和 cc-sdd 上的列重命名需要在 v0.6 修一条规则（"schema 永远是 DEEP"），之后在 4 个包上各复测两次：8/8。

第二张表是这次巡演最大的惊喜。大多数包在歌曲需要的时候，根本不会主动拿起自己的重型乐器。RockstarRouter 替它们拿了。

**代价是什么**：在简单请求上，视包而定，每个请求多花 +3k 到 +57k token，基线是 110k 到 280k。当 RockstarRouter 把一个大需求交给完整 workflow 时，这个 workflow 本身可能很贵（cc-sdd 为了给多币种写 spec 烧了 1.2M token）。不过，那就是你点的体育场大秀。

**小字条款**：一个模型，一个小 repo，每种配置跑一到两轮。在 headless 模式下，brainstorming skill 会停在它的第一个问题上，所以"不用"那几轮看起来比真实的交互式会话更省。在没装任何包的情况下，返场台词还是在六轮里溜出来了一次。

想自己再演一遍（需要 git、node、npx、uvx 和 Claude Code）：

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## 🎫 后台通行证

**第 1 步：拿到 skill（三选一）**

| Agent | 命令 | 你能得到什么 |
|---|---|---|
| **Claude Code**（推荐） | `/plugin marketplace add GregoryBabonaux/RockstarRouter`，然后 `/plugin install rockstar-router@rockstar-router` | skill 加 hook：session 一开始路由规则就登台，外加 `/deep` 和 `/quick` |
| **任意 agent**（Codex、Cursor、Gemini CLI、Copilot、OpenCode…） | `npx skills add GregoryBabonaux/RockstarRouter` | skill，装在项目里，或者加 `-g` 全局安装 |
| **没有 skills.sh** | `npx rockstar-router-cli skills --yes` | skill 被复制到 `~/.agents/skills` 和 `~/.claude/skills` |

**第 2 步：把路由规则放进你的项目**

没有 hook 的 agent 需要把规则写进它们的指令文件，否则 router 只在 agent 心情好愿意加载时才上台，而那些强推自家 workflow 的包通常会先抢走麦克风。

- `npx rockstar-router-cli init` 先给你看它要写什么。你确认之前，一个字都不会写。
- `npx rockstar-router-cli init --yes` 把规则写进 `AGENTS.md`（如果你的项目在用 `CLAUDE.md` 或 `GEMINI.md`，也会写进去），放在标记之间，文件其余部分一律不碰。

用 Claude Code plugin 的话，这一步可以跳过：hook 已经把规则送上舞台了。

**第 3 步：试音**

- `npx rockstar-router-cli doctor`

**更新**

| 安装方式 | 更新 |
|---|---|
| Claude Code plugin | `claude plugin update rockstar-router@rockstar-router`，或者在 `/plugin` 里打开自动更新 |
| skills.sh | `npx skills update`（全局安装用 `npx skills update -g`） |
| npm | `npx rockstar-router-cli@latest update` |

## 🎛️ 控制台

直接提需求就行。想手动接管：
- 在消息开头加 `/deep` 或 `deep:`：不管大小，完整 workflow 走起；
- `/quick` 或 `quick:`：不走 workflow，直接上 riff。

没有 Claude Code plugin 的话，`deep:` 和 `quick:` 就只能指望 agent 自己注意到了。

| 变量 | 取值 | 默认值 |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 🩹 已知局限

- 路由是模型在 prompt 引导下做出的判断，不是硬性关卡。偶尔会判断失误。
- 有些包通过 skill 看不到的机制强推自己的 workflow。router 会说出它跳过了什么，方便你发现冲突。
- 基准测试目前只在 Claude Code + Sonnet 上做过。在 Codex CLI 上，我们确认了 skill 和 `AGENTS.md` 规则会被加载进模型上下文（`codex debug prompt-input`），但还没有测量那边的路由行为。欢迎分享在其他 agent 和模型上的结果。

## License

MIT。音量开到最大。
