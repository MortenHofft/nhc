const grbio = require('./data/grbioNormalized.json.js');
const ih = require('./data/ihGoodSecondRoundMatches.json.js');
const _ = require('lodash');
const fs = require('fs');
const lookups = require('../getLookups');

function saveJson(o, name) {
  fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

function getAsLookup(collection, entryKey) {
  let m = {};
  collection.forEach(x => {
    if (!x[entryKey]) return;
    if (m[x[entryKey]]) {
      throw Error('grbio entry used twice');
    }
    m[x[entryKey]] = x.irn;
  });
  return m;
}
let grbioMatchLookup = getAsLookup(ih, '_grbioEquivalent');

console.log(Object.keys(grbioMatchLookup).length);
// matches that align perfectly with country, title, code and is already marked as a IH record in grbio: 3101 matches
function goodMatches() {
  // get all
  let matchedKeys = [];
  let matchedNames = [];
  ih.forEach(r => {
    if (r._grbioEquivalent) {
      return;
    }
    let codes = r._codeMatches || [];
    if (codes) {
      let titles = r._fuzzyMatchWeak || [];
      let countries = r._countryMatches || [];
      let intersection = _.intersection(codes, countries);
      if (intersection.length === 1) {
        let grbioRecord = lookups.grbioMap[intersection[0]];
        if (grbioRecord.indexHerbariorumRecord) {
          if (grbioMatchLookup[grbioRecord.key]) {
            console.log('this grbio record is already matched to irn', grbioMatchLookup[grbioRecord.key]);
          }
          matchedKeys.push(grbioRecord.key);
          matchedNames.push(grbioRecord.name);
          r._grbioEquivalent = grbioRecord.key;

          console.log(grbioRecord.key);
          console.log(r.irn);
          console.log(grbioRecord.name);
          console.log(r.organization);
          if (grbioRecord.additionalNames) {
            console.log(grbioRecord.additionalNames);
          }
          if (codes > 1) {
            console.log('more than one matching code');
          }
          console.log();
        }

        // matchedKeys.push(grbioRecord.key);
        // matchedNames.push(grbioRecord.name);
        // r._grbioEquivalent = grbioRecord.key;

        // console.log(grbioRecord.key);
        // console.log(r.irn);
        // console.log(grbioRecord.name);
        // console.log(r.organization);
        // console.log();
      }
    }
  });

  console.log('has duplicates (a grbio record is referenced twice)', _.uniq(matchedKeys).length !== matchedKeys.length);
  // saveJson(ih, './ih/data/ihGoodSecondRoundMatches.json');
  // console.log(matchedNames);
}
goodMatches();