const grbio = require('../data/grbioNormalized.json');
const ih = require('../data/ihFuzzyCandidates.json');
const _ = require('lodash');
const fs = require('fs');
const lookups = require('../getLookups');
const helper = require('../helper');

function saveJson(o, name) {
  fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

// matches that align perfectly with country, title, code and is already marked as a IH record in grbio: 3101 matches
function perfectMatches() {
  // get all
  let matchedKeys = [];
  let matchedNames = [];
  ih.forEach(r => {
    let codes = r._codeMatches || [];
    if (codes) {
      let titles = r._titleMatches || [];
      let countries = r._countryMatches || [];
      let intersection = _.intersection(codes, titles, countries);
      if (intersection.length === 1) {
        let grbioRecord = lookups.grbioMap[intersection[0]];
        if (grbioRecord.indexHerbariorumRecord) {
          matchedKeys.push(grbioRecord.key);
          matchedNames.push(grbioRecord.name);
          r._grbioEquivalent = grbioRecord.key;
        }
      }
    }
  });

  helper.ensureUnique(ih);
  saveJson(ih, './ih/data/ihPerfectMatches.json');
}
perfectMatches();