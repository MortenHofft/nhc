const ih = require('./data/ihMatchesIterative3.json');
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

