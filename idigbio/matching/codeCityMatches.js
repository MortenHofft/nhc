const _ = require('lodash');
const helpers = require('../helpers');
const chalk = require('chalk');
const log = console.log;

const inst = require('../data/instNormalized.json');
const instMap = _.keyBy(inst, 'key');

function start(reporting){
  const idig = require('../data/codeTitleMatches.json');
  log(chalk.blue('All entities that can be linked by both code and city (and the country is US) are considered correct'));

  //get matches by identifiers
  var instMatchCount = 0;
  idig.forEach(r => {
    if (r._grbioInstMatch) {
      return;
    }
    if (r.collection_uuid === "urn:uuid:2bcfc124-0e67-4aec-bcf0-06f7f64d20ac") {
      console.log(chalk.yellow(`IGNORED: ${r.institution} ${r._instCode} has an matching code and city, but looks suspicious and will be ignored\n`));
      return;
    }

    let intersection = _.intersection(r._inst2instCode, r._instCityMatches);
    if (intersection.length === 1) {
      const match = instMap[intersection[0]];
      const country = match._country;
      if (country && country !== 'US') return;
      instMatchCount++;
      r._grbioInstMatch = intersection[0];
      r._matchReason = 'CODE_AND_CITY_1:1';
      if (reporting) {
        log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
        log('GRBIO  :  ', chalk.blue((match._code + '').padEnd(10)), chalk.blue(match.name));
        log();
      }
    }
  });

  console.log(`${instMatchCount} can be matched to an institution by both code and city`);
  log(chalk.yellow(`${idig.filter(x => !x._grbioInstMatch).length} missing an institution match`));
  helpers.saveJson(idig, './idigbio/data/codeCityMatches.json');
}

module.exports = start;