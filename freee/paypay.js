// PaypayカードのスクレイピングとCSV書き出し

// まずはスクレイピング処理
const puppeteer = require('puppeteer');

const scrapePaypay = async () => {
  // 既存のChromeを使う
  // ターミナルで以下のコマンドを実行する
  // $ /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
  const wsChromeEndpointUrl = 'ws://127.0.0.1:9222/devtools/browser/996f239c-ebb6-41bf-b66b-b4126ba9445b'
  const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointUrl,
      defaultViewport: null,
      slowMo: 500
  });
  const page = await browser.newPage();

  /**
   * 操作手順
   *
   * - アクセス(https://www.paypay-card.co.jp/member/statement/monthly?targetYm=202210&showSts=0)
   * - 2022年1月から8月まで順番にアクセスする
   * - 項目名と日付と金額をDOM操作で取得する
   * - 翌月にアクセスする
   * - 上記を繰り返す
   * - 全てのデータが入ったオブジェクト要素の配列を元にfreee形式のCSVを書き出す
   *
   * 以上
   */

  // 月別明細画面のURL
  const url = "https://www.paypay-card.co.jp/member/statement/monthly"

  // スクレイピングする対象の年月
  const targetYmList = [
    // "202201", // ※2021年分のため対象外
    // "202202", // ※ネットキャッシングのみのため対象外
    // "202203", // ※インポート済み
    "202204",
    // "202205",
    // "202206",
    // "202207",
    // "202208",
    // "202209", // ※利用明細がない
  ]

  // データ格納用配列
  let paypayments = []

  // ループ処理
  for(let targetYm of targetYmList) {

    // console.log(convertDateFormat("2022年11月12日"))

    // 画面にアクセス
    await page.goto(`${url}?targetYm=${targetYm}`);

    // DOM操作で項目名、日付、金額の一覧を取得
    await page.waitForSelector('.index_ListSettlement_NIWTA', {visible: true})

    // 明細一覧の項目、日付、金額を取得する
    const dataList = await page.$$eval('.index_ListSettlement__listItem_PrfnU', (items) => {
      const convertDateFormat = (jpDate) => {
        let str = jpDate.replace("年", "/")
        str = str.replace("月", "/")
        str = str.replace("日", "")
        return str
      }
      return items.map((item) => {
        const title = item.querySelector('.index_ListSettlement__labelMain_20cjQ').innerHTML
        const jpDate = item.querySelector('.index_ListSettlement__date_1jxtk').innerHTML
        const priceBox = item.querySelector('.index_ListSettlement__summary_eJl4_')
        const price = priceBox.querySelector('span').innerHTML
        return {
          title: title && title.trim(),
          date: jpDate && convertDateFormat(jpDate.trim()),
          price: price && Number(price.trim().replace(",", "")),
        }
      })
    })

    paypayments = paypayments.concat(dataList)

  }
  return paypayments
  // await browser.close();
}

(async () => {

  // CSV書き出し処理
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;

  const freeeHeaders = [
    { id: 'class', title: '収支区分' }, // 支出(必須)
    { id: '', title: '管理番号' }, // 空欄
    { id: 'date', title: '発生日' }, // YYYY/MM/DD形式(必須)
    { id: '', title: '決済期日' }, // 空欄
    { id: '', title: '取引先コード' }, // 空欄
    { id: '', title: '取引先' }, // 空欄
    { id: 'account', title: '勘定科目' }, // 場合による(必須)
    { id: 'taxClass', title: '税区分' }, // 要確認(課対仕入10%？)(必須)
    { id: 'price', title: '金額' }, // いわずもがな(必須)
    { id: 'taxCalcClass', title: '税計算区分' }, // 「税込」
    { id: '', title: '税額' }, // 空欄
    { id: 'title', title: '備考' }, // titleを入れておく
    { id: '', title: '品目' }, // 手動で設定した方がいいかも
    { id: '', title: '部門' }, // 空欄
    { id: '', title: 'メモタグ（複数指定可、カンマ区切り）' }, // 空欄
    { id: '', title: 'セグメント1' }, // 空欄
    { id: '', title: 'セグメント2' }, // 空欄
    { id: '', title: 'セグメント3' }, // 空欄
    { id: 'date', title: '決済日' }, // YYYY/MM/DD形式(決済済み必須)
    { id: 'paymentAccount', title: '決済口座' }, // freeeに登録されている口座を入力します(決済済み必須)
    { id: 'price', title: '決済金額' }, // (決済済み必須)
  ]

  const csvWriter = createCsvWriter({
      path: './output_csv/freee.csv',
      header: freeeHeaders,
    }
  )

  let paypayments = await scrapePaypay()

  // スクレイピングで取得したデータをfreeeの形式にアサインする
  paypayments = paypayments.map((p) => ({
    ...p,
    class: "支出",
    account: "雑収入",
    taxClass: "課対仕入10%",
    taxCalcClass: "税込",
    paymentAccount: "ＰａｙＰａｙカード",
  }))

  // 書き込み
  csvWriter.writeRecords(paypayments)
  .then(() => {
    console.log('done');
  })

  // dateの値が日付形式かチェック
  const checkIfDateFormat = (str) => {
      const regex = new RegExp('[1-9][0-9]{3}.+[0-9]{1,2}.+[0-9]{1,2}')
      return regex.test(str)
  }
})();
