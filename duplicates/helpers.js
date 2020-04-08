const _ = require('lodash');
const fs = require('fs');
const chalk = require('chalk');
const log = console.log;
const logBlue = x => console.log(chalk.blue(x));
const logRed = x => console.log(chalk.red(x));
const logGreen = x => console.log(chalk.green(x));
const logYellow = x => console.log(chalk.yellow(x));

const inst = require('./data/instNormalized.json');
const instMap = _.keyBy(inst, 'key');

const coll = require('./data/collNormalized.json');
const collMap = _.keyBy(coll, 'key');
const instToColl = getAsLookup(coll, 'institutionKey');

function saveJson(o, name) {
  // fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {

  //   if (err) {
  //     return console.log(err);
  //   }

  //   console.log("The file was saved!");
  // });

  fs.writeFileSync(name, JSON.stringify(o, null, 2));
  console.log("The file was saved!");
  console.log();
}


function normalize(a, stopwordsPattern) {
  // stopwordsPattern = stopwordsPattern || /\b(the|to|do|from|of|de|and|at|du|d|l|le|la|historie|history|natural|naturelle)\b/g;
  stopwordsPattern = stopwordsPattern || /\b(the|to|do|from|of|de|and|at|in|du|d|l|le|la|et|for|di|del|y|des|da|der|fur|a|s|und|u|i|m|los|dos)\b/g;
  a = a.toLowerCase().replace(/[,.&|/\-'")(]/g, ' ').replace(stopwordsPattern, ' ').replace(/\s\s+/g, ' ');
  a = a.split(' ').sort().join(' ').trim();
  return a;
}

function stripDiacrits(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Create lookup maps
function getAsLookup(collection, entryKey, useObject) {
  let m = {};
  collection.forEach(x => {
    if (typeof x[entryKey] === 'undefined') return; 
    const result = useObject ? x : x.key;
    m[x[entryKey]] = m[x[entryKey]] ? m[x[entryKey]].concat(result) : [result]
  });
  return m;
}

// used to report if several idigbio entries map to the same grbio entry
function reuseReport(idigbioRecords) {
  let hasEntry = _.filter(idigbioRecords, '_grbioInstMatch');
  let groups = _.groupBy(hasEntry, '_grbioInstMatch');
  let duplicates = _.pickBy(groups, x => x.length > 1);
  Object.keys(duplicates).forEach(x => {
    logBlue(`${instMap[x].name} (${x}) is reused by following iDigBio entries`);
    duplicates[x].forEach(i => {
      logYellow(`${i.institution} (${i._instCode})`);
    });
    log();
  });
}

module.exports = {
  saveJson,
  normalize,
  stripDiacrits,
  getAsLookup,
  reuseReport,
  instMap,
  collMap,
  instToColl
}