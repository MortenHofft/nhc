const ih = require('../data/ihMatchesIterative3.json');
const grbio = require('../data/grbioNormalized.json');
const _ = require('lodash');
const fs = require('fs');
const lookups = require('../getLookups');
const helper = require('../helper');
const chalk = require('chalk');
const log = console.log;

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
      console.log('grbio referenced from more than one ih entity');
    }
    m[x[entryKey]] = x.irn;
  });
  return m;
}
let grbioMatchLookup = getAsLookup(ih, '_grbioEquivalent');

// matches that align perfectly with country, title, code and is already marked as a IH record in grbio: 3101 matches
function match() {
  // get all
  let counter = 0;
  let matchedRecord = 0;
  let noFuzzyTitleCityOrCodeCandidates = 0;
  ih.forEach(r => {
    // do not bother matching if it already has a match
    if (r._grbioEquivalent) {
      matchedRecord++;
      return;
    }
    if (r._noFuzzyTitleCityOrCodeCandidates) {
      noFuzzyTitleCityOrCodeCandidates++;
      return;
    }
    counter++;

    let codes = r._codeMatches || [];
    if (codes) {
      let titlesPerfect = r._fuzzyMatchPerfect || [];
      let titlesGood = r._fuzzyMatchGood || [];
      let titlesWeak = r._fuzzyMatchWeak || [];
      let titles = r._titleMatches || [];
      // let titles = r._fuzzyMatchWeak || [];
      let countries = r._countryMatches || [];
      let cities = r._cityMatches || [];
      let countryCityMatches = r._countryCityMatches || [];
      // let intersection = _.intersection(titles, countryCityMatches);


      // if (_.concat(titles, titlesPerfect, titlesGood, titlesWeak, cities, codes).length === 0) {
      //   if (Date.parse(r.dateModified) > Date.parse('2014-11-11')) {
      //     counter++;
      //     log(chalk.yellow(r.organization), chalk.red(r.code));
      //     r._noFuzzyTitleCityOrCodeCandidates = true;
      //   }
      // }

      let unionedTitleMatches = _.union(titles, titlesPerfect, titlesGood, titlesWeak);
      let intersection = _.intersection(unionedTitleMatches);
      if (intersection.length === 1) {
        let grbioRecord = lookups.grbioMap[intersection[0]];
        if (grbioRecord.indexHerbariorumRecord) {
          // r._grbioEquivalent = grbioRecord.key;

          if (grbioMatchLookup[grbioRecord.key]) {
            // log('already used for', chalk.blue('http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=' + grbioMatchLookup[grbioRecord.key]));
          } else {
            log(chalk.blue('https://www.gbif.org/grscicoll/institution/' + grbioRecord.key));
            log(chalk.blue('http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=' + r.irn));
            log(chalk.yellow(grbioRecord.name), chalk.red(grbioRecord.code), chalk.blue(grbioRecord._country));
            log(chalk.yellow(r.organization), chalk.red(r.code), chalk.blue(r._country));
            if (grbioRecord.additionalNames) {
              console.log('additional names', grbioRecord.additionalNames);
            }
            console.log();
          }
          
          if (codes.length > 1) {
            console.log('more than one matching code');
          }
        }
      }
    }
  });

  console.log('matched in this session', counter);
  console.log('matched records', matchedRecord);
  console.log('noFuzzyTitleCityOrCodeCandidates', noFuzzyTitleCityOrCodeCandidates);
  console.log('no decision taken', counter);
  helper.ensureUnique(ih);

  // saveJson(ih, './ih/data/ihMatchesIterative3.json');
}

match();