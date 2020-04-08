const _ = require('lodash');
const helpers = require('../helpers');
const chalk = require('chalk');
const log = console.log;

const instMap = helpers.instMap;
const instToColl = helpers.instToColl;

function start(reporting){
  const inst = require('../data/initialCandidates.json');

  log(chalk.blue('Find candidates with similar name and code'));

  //get matches by identifiers
  var clusterCount = 0;
  var alreadyClustered = [];

  // _strippedAndNormalized => _nameDuplicates
  // _simplified => _simpleNameDuplicates
  // _city => _cityDuplicates
  // _code => _codeDuplicates
  // _strippedAndNormalized => _fuzzyNameDuplicates


  // inst.forEach(r => {
  //   if (alreadyClustered.indexOf(r.key) > -1) return;
  //   let intersection = _.intersection(r._nameDuplicates, r._codeDuplicates);
  //   if (intersection.length > 0) {
  //     alreadyClustered = alreadyClustered.concat(intersection);
  //     clusterCount++;
  //     // r._grbioCollMatch_institutionKey = collMatch.institutionKey;
  //     if (reporting) {
  //       log(chalk.green(r._code.padEnd(10)), chalk.green(r.name), ' - ', chalk.yellow(r.key), chalk.green(_.get(instToColl[r.key], 'length', 0)));
  //       intersection.forEach(uuid => {
  //         const match = instMap[uuid];
  //         log(chalk.blue((match._code + '').padEnd(10)), chalk.blue(match.name), ' - ', chalk.yellow(match.key), chalk.green(_.get(instToColl[match.key], 'length', 0)));
  //       });
  //       log();
  //     }
  //   }
  // });

  inst.forEach(r => {
    if (alreadyClustered.indexOf(r.key) > -1) return;
    
    let intersection = _.intersection(r._fuzzyNameDuplicates);
    // let intersection = _.intersection(r._nameDuplicates);
    // let intersection = _.intersection(r._codeDuplicates);
    if (intersection.length > 0) {
      alreadyClustered = alreadyClustered.concat(intersection);
      clusterCount++;
      // r._grbioCollMatch_institutionKey = collMatch.institutionKey;
      if (reporting) {
        log(chalk.green(r._code.padEnd(10)), chalk.green(r.name.padEnd(70)), `https://registry.gbif.org/institution/${r.key}`, chalk.green(_.get(instToColl[r.key], 'length', 0)), chalk.yellow(r._city));
        intersection.forEach(uuid => {
          const match = instMap[uuid];
          log(chalk.blue((match._code + '').padEnd(10)), chalk.blue(match.name.padEnd(70)), `https://registry.gbif.org/institution/${match.key}`, chalk.green(_.get(instToColl[match.key], 'length', 0)), chalk.yellow(match._city));
        });
        log();
      }
    }
  });

  console.log(`${clusterCount} groups`);
  log('how many of the clustered items are IH ', alreadyClustered.filter(x => instMap[x].indexHerbariorumRecord).length);
  // log(chalk.yellow(`${idig.filter(x => !x._grbioInstMatch).length} missing an institution match`));
  // helpers.saveJson(inst, './duplicates/data/codeTitleMatches.json');
}

module.exports = start;