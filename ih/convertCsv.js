const csv = require('csvtojson');
const fs = require('fs');
const csvFilePath = './ih/data/sameCodes.csv';
const _ = require('lodash');

function saveJson(o, name) {
  fs.writeFile("./tmp/" + name, JSON.stringify(o, null, 2), function (err) {

    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    _.forEach(jsonObj, x => x.occurrences = Number.parseInt(x.occurrences))
    console.log(jsonObj);
    saveJson(jsonObj, 'sameCodes.json');
  });