const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs')
const results = [];

// 読み込みたいCSVファイルのパスを設定
const filePath = './epos_csv/all.csv'

const csvWriter = createCsvWriter({
    path: './output_csv/freee.csv',
    header: [
      { id: '', title: '収支区分' }, // 支出(必須)
      { id: '', title: '管理番号' }, // 空欄
      { id: 'date', title: '発生日' }, // YYYY/MM/DD形式(必須)
      { id: '', title: '決済期日' }, // 空欄
      { id: '', title: '取引先コード' }, // 空欄
      { id: '', title: '取引先' }, // 空欄
      { id: '', title: '勘定科目' }, // 場合による(必須)
      { id: '', title: '税区分' }, // 要確認(課対仕入10%？)(必須)
      { id: 'price', title: '金額' }, // いわずもがな(必須)
      { id: '', title: '税計算区分' }, // 「税込」
      { id: '', title: '税額' }, // 要確認(空欄で良い？)
      { id: 'title', title: '備考' }, // titleを入れておく
      { id: '', title: '品目' }, // 手動で設定した方がいいかも
      { id: '', title: '部門' }, // 空欄
      { id: '', title: 'メモタグ（複数指定可、カンマ区切り）' },
      { id: '', title: 'セグメント1' }, // 空欄
      { id: '', title: 'セグメント2' }, // 空欄
      { id: '', title: 'セグメント3' }, // 空欄
      { id: 'date', title: '決済日' }, // YYYY/MM/DD形式(決済済み必須)
      { id: '', title: '決済口座' }, // freeeに登録されている口座を入力します(決済済み必須)
      { id: 'price', title: '決済金額' }, // (決済済み必須)
    ],
  });

fs.createReadStream(filePath)
  .pipe(csv({
    headers: ['type', 'date', 'title', '', 'price', 'paymentType', '', ''],
    mapHeaders: ({header, index}) => console.log(header)
  }))
  .on('data', (data) => {
    if(data.date && checkIfDateFormat(data.date))
      results.push({
        date: data.date,
        title: data.title,
        price: Number(data.price),
      })
  })
  .on('end', () => {
    // console.log(results)
    // 書き込み
    csvWriter.writeRecords(results)
    .then(() => {
      console.log('done');
    });
  });

// dateの値が日付形式かチェック
const checkIfDateFormat = (str) => {
    const regex = new RegExp('[1-9][0-9]{3}.+[0-9]{1,2}.+[0-9]{1,2}')
    return regex.test(str)
}
