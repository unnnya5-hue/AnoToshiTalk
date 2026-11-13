# あの年トーク

懐かしい流行や出来事から会話を始める、iPhone向け話題アプリです。

## 公開サイト

- [公式サイト](https://unnnya5-hue.github.io/AnoToshiTalk/)
- [サポート](https://unnnya5-hue.github.io/AnoToshiTalk/support/)
- [プライバシーポリシー](https://unnnya5-hue.github.io/AnoToshiTalk/privacy/)
- [利用規約](https://unnnya5-hue.github.io/AnoToshiTalk/terms/)

公開サイトのソースは [`site/`](site/) にあります。公開内容は `gh-pages` ブランチからGitHub Pagesへ配信されます。

## iOSアプリ

- 対応: iPhone / iOS 18以降
- UI: SwiftUI
- ローカルデータ: SwiftData、同梱JSON
- 広告: Google Mobile Ads / User Messaging Platform

XcodeGenを利用しています。プロジェクト設定を変更した場合は、次のコマンドでXcodeプロジェクトを再生成します。

```sh
xcodegen generate
```

