const csv = require('csv-parser')
const fs = require('fs')
const results = [];

// 読み込みたいCSVファイルのパスを設定
const filePath = './epos_csv/all.csv'

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
        price: data.price,
      })
  })
  .on('end', () => {
    console.log(results)
    // console.log(results.map(row => {
    //     return {
    //         date: row.date,
    //         title: row.title,
    //         price: Number(row.price),
    //     }
    // }));
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });

// dateの値が日付形式かチェック
const checkIfDateFormat = (str) => {
    const regex = new RegExp('[1-9][0-9]{3}.+[0-9]{1,2}.+[0-9]{1,2}')
    return regex.test(str)
}
