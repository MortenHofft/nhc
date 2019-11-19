const grbio = require('./data/grbioNormalized.json');
const ih = require('./data/ihNormalized.json');
const _ = require('lodash');
const fs = require('fs');
const lookups = require('./getLookups');
const levenshtein = require('fast-levenshtein');

function saveJson(o, name) {
  fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

// run through all IH records and attach grbio candidates
ih.forEach(r => {
  r._codeMatches = lookups.grbioCodeLookup[r.code];
  r._titleMatches = lookups.grbioTitleLookup[r.organization];
  r._countryMatches = lookups.grbioCountryLookup[r._country];
  r._cityMatches = lookups.grbioCityLookup[r._city];
  r._countryCityMatches = _.intersection(lookups.grbioCountryLookup[r._country], lookups.grbioCityLookup[r._city]);
});

// fuzzy name matches
ih.forEach(r => {
  if (r._titleMatches) return; // do not bother looking for a fuzzy match if we already have a perfect title match
  let ihName = r._strippedAndNormalized;
  let highThreshold = Math.ceil(ihName.length / 6);
  let lowThreshold = Math.ceil(ihName.length / 5);
  if (ihName) {
    grbio.forEach(i => {
      let grbioName = i._strippedAndNormalized;
      if (grbioName) {
        if (ihName === grbioName) {
          r._fuzzyMatchPerfect = r._fuzzyMatchPerfect || [];
          r._fuzzyMatchPerfect = r._fuzzyMatchPerfect.concat(i.key);
          return;
        }
        let distance = levenshtein.get(ihName, grbioName);
        if (distance <= highThreshold) {
          r._fuzzyMatchGood = r._fuzzyMatchGood || [];
          r._fuzzyMatchGood = r._fuzzyMatchGood.concat(i.key);
        } else if (distance <= lowThreshold) {
          r._fuzzyMatchWeak = r._fuzzyMatchWeak || [];
          r._fuzzyMatchWeak = r._fuzzyMatchWeak.concat(i.key);
        }
      }
    });
  }
});

saveJson(ih, './ih/data/ihFuzzyCandidates.json');