# 草案

ブログ記事
[freeeめんどくさくなってきた。](https://haruop.hatenadiary.jp/entry/2022/09/14/041324)

## CSVの読み込み

エポスカード用

csv-parseがいいらしい。オブジェクト形式にできる。
https://qiita.com/b-coffin/items/33948e1d1316215cc8d1

---

## CSVの書き込み

https://blog.katsubemakito.net/nodejs/csv-writer
csv-writerが良さそう。
テンプレを参考にして自前で生成しましょか。

---

## PuppeteerでPaypayカードの利用明細をスクレイピング

スクレイピングデータはオブジェクト形式で取得して、
それを元にfreeeの取引形式のCSVファイルを生成する。

---

必要なNodeパッケージ

- csv-parse
- csv-writer
- puppeteer

---
