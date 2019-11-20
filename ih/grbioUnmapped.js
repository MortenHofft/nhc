const ih = require('./data/ihMatchesIterative3.json');
const ihPerfect = require('./data/ihPerfectMatches.json');
const collections = require('./data/grbioCollections.json');
const grbio = require('./data/grbioNormalized.json');
const _ = require('lodash');
const fs = require('fs');
const lookups = require('./getLookups');
const helper = require('./helper');
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
    m[x[entryKey]] = x;
  });
  return m;
}
let grbioMatchLookup = getAsLookup(ih, '_grbioEquivalent');
let perfectLookup = getAsLookup(ihPerfect, '_grbioEquivalent');

// console.log(grbio.filter(x => x.indexHerbariorumRecord && !grbioMatchLookup[x.key]).map(x => 'https://www.gbif.org/grscicoll/institution/' + x.key));


// grbio.filter(x => x.indexHerbariorumRecord && !grbioMatchLookup[x.key])
//   .forEach(x => {
//     log(chalk.yellow(`* \`${x.code}\`[${x.name}](https://www.gbif.org/grscicoll/institution/${x.key})`))
//     //code used elsewhere?
//     lookups.grbioCodeLookup[x.code].forEach(e => {
//       let grbioEntity = lookups.grbioMap[e];
//       if (!grbioEntity.indexHerbariorumRecord) return;
//       if (e !== x.key && grbioMatchLookup[e]) {
//         let m = grbioMatchLookup[e];
//         log(`  * Another GrBio institution with the same code [${grbioEntity.name}](https://www.gbif.org/grscicoll/institution/${e}) matched to IH: [${m.organization}](http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${m.irn})`);
//       }
//       if (e !== x.key && !grbioMatchLookup[e]) {
//         log(`  * This code is also used for [${grbioEntity.name}](https://www.gbif.org/grscicoll/institution/${e}) but not matched to IH`);
//       }
//     });
//   });

// log(ih.filter(x => x._grbioEquivalent && lookups.grbioMap[x._grbioEquivalent].indexHerbariorumRecord).length);

// log('Perfect matches', ihPerfect.filter(x => x._grbioEquivalent).length);

//fuzzy matches
// ih.filter(x => x._grbioEquivalent && lookups.grbioMap[x._grbioEquivalent].indexHerbariorumRecord).forEach(x => {
//   let perfect = perfectLookup[x._grbioEquivalent];
//   if (perfect) return;
//   let g = lookups.grbioMap[x._grbioEquivalent];
//   log(`${x.organization}\t${g.name}\t${g._country !== x._country ? 'Yes' : ''}\t${g._city !== x._city ? 'Yes' : ''}\t${!!x._codeMatches && x._codeMatches.length > 1 ? 'Yes' : ''}\t${!!x._titleMatches && x._titleMatches.length > 1 ? 'Yes' : ''}\thttp://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${x.irn}\thttps://www.gbif.org/grscicoll/institution/${g.key}`);
// })
// log('fyzzy matches', ih.filter(x => x._grbioEquivalent && lookups.grbioMap[x._grbioEquivalent].indexHerbariorumRecord).length);



// new matches
// ih.filter(x => x._grbioEquivalent && !lookups.grbioMap[x._grbioEquivalent].indexHerbariorumRecord).forEach(x => {
//   let perfect = perfectLookup[x._grbioEquivalent];
//   if (perfect) return;
//   let g = lookups.grbioMap[x._grbioEquivalent];
//   log(`${x.organization}\t${g.name}\t${g._country !== x._country ? 'Yes' : ''}\t${g._city !== x._city ? 'Yes' : ''}\t${!!x._codeMatches && x._codeMatches.length > 1 ? 'Yes' : ''}\t${!!x._titleMatches && x._titleMatches.length > 1 ? 'Yes' : ''}\thttp://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${x.irn}\thttps://www.gbif.org/grscicoll/institution/${g.key}`);
// })
// log('new matches', ih.filter(x => x._grbioEquivalent && !lookups.grbioMap[x._grbioEquivalent].indexHerbariorumRecord).length);



// no known match
// ih.filter(x => x._noFuzzyTitleCityOrCodeCandidates).forEach(x => {
//   log(`${x.organization}\t${x.code}\t${x.dateModified}\thttp://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${x.irn}`);
// })
// log('no known match', ih.filter(x => x._noFuzzyTitleCityOrCodeCandidates).length);




// undecided
ih.filter(x => !x._noFuzzyTitleCityOrCodeCandidates && !x._grbioEquivalent).forEach(x => {
  let codes = x._codeMatches || [];
  let codes2titles = codes.map(key => lookups.grbioMap[key].name).join(' - ');

  let titles = x._titleMatches || [];
  let titlesPerfect = x._fuzzyMatchPerfect || [];
  let titlesGood = x._fuzzyMatchGood || [];
  let titlesWeak = x._fuzzyMatchWeak || [];
  let unionedTitleMatches = _.union(titles, titlesPerfect, titlesGood, titlesWeak);

  let countryCityMatches = x._countryCityMatches || [];
  let city2title = countryCityMatches.map(key => lookups.grbioMap[key].name + `(${lookups.grbioMap[key].code})`).join(' - ');

  let titles2Code = unionedTitleMatches.map(key => lookups.grbioMap[key].code).join(' - ');
  let titles2names = unionedTitleMatches.map(key => lookups.grbioMap[key].name).join(' - ');

  log(`${x.organization} \t${titles2names} \t${titles2Code} \t${x.code} \t${codes2titles} \t${city2title} \thttp://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${x.irn}\t${x.dateModified}`);
})
// log('undecided', ih.filter(x => !x._noFuzzyTitleCityOrCodeCandidates && !x._grbioEquivalent).length);



// //matches to a collection
// let collectionMap = _.groupBy(collections, 'code');
// ih.filter(x => !x._noFuzzyTitleCityOrCodeCandidates && !x._grbioEquivalent).forEach(x => {
//   let c = collectionMap[x.code];
//   if (c) {
//     let options = c.map(x => x.name + '\thttps://www.gbif.org/grscicoll/collection/' + x.key).join('\t');
//     log(`${x.organization}\t${x.code}\thttp://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${x.irn}\t${options}`);
//   }
// });


// console.log(ih.filter(x => x._grbioEquivalent && !lookups.grbioMap[x._grbioEquivalent].indexHerbariorumRecord).length);
// console.log(ih.filter(x => x._grbioEquivalent && !lookups.grbioMap[x._grbioEquivalent].indexHerbariorumRecord && x.code === lookups.grbioMap[x._grbioEquivalent].code).length);
// console.log(ih.filter(x => !x._noFuzzyTitleCityOrCodeCandidates && !x._grbioEquivalent).length);