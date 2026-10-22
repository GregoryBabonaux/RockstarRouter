<p align="center">
  <img src="assets/rock-hand.png" alt="メタルホーンを掲げる骸骨の手" width="180">
  <br>
  <sub>イラスト: <a href="https://www.magnific.com/free-photos-vectors/metal-fingers">Magnific</a></sub>
</p>

# 🎸 RockstarRouter

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [简体中文](README.zh-CN.md) · **日本語** · [한국어](README.ko.md)

**ボタンの色を変えるだけなのに、ドーム公演を組もうとする agent を止めます。**

skill pack を入れた。名曲ぞろい、最高のバンド。ところが typo を直してと頼んだ瞬間、ドラマーがカウントを入れて 45 分のプログレ大作が始まる: brainstorming、spec、plan、tasks、review。最初のコードが鳴る前に、あなたの token はもう会場を後にしています。

RockstarRouter はステージマネージャーです。リクエストを最初に聞いて、セットリストを決めます: 2 分で終わるパンクの一曲か、フルセットのドーム公演か。

## 🎚️ セットリスト

| Lane | いつ | 何が起きるか |
|---|---|---|
| 🎸 QUICK | 小さい、明確、元に戻せる | 探して、直して、確認。skill なし、儀式なし。 |
| 🥁 STANDARD | ちゃんとしたバグ、または数ファイル | 絞り込んだ skill を最大ひとつ (debugging、TDD) |
| 🎤 DEEP | schema、migration、auth、決済、モジュール横断、新機能 | pack のフル workflow、特効 (パイロ) 込み |
| 🎧 CLARIFY | 「完成」がどんな姿か誰もわかってない | 質問は最大ふたつ、すぐステージに戻る |

重火器を取り上げることはありません。リクエストがそれに値すると判断した瞬間、RockstarRouter は pack 自身の workflow にマイクを渡します。そして QUICK のはずが膨らみ始めたら (ファイルが増える、危険ゾーンに触れる、別の場所でテストが落ちる)、演奏を止めてルートを切り替えます。

やりすぎを止めたときは、ちゃんと報告します:

```
🎸 superpowers:brainstorming wanted a full set-list meeting for one button. I just plugged in and played.
🎸 BMAD had a whole build pipeline warmed up for one button. Left it in the green room.
🎸 ecc:orch-add-feature was ready to run a full research-plan-TDD-review set for one button. I sent it home.
```

ロックな態度はチャットの中だけ。コード、commit、PR は真面目なまま。物静かなローディーがお好みなら `ROCKSTAR_ROUTER_TONE=sober`。

## 🤘 どんなバンドとも演れる

pack 専用のコードはゼロ。RockstarRouter はインストール済みの skill を読み、その description から分類します: brainstorm、spec、plan をするもの、または他の skill を連鎖させるものは DEEP 専任。debugging と TDD は STANDARD。読めないものは DEEP 扱いで、QUICK の出番は絶対に回ってきません。

あらゆるリクエストに自分の workflow を押しつける pack (「1% でも可能性があるなら skill を呼び出さなければならない (MUST)」系) は見抜かれて、QUICK なリクエストでは却下されます。

ステージでの実戦テスト済み:

| Pack | 勝手に重い workflow を発動する? | RockstarRouter 内のプロファイル |
|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | する、しょっちゅう | あり |
| [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) | ときどき | あり |
| [Spec Kit](https://github.com/github/spec-kit) | しない | なし、汎用ルール |
| [ECC](https://github.com/affaan-m/ECC) | しない | なし、汎用ルール |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | しない | なし、汎用ルール |
| [cc-sdd](https://github.com/gotalab/cc-sdd) | しない | なし、汎用ルール |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | しない | なし、汎用ルール |
| [Agent OS](https://github.com/buildermethods/agent-os) | しない | なし、汎用ルール |

8 つの pack のうち 6 つは汎用ルールだけで回しました。本当の試験はそこです。

## 📊 数字

小さなデモ repo で 14 リクエスト、8 pack、それぞれ RockstarRouter あり・なしで実行。Claude Code 2.1.308、Sonnet、headless。生データは `bench/results-2026-10-22.json`。

**軽いルートで十分なのに重い workflow が発動した回数** (色、typo、ログレベル、日付フォーマット、小さなボタン、検索結果の重複、CSV エクスポート、遅いテスト、曖昧なリクエスト 2 件):

| Pack | なし | RockstarRouter あり |
|---|---|---|
| superpowers (2 runs) | 3 回と 5 回、うち 1 回はボタンの色 | 0 |
| BMAD Method | 1 回、CSV エクスポートに build workflow、詰まって何も出荷されず | 0 |
| 残りの 6 pack | 0 | 0 |

**重い workflow が必要なときに発動したか** (DB カラムのリネーム、多通貨対応、セッションから JWT へ、明示的な `/deep`):

| Pack | なし | RockstarRouter あり |
|---|---|---|
| superpowers | 2/4 | 4/4 |
| BMAD Method | 2/4 | 4/4 |
| Spec Kit, ECC, OpenSpec, cc-sdd, Compound Engineering, Agent OS | 各 0/4: 多通貨対応を spec なしで 5 から 6 ファイルに直書き | 各 4/4 |

「必要なとき」には、pack のフル workflow か、大きな変更の前に止まって確認したケースをカウントしています。OpenSpec と cc-sdd でのカラムのリネームは v0.6 でルール修正が必要でした (「schema は常に DEEP」)。4 pack で 2 回ずつ再テストして 8/8。

ふたつ目の表がこのツアー最大のサプライズ。ほとんどの pack は、曲がそれを求めているときでさえ自分の重い楽器を手に取りません。RockstarRouter が代わりに持たせてあげます。

**コスト**: ささいなリクエストでは、pack によって 1 リクエストあたり +3k から +57k token、ベースラインの 110k から 280k に上乗せ。RockstarRouter が大きなリクエストをフル workflow に回すと、その workflow 自体は高くつくことがあります (cc-sdd は多通貨対応の spec 作りに 1.2M token 使いました)。それはあなたが頼んだドーム公演です。

**注意書き**: モデルひとつ、小さな repo ひとつ、構成ごとに 1、2 回の実行。headless モードでは brainstorming skill が最初の質問で止まるので、「なし」の実行は実際の対話セッションより安く見えます。pack を何も入れていない状態でも、6 回中 1 回はアンコールの一言が漏れ出ました。

自分で再演してみる (git、node、npx、uvx と Claude Code が必要):

```
cd bench && ./setup.sh
for id in $(seq 1 14); do for cfg in sp sprr bmad bmadrr spk spkrr ecc eccrr osp osprr ccsdd ccsddrr ce cerr aos aosrr; do ./run.sh $cfg $id; done; done
node parse.js runs && node score.js results.json
```

## 🎫 バックステージパス

**ステップ 1: skill を手に入れる (どれかひとつ)**

| Agent | コマンド | 手に入るもの |
|---|---|---|
| **Claude Code** (おすすめ) | `/plugin marketplace add GregoryBabonaux/RockstarRouter`、続けて `/plugin install rockstar-router@rockstar-router` | skill と hook: セッション開始時にルーティングルールがステージに上がり、`/deep` と `/quick` も使える |
| **どの agent でも** (Codex、Cursor、Gemini CLI、Copilot、OpenCode…) | `npx skills add GregoryBabonaux/RockstarRouter` | skill、プロジェクト内に、または `-g` でグローバルに |
| **skills.sh なし** | `npx rockstar-router-cli skills --yes` | skill を `~/.agents/skills` と `~/.claude/skills` にコピー |

**ステップ 2: ルーティングルールをプロジェクトに置く**

hook のない agent では、ルールを指示ファイルに書いておく必要があります。そうしないと、router は agent の気が向いたときしか演奏しないし、自分の workflow を押しつける pack がたいてい先にマイクを奪ってしまいます。

- `npx rockstar-router-cli init` は何を書き込むかを見せてくれます。確認するまで何も書き込みません。
- `npx rockstar-router-cli init --yes` はルールを `AGENTS.md` に (プロジェクトで使っていれば `CLAUDE.md` や `GEMINI.md` にも) マーカーの間に書き込み、ファイルの残りには一切触れません。

Claude Code plugin を使っているなら、このステップは任意です: hook がすでにルールをステージに上げています。

**ステップ 3: サウンドチェック**

- `npx rockstar-router-cli doctor`

**アップデート**

| インストール方法 | アップデート |
|---|---|
| Claude Code plugin | `claude plugin update rockstar-router@rockstar-router`、または `/plugin` で自動アップデートをオン |
| skills.sh | `npx skills update` (グローバルなら `npx skills update -g`) |
| npm | `npx rockstar-router-cli@latest update` |

## 🎛️ コントロール

普通に頼むだけ。上書きしたいときは:
- メッセージの先頭に `/deep` または `deep:`: サイズに関係なくフル workflow;
- `/quick` または `quick:`: workflow なし、いきなりリフへ。

Claude Code plugin がない環境では、`deep:` と `quick:` は agent が気づいてくれるかどうか次第です。

| 変数 | 値 | デフォルト |
|---|---|---|
| `ROCKSTAR_ROUTER_TONE` | `rock`, `sober` | `rock` |

## 🩹 既知の制限

- ルーティングは prompt に導かれたモデルの判断であって、ハードなゲートではありません。ときどき判断を誤ります。
- skill からは見えない仕組みで workflow を強制する pack もあります。router はスキップしたものを名指しするので、衝突に気づけます。
- ベンチマークは Claude Code + Sonnet のみ。Codex CLI では skill と `AGENTS.md` のルールがモデルのコンテキストに読み込まれることを確認済み（`codex debug prompt-input`）ですが、ルーティングの挙動そのものはまだ測っていません。他の agent やモデルでの結果、大歓迎です。

## License

MIT。ボリュームを上げろ。
