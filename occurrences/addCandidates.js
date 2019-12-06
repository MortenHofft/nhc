const grbio = require('./data/grbioNormalized.json');
const institutions = require('./tmp/candidates.json');
const fuzzyMatchesMap = require('./tmp/fuzzyMatchesMap.json');
const _ = require('lodash');
const fs = require('fs');
const lookups = require('./getLookups');
const levenshtein = require('fast-levenshtein');
const log = console.log;

function saveJson(o, name) {
  fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

// run through all records and attach grbio candidates
// institutions.forEach(r => {
//   r._codeMatches = lookups.grbioCodeLookup[r.institutioncode];
//   r._datasetMatches = lookups.grbioTitleLookup[r.datasetTitle];
//   r._publisherMatches = lookups.grbioTitleLookup[r.publisherTitle];

//   let cities = r.publisherCity ? lookups.grbioCityLookup[r.publisherCity] : [];
//   let countries = r.publisherCountry ? lookups.grbioCountryLookup[r.publisherCountry] : [];

//   if (countries && cities) r._countryCityMatches = _.intersection(countries, cities);
//   if (r._codeMatches && countries) r._countryCodeMatches = _.intersection(countries, r._codeMatches);
// });

// const match = (title) => {
//   let r = {};
//   let highThreshold = Math.ceil(title.length / 6);
//   let lowThreshold = Math.ceil(title.length / 5);
//   grbio.forEach(i => {
//     let grbioName = i._strippedAndNormalized;
//     if (grbioName) {
//       if (title === grbioName) {
//         r._strippedAndNormalizedPublisher = r._fuzzyMatchPerfect || [];
//         r._fuzzyMatchPerfect = r._fuzzyMatchPerfect.concat(i.key);
//         return;
//       }
//       let distance = levenshtein.get(title, grbioName);
//       if (distance <= highThreshold) {
//         r._fuzzyMatchGood = r._fuzzyMatchGood || [];
//         r._fuzzyMatchGood = r._fuzzyMatchGood.concat(i.key);
//       } else if (distance <= lowThreshold) {
//         r._fuzzyMatchWeak = r._fuzzyMatchWeak || [];
//         r._fuzzyMatchWeak = r._fuzzyMatchWeak.concat(i.key);
//       }
//     }
//   });
//   return r;
// }

// fuzzy name matches
// const addMatches = (institutions) => {
//   institutions.forEach(r => {
//     if (r._datasetMatches) return; // do not bother looking for a fuzzy match if we already have a perfect title match
//     if (r._publisherMatches) return; // do not bother looking for a fuzzy match if we already have a perfect title match
//     let datasetMatches = fuzzyMatchesMap[r._strippedAndNormalizedPublisher];
//     let publisherMatches = fuzzyMatchesMap[r._strippedAndNormalizedPublisher];
//     r._fuzzyMatchPerfect = _.compact(_.uniq([].concat(_.get(datasetMatches, '_fuzzyMatchPerfect'), _.get(publisherMatches, '_fuzzyMatchPerfect'))));
//     r._fuzzyMatchGood = _.compact(_.uniq([].concat(_.get(datasetMatches, '_fuzzyMatchGood'), _.get(publisherMatches, '_fuzzyMatchGood'))));
//     r._fuzzyMatchWeak = _.compact(_.uniq([].concat(_.get(datasetMatches, '_fuzzyMatchWeak'), _.get(publisherMatches, '_fuzzyMatchWeak'))));
//   });

//   console.log(institutions);
//   saveJson(institutions, './occurrences/tmp/candidatesFuzzy.json');
// }

const getMatches = institutions => {
  let distinctNames = _.uniq(_.concat([], institutions.map(x => x._strippedAndNormalizedDataset), institutions.map(x => x._strippedAndNormalizedPublisher)));
  //get grbio candidates per name
  // let results = [];
  // log(distinctNames.length);
  // distinctNames.forEach((title, i) => {
  //   if (title) {
  //     log(i);
  //     results.push(match(title));
  //   }
  // });
  // const fuzzyMatches = require('./tmp/fuzzyMatches.json');
  // let map = _.zipObject(distinctNames, fuzzyMatches);
  // saveJson(map, './occurrences/tmp/fuzzyMatchesMap.json');
}

//let inst = institutions.filter(x => x.occurrences > 1);
addMatches(institutions);
// addMatches(inst);
// saveJson(inst, './occurrences/tmp/candidatesFuzzy.json');


// log(inst, 'occurrences');
