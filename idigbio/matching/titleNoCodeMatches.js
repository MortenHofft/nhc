const _ = require('lodash');
const helpers = require('../helpers');
const chalk = require('chalk');
const log = console.log;

const instMap = helpers.instMap;

function start(reporting){
  const idig = require('../data/codeCityMatches.json');
  log(chalk.blue('All entities that do not have a code and can be linked by title (and the country is US) are considered correct'));

  //get matches by identifiers
  var inst2instMatchCount = 0;
  idig.forEach(r => {
    if (r._grbioInstMatch || r._instCode) {
      return;
    }
    let intersection = _.intersection(r._inst2instName);
    if (intersection.length > 0) {
      inst2instMatchCount++;
      const match = instMap[intersection[0]];
      r._grbioInstMatch = intersection[0];
      r._matchReason = 'TITLE_MATCH_BUT_NO_IDIGBIO_CODE';
      if (reporting) {
        log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
        log('GRBIO  :  ', chalk.blue((match._code + '').padEnd(10)), chalk.blue(match.name));
        log();
      }
    }
  });

  console.log(`${inst2instMatchCount} do not have a code but have a matching title`);
  log(chalk.yellow(`${idig.filter(x => !x._grbioInstMatch).length} missing an institution match`));
  helpers.saveJson(idig, './idigbio/data/titleNoCodeMatches.json');
}

module.exports = start;