const _ = require('lodash');
const helpers = require('../helpers');
const chalk = require('chalk');
const log = console.log;

const instMap = helpers.instMap;

function start(reporting){
  const idig = require('../data/titleNoCodeMatches.json');
  log(chalk.blue('Entities with similar titles, but no code match. These have been manually evaluated. And individual mappings blocked.'));

  //get matches by identifiers
  var inst2instMatchCount = 0;
  idig.forEach(r => {
    if (r._grbioInstMatch) {
      return;
    }
    let intersection = _.intersection(r._inst2instName);
    if (intersection.length === 1) {
      inst2instMatchCount++;
      const match = instMap[intersection[0]];
      r._grbioInstMatch = intersection[0];
      r._matchReason = 'TITLE_MATCH_BUT_NO_CODE_MATCH_MANUAL';
      if (reporting) {
        log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
        log('GRBIO  :  ', chalk.blue((match._code + '').padEnd(10)), chalk.blue(match.name));
        log();
      }
    }
  });

  if (inst2instMatchCount !== 34){
    throw new Error('expected exactly 34 clean title matches on titleManualMatches.js - had ' + inst2instMatchCount + ' matches')
  }
  console.log(`${inst2instMatchCount} have matching titles but not codes. Looking at them they all seem reasonable.`);
  log(chalk.yellow(`${idig.filter(x => !x._grbioInstMatch).length} missing an institution match`));
  helpers.saveJson(idig, './idigbio/data/titleManualMatches.json');
}

module.exports = start;