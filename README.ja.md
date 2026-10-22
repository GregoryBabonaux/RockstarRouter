<p align="center">
  <img src="assets/rock-hand.png" alt="メタルのホーンサインを掲げる骸骨の手" width="180">
  <br>
  <sub>イラスト: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · **日本語** · [한국어](README.ko.md)

**ボタンの色を変えるだけなのに、コーディングエージェントがスタジアムツアーを組み始めるのを止めます。**

RockstarRouter は、コーディングエージェント（Claude Code、Codex、Cursor など）向けの skill です。ほかの skill が動く前に、そのリクエストにどれだけのプロセスが必要かを判断します。

## 課題

superpowers や BMAD のような skill pack は、エージェントに重い workflow を追加します。ブレインストーミング、spec、計画、タスクリスト、review などです。本格的な機能開発には役立ちます。しかし pack によっては、typo の修正や色の変更を含め、どんなリクエストでもこの workflow を始めてしまいます。1 行の変更のために待たされ、token も消費します。

逆の問題を抱える pack もあります。大きな変更やリスクの高い変更であっても、自分から呼び出さない限り、workflow をまったく始めません。

## RockstarRouter がすること

リクエストを読み、次の 4 つのレーンから 1 つを選びます。

| レーン | 条件 | エージェントの動き |
|---|---|---|
| 🎸 QUICK | 小さく、明確で、元に戻しやすい | コードを見つけて変更し、確認する。skill は使わない。 |
| 🥁 STANDARD | 本物のバグ、または数ファイルの変更 | 目的に合った skill を最大 1 つ使う（debugging、TDD） |
| 🎤 DEEP | データベーススキーマ、マイグレーション、認証、決済、複数モジュール、新機能 | pack の完全な workflow を実行する |
| 🎧 CLARIFY | 期待される結果がはっきりしない | 質問は最大 2 つまで。その後レーンを選ぶ |

QUICK のはずの変更が想定より大きいと分かった場合（ファイルが増える、リスクの高い領域に触れる、別の場所でテストが失敗する）、エージェントは作業を止めてレーンを選び直します。

重い workflow をスキップしたときは、少し気の利いた一言でそのことを伝えます。

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
```

この口調はチャットの中だけです。コード、commit、pull request は普通の文面のままです。チャットのメッセージも普通の文面にしたい場合は `ROCKSTAR_ROUTER_TONE=sober` を設定してください。

## どの skill pack でも動作

pack 専用のコードはありません。RockstarRouter はインストール済みの skill の説明文を読み取ります。
- ブレインストーミング、spec や計画の作成、ほかの skill の連鎖実行を行う skill は DEEP でのみ使います。
- debugging や TDD の skill は STANDARD で使えます。
- 分類できない skill は DEEP として扱うので、小さなリクエストで動くことはありません。

pack によっては、すべてのリクエストで特定の skill を使うようエージェントに指示しています。RockstarRouter はこの種のルールを検出し、小さなリクエストではそれを上書きします。

次の pack でテストしています。

| Pack | 自分から重い workflow を始めるか | RockstarRouter 内の専用プロファイル |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | はい、頻繁に | あり |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | ときどき | あり |
| [Spec Kit](https://github.com/github/spec-kit) | いいえ | なし、汎用ルール |
| [ECC](https://github.com/affaan-m/ECC) | いいえ | なし、汎用ルール |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | いいえ | なし、汎用ルール |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | いいえ | なし、汎用ルール |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | いいえ | なし、汎用ルール |
| [Agent OS](https://github.com/buildermethods/agent-os) | いいえ | なし、汎用ルール |

8 つの pack のうち 6 つは、汎用ルールだけで対応できました。

## ベンチマーク

小さなデモ repo で 14 件のリクエストを、8 つの pack それぞれについて RockstarRouter あり・なしで実行しました。Claude Code 2.1.308、Sonnet、headless モード。生データ: `bench/results-2026-10-22.json`。

**もっと簡単な方法で十分なのに重い workflow が始まった回数**（色、typo、ログレベル、日付フォーマット、小さなボタン、検索結果の重複、CSV エクスポート、遅いテスト、あいまいなリクエスト 2 件）:

| Pack | なし | RockstarRouter あり |
|---|---|---|
| superpowers（2 回実行） | 3 回と 5 回、うち 1 回はボタンの色 | 0 |
| BMAD Method | 1: CSV エクスポートで build workflow が始まり、途中で止まって何も納品されなかった | 0 |
| ほかの 6 pack | 0 | 0 |

**必要なときに重い workflow が始まった回数**（データベースのカラム名変更、多通貨対応、セッションから JWT への移行、明示的な `/deep`）:

| Pack | なし | RockstarRouter あり |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | それぞれ 0/4: 多通貨対応を spec なしで 5〜6 ファイルに直接実装 | それぞれ 4/4 |

「必要なとき」には、pack の完全な workflow の実行と、大きな変更の前に止まって確認することの両方を含めています。OpenSpec と cc-sdd でのカラム名変更は、v0.6 でルールの修正（「スキーマ変更は常に DEEP」）が必要でした。修正後、4 つの pack で 2 回ずつ再テストし、8/8 で合格しました。

まとめると、superpowers と BMAD では、RockstarRouter は小さなリクエストで重い workflow が始まるのを防ぎます。ほかの 6 pack では、本当に必要なリクエストで pack の workflow を使わせます。

**コスト**: 小さなリクエストでは、pack によって 1 リクエストあたり +3k から +57k token が、110k から 280k のベースラインに上乗せされます。RockstarRouter が大きなリクエストを完全な workflow に回すと、その workflow のコストは大きくなることがあります（cc-sdd は多通貨対応の spec 作成に 1.2M token を使いました）。そのコストこそが DEEP の目的です。

**このベンチマークの限界**: モデルは 1 つ、repo は小さなもの 1 つ、各構成の実行は 1〜2 回です。headless モードではブレインストーミングの skill が最初の質問で止まるため、RockstarRouter なしの実行は、実際の対話セッションよりも安く見えます。pack を何もインストールしていない状態でも、6 回中 1 回はスキップのメッセージが表示されました。

自分で実行するには（git、node、npx、uvx、Claude Code が必要）:

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## インストール

**ステップ 1: skill をインストールする（いずれか 1 つ）**

| エージェント | コマンド | 得られるもの |
|---|---|---|
| **Claude Code**（推奨） | `/plugin marketplace add GregoryBabonaux/RockstarRouter` を実行し、続けて `/plugin install rockstar-router@rockstar-router` | skill と hook: セッション開始時にルーティングルールを読み込み、`/deep` と `/quick` が使える |
| **任意のエージェント**（Codex、Cursor、Gemini CLI、Copilot、OpenCode…） | `npx skills add GregoryBabonaux/RockstarRouter` | skill をプロジェクト内に、または `-g` でグローバルにインストール |
| **skills.sh なし** | `npx rockstar-router-cli skills --yes` | skill を `~/.agents/skills` と `~/.claude/skills` にコピー |

**ステップ 2: プロジェクトにルーティングルールを追加する**

hook を持たないエージェントでは、指示ファイルにルールを書いておく必要があります。ルールがないと、エージェントが RockstarRouter を使うのは skill を読み込むと自分で判断したときだけになり、独自の workflow を強制する pack が先に動いてしまうことがよくあります。

- `npx rockstar-router-cli init` は書き込む内容を表示します。確認するまで何も書き込みません。
- `npx rockstar-router-cli init --yes` はルールを `AGENTS.md`（プロジェクトで使っていれば `CLAUDE.md` や `GEMINI.md` にも）のマーカーの間に書き込みます。ファイルのほかの部分には手を加えません。

Claude Code の plugin を使う場合、このステップは任意です。hook がすでにルールを読み込みます。

**ステップ 3: 確認する**

- `npx rockstar-router-cli doctor`

**アップデート**

| インストール方法 | アップデート |
|---|---|
| Claude Code plugin | `claude plugin update rockstar-router@rockstar-router`、または `/plugin` で自動アップデートを有効にする |
| skills.sh | `npx skills update`（グローバルの場合は `npx skills update -g`） |
| npm | `npx rockstar-router-cli@latest update` |

## 使い方

特別な操作は不要です。いつもどおりエージェントに依頼してください。レーンを指定したい場合は、メッセージの先頭に次のいずれかを付けます。
- `/deep` または `deep:`: 変更の大きさに関係なく、完全な workflow を実行します。
- `/quick` または `quick:`: workflow をすべてスキップします。

Claude Code の plugin がない場合、`deep:` と `quick:` はエージェントがそれに気づいたときにしか効きません。

| 変数 | 値 | デフォルト |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 既知の制限

- ルーティングは prompt をもとにモデルが下す判断であり、厳密なルールではありません。ときどき間違えます。
- pack によっては、skill からは見えない仕組みで workflow を強制しているものがあります。RockstarRouter はスキップした skill の名前を示すので、衝突に気づけます。
- ベンチマークは Claude Code と Sonnet の組み合わせでしか取っていません。Codex CLI では、skill と `AGENTS.md` のルールがモデルのコンテキストに読み込まれることは確認しました（`codex debug prompt-input`）が、ルーティングの挙動そのものはまだ計測していません。ほかのエージェントやモデルでの結果を歓迎します。

## ライセンス

MIT
