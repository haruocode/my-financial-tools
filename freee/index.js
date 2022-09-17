const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs')
const results = [];

// 読み込みたいCSVファイルのパスを設定
const filePath = './epos_csv/all.csv'

const csvWriter = createCsvWriter({
    path: './output_csv/freee.csv',
    header: [
      { id: 'date', title: '日付' },
      { id: 'title', title: '項目' },
      { id: 'price', title: '金額' },
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
