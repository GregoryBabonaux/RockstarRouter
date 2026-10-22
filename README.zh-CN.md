<p align="center">
  <img src="assets/rock-hand.png" alt="比出金属礼手势的骷髅手" width="180">
  <br>
  <sub>插图：<a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · **简体中文** · [日本語](README.ja.md) · [한국어](README.ko.md)

**别让你的编程 agent 为了改一个按钮颜色，就去筹办一场体育场巡演。**

RockstarRouter 是一个面向编程 agent（Claude Code、Codex、Cursor 等）的 skill。它在任何其他 skill 运行之前，先判断一个请求需要多少流程。

## 问题

superpowers 或 BMAD 这类 skill pack 会给 agent 加上很重的 workflow：brainstorming、spec、计划、任务清单、review。对于真正的功能开发，这些很有用。但有些 pack 对任何请求都会启动这套 workflow，包括修一个错别字或改一个颜色。为了一行改动，你要等待，还要消耗 token。

另一些 pack 的问题正好相反：除非你手动调用，否则它们从不主动启动 workflow，即使是大型或有风险的改动也一样。

## RockstarRouter 做什么

它读取请求，然后从四个通道中选一个：

| 通道 | 适用情况 | agent 的做法 |
|---|---|---|
| 🎸 QUICK | 改动小、明确、容易撤销 | 找到代码，修改，检查。不用 skill。 |
| 🥁 STANDARD | 真正的 bug，或涉及几个文件 | 最多使用一个针对性的 skill（debugging、TDD） |
| 🎤 DEEP | 数据库 schema、迁移、认证、支付、多个模块、新功能 | 运行你的 pack 的完整 workflow |
| 🎧 CLARIFY | 预期结果不明确 | 最多问两个问题，然后选择通道 |

如果一个 QUICK 改动比预期的大（文件更多、涉及高风险区域、其他地方有测试失败），agent 会停下来重新选择通道。

跳过重型 workflow 时，它会用一行话说明，语气带点个性：

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
```

这种语气只出现在聊天中。代码、commit 和 pull request 保持朴素。如果聊天里也想要朴素的消息，设置 `ROCKSTAR_ROUTER_TONE=sober`。

## 兼容任何 skill pack

没有针对特定 pack 的代码。RockstarRouter 读取你已安装 skill 的描述：
- 做 brainstorming、编写 spec 或计划、或串联其他 skill 的 skill，只在 DEEP 中使用；
- debugging 和 TDD 类 skill 可以在 STANDARD 中使用；
- 无法分类的 skill 一律按 DEEP 处理，因此不会在小请求上运行。

有些 pack 会要求 agent 对每个请求都使用某个 skill。RockstarRouter 能识别这类规则，并在小请求上覆盖它。

已测试的 pack：

| Pack | 会主动启动重型 workflow 吗？ | RockstarRouter 中有专门配置吗 |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | 会，经常 | 有 |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | 有时 | 有 |
| [Spec Kit](https://github.com/github/spec-kit) | 不会 | 没有，使用通用规则 |
| [ECC](https://github.com/affaan-m/ECC) | 不会 | 没有，使用通用规则 |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | 不会 | 没有，使用通用规则 |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | 不会 | 没有，使用通用规则 |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | 不会 | 没有，使用通用规则 |
| [Agent OS](https://github.com/buildermethods/agent-os) | 不会 | 没有，使用通用规则 |

8 个 pack 中有 6 个仅靠通用规则就能处理。

## Benchmark

在一个小型演示 repo 上运行 14 个请求，覆盖全部 8 个 pack，分别在有和没有 RockstarRouter 的情况下测试。Claude Code 2.1.308，Sonnet，headless 模式。原始数据：`bench/results-2026-10-22.json`。

**在更简单的方式就足够时启动了重型 workflow**（颜色、错别字、日志级别、日期格式、小按钮、重复的搜索结果、CSV 导出、测试太慢、两个模糊的请求）：

| Pack | 不使用 | 使用 RockstarRouter |
|---|---|---|
| superpowers（2 轮） | 3 次和 5 次，其中一次是为了改按钮颜色 | 0 |
| BMAD Method | 1：在 CSV 导出上启动了 build workflow，结果卡住，什么也没交付 | 0 |
| 其他 6 个 pack | 0 | 0 |

**在需要时启动了重型 workflow**（重命名数据库列、多币种、把 session 改为 JWT、显式 `/deep`）：

| Pack | 不使用 | 使用 RockstarRouter |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 各 0/4：多币种直接写进 5 到 6 个文件，没有 spec | 各 4/4 |

"需要时启动"指运行了 pack 的完整 workflow，或在大型改动前停下来提问，两者都算。OpenSpec 和 cc-sdd 上的列重命名在 v0.6 中修正了一条规则（"schema 改动一律为 DEEP"）之后，在 4 个 pack 上重测两次，结果 8/8 通过。

简而言之：对 superpowers 和 BMAD，RockstarRouter 防止在小请求上启动重型 workflow。对其他六个 pack，它让 agent 在请求确实需要时使用 pack 的 workflow。

**成本**：小请求上，每个请求额外增加 +3k 到 +57k token（取决于 pack），基线为 110k 到 280k。当 RockstarRouter 把大请求交给完整 workflow 时，这个 workflow 可能非常昂贵（cc-sdd 为了给多币种写 spec 用了 1.2M token）。这部分成本正是 DEEP 的用途所在。

**本 benchmark 的局限**：只有一个模型、一个小 repo，每种配置跑一到两轮。在 headless 模式下，brainstorming skill 会停在第一个问题，所以没有 RockstarRouter 的运行看起来比真实的交互式会话更便宜。在未安装任何 pack 的情况下，跳过提示仍在六轮中出现了一次。

自己运行（需要 git、node、npx、uvx 和 Claude Code）：

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## 安装

**第 1 步：安装 skill（任选一种）**

| Agent | 命令 | 安装内容 |
|---|---|---|
| **Claude Code**（推荐） | `/plugin marketplace add GregoryBabonaux/RockstarRouter`，然后 `/plugin install rockstar-router@rockstar-router` | Skill 和 hooks：会话开始时加载路由规则，提供 `/deep` 和 `/quick` |
| **任意 agent**（Codex、Cursor、Gemini CLI、Copilot、OpenCode…） | `npx skills add GregoryBabonaux/RockstarRouter` | Skill，安装在项目中，或用 `-g` 全局安装 |
| **没有 skills.sh** | `npx rockstar-router-cli skills --yes` | Skill 复制到 `~/.agents/skills` 和 `~/.claude/skills` |

**第 2 步：把路由规则加到你的项目中**

没有 hooks 的 agent 需要在指令文件中加入这条规则。否则，agent 只有在自己决定加载这个 skill 时才会使用 RockstarRouter，而强制运行自身 workflow 的 pack 往往会先执行。

- `npx rockstar-router-cli init` 显示将要写入的内容。在你确认之前不会写入任何东西。
- `npx rockstar-router-cli init --yes` 把规则写入 `AGENTS.md`（如果项目使用 `CLAUDE.md` 或 `GEMINI.md`，也会写入），放在标记之间，不改动文件的其他部分。

使用 Claude Code plugin 时，这一步是可选的：hooks 已经会加载规则。

**第 3 步：检查**

- `npx rockstar-router-cli doctor`

**更新**

| 安装方式 | 更新方法 |
|---|---|
| Claude Code plugin | `claude plugin update rockstar-router@rockstar-router`，或在 `/plugin` 中开启自动更新 |
| skills.sh | `npx skills update`（全局安装用 `npx skills update -g`） |
| npm | `npx rockstar-router-cli@latest update` |

## 用法

无需任何操作：照常向 agent 提出请求即可。如果要强制指定通道，在消息开头加上：
- `/deep` 或 `deep:`：无论改动大小，都运行完整 workflow；
- `/quick` 或 `quick:`：跳过所有 workflow。

没有 Claude Code plugin 时，`deep:` 和 `quick:` 只有在 agent 注意到它们时才会生效。

| 变量 | 取值 | 默认值 |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 已知局限

- 路由是模型根据 prompt 做出的判断，不是硬性规则，有时会判断错误。
- 有些 pack 通过 skill 无法察觉的机制强制运行自己的 workflow。RockstarRouter 会列出它跳过的 skill，方便你发现冲突。
- Benchmark 只在 Claude Code 上用 Sonnet 做过。在 Codex CLI 上，我们确认了 skill 和 `AGENTS.md` 规则会被加载到模型上下文中（`codex debug prompt-input`），但路由行为本身尚未在那里测量。欢迎提供其他 agent 和模型上的结果。

## 许可证

MIT
