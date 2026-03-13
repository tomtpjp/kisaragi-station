# きさらぎ駅 (GitHub Pages + 定時自動更新)

このサイトは GitHub Pages で公開し、GitHub Actions の定時実行で `index.html` を自動更新する構成です。

## 1. GitHub リポジトリ作成

GitHub 上で新規リポジトリを作成してください（例: `kisaragi-station`）。

## 2. ローカルから初回Push

このフォルダで実行:

```bash
git add .
git commit -m "feat: initial kisaragi station site"
git branch -M main
git remote add origin https://github.com/<YOUR_ACCOUNT>/<YOUR_REPO>.git
git push -u origin main
```

## 3. GitHub Pages 設定

GitHub リポジトリの `Settings` -> `Pages` で:

- Build and deployment: `GitHub Actions`

## 4. 自動更新ワークフロー

ファイル: `.github/workflows/pages-scheduled-update.yml`

- 毎日 `00:00 JST`（`15:00 UTC`）に実行
- `scripts/daily-update.js` が `index.html` のお知らせと上部ヒーロー画像を更新
- 上部ヒーロー画像は `assets/generated-hero.svg` を毎日ランダム生成
- 変更があれば自動コミットしてPush
- そのまま GitHub Pages へ再デプロイ

## 5. 手動実行

GitHub の `Actions` タブから `Scheduled Site Update and Deploy` を選び、`Run workflow` で即時実行できます。

## 6. 更新内容を変える

更新文言は `scripts/daily-update.js` の `notices` 配列を編集してください。

上部画像の生成ルールは `scripts/daily-update.js` の `generateHeroSvg` を編集してください。

## 補足

- 時刻は JST 固定で記録されます。
- 自動更新対象は `index.html` の以下マーカー範囲です。
  - `<!-- AUTO_HERO_START -->`
  - `<!-- AUTO_HERO_END -->`
  - `<!-- AUTO_NOTICE_START -->`
  - `<!-- AUTO_NOTICE_END -->`

- 生成画像ファイル:
  - `assets/generated-hero.svg`
