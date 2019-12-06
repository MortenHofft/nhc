const institutions = require('./tmp/normalized.json');
const _ = require('lodash');
const fs = require('fs');

function saveJson(o, name) {
  fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {

    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}

console.log(institutions
  .filter(x => !x.institutioncode && !x.institutionid)
  .filter(x => x.publishingorgkey !== 'ab733144-7043-4e88-bd4f-fca7bf858880')
  .filter(x => x.occurrences > 100000).map(x => x.datasetTitle));

  saveJson(institutions.filter(x => x.institutioncode || x.institutionid), './occurrences/tmp/codeOnly.json');