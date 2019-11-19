const grbio = require('../data/grbioNormalized.json');
const ih = require('../data/ihPerfectMatches.json');
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
function veryGoodMatches() {
  // get all
  let matchedKeys = [];
  let matchedNames = [];
  ih.forEach(r => {
    let codes = r._codeMatches || [];
    if (codes) {
      let titles = r._fuzzyMatchPerfect || [];
      let countries = r._countryMatches || [];
      let intersection = _.intersection(codes, titles, countries);
      if (intersection.length === 1) {
        let grbioRecord = lookups.grbioMap[intersection[0]];
        if (grbioRecord.indexHerbariorumRecord) {
          if (r._grbioEquivalent) {
            throw Error('no double matching grbio entries');
          }
          matchedKeys.push(grbioRecord.key);
          matchedNames.push(grbioRecord.name);
          r._grbioEquivalent = grbioRecord.key;

          console.log(grbioRecord.key);
          console.log(r.irn);
          console.log(grbioRecord.name);
          console.log(r.organization);
          console.log();
        }
      }
    }
  });

  helper.ensureUnique(ih);

  saveJson(ih, './ih/data/ihVeryGoodMatches.json');
  console.log(matchedNames);
}
veryGoodMatches();