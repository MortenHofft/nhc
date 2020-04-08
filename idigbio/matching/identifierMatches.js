const _ = require('lodash');
const helpers = require('../helpers');
const chalk = require('chalk');
const log = console.log;

function start(reporting){
  const idig = require('../data/irnMatches.json');
  log(chalk.blue('all entities that can be linked by an identifier (biobol/grbio/cool) are considered correct'));

  //get matches by identifiers
  var instMatchCount = 0;
  var instFuzzyMatchCount = 0;
  idig.forEach(r => {
    if (r._grbioInstMatch) {
      return;
    }
    let intersection = _.intersection(r._identifier2inst, r._fuzzyInst);
    if (intersection.length === 1) {
      instFuzzyMatchCount++;
    }

    intersection = _.intersection(r._identifier2inst);
    if (intersection.length === 1) {
      const match = helpers.instMap[intersection[0]];
      const country = match._country;
      if (country && country !== 'US') console.log(chalk.red('Identifier mapping to a non us collection'));
      if (match._code !== r._instCode) {
        console.log(chalk.yellow(`Identifier mapped to grbio, but codes are in conflict:`));
      }
      instMatchCount++;
      r._grbioInstMatch = intersection[0];
      r._matchReason = 'IDENTIFIER';
      if (reporting) {
        log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
        log('GRBIO  :  ', chalk.blue((match._code + '').padEnd(10)), chalk.blue(match.name), ' - ', chalk.yellow(match.key));
        log();
      }
    }
  });

  console.log(`${instMatchCount} can be matched to an institution by an identifier`);
  console.log(`${instFuzzyMatchCount} of those have a good institution title match`);
  log(chalk.yellow(`${idig.filter(x => !x._grbioInstMatch).length} missing an institution match`));
  helpers.saveJson(idig, './idigbio/data/identifierMatches.json');
}

module.exports = start;