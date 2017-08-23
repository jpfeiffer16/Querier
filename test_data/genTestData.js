//Note, we could add a param for number of tables too
const fs = require('fs');
const path = require('path');

let numberOfRows = process.argv[2];
let numberOfColumns = process.argv[3];
// [
//   {
//     columns: [
//       {
//         name: 'Test1'
//       },
//       {
//         name: 'Test2'
//       },
//       {
//         name: 'Test2'
//       }
//     ],
//     rows: [
//         [
//           {
//             value: 'Test1',
//             active: false
//           },
//           {
//             value: 'Test1',
//             active: false
//           },
//           {
//             value: 'Test1',
//             active: false
//           },
//         ]
//     ]
//   }
// ]
function writeData() {
  let testData = [
    {
      columns: [],
      rows: []
    }
  ]
  
  for (let i = 1; i <= numberOfColumns; i++) {
    testData[0].columns.push({
      name: `Test${i}`
    });
  }
  for (let i = 1; i <= numberOfRows; i++) {
    let row = [];
    for (let j = 1; j <= numberOfColumns; j++) {
      row.push({
        value: `Test${ j }`,
        active: false
      });
    }
    testData[0].rows.push(row);
  }
  
  fs.writeFileSync(
    path.join(
      __dirname,
      'testdata.json'
    ),
    JSON.stringify(testData)
  );
}

console.log(
  `Generating ${ numberOfColumns } x ${ numberOfRows } test data table.`
);
writeData();
console.log('Done. Test data at test_data/testdata.json');