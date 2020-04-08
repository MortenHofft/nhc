const _ = require('lodash');
const helpers = require('../helpers');
const chalk = require('chalk');
const log = console.log;

function start(reporting){
  const idig = require('../data/initialCandidates.json');
  
  //add commit dates from github
  const commits = require('../data/idigCommits.json');
  const commitlookup = _.keyBy(commits, 'collection_uuid');
  idig.forEach(x => {
    x.modifiedDate = commitlookup[x.collection_uuid].modifiedDate;
    x.modifiedBy = commitlookup[x.collection_uuid].modifiedBy;
  });

  log(chalk.green('idigbio entries in total: ' + idig.length));
  log(chalk.green('idigbio entries with an IRN in total: ' + idig.filter(x => x._irn).length));

  log(chalk.blue('all entities that can be linked by IRN are considered correct'));

  //get matches by identifiers
  var instMatchCount = 0;
  var instFuzzyMatchCount = 0;
  var collMatchCount = 0;
  idig.forEach(r => {
    if (r._irn && !r._irnInstMatches && !r._irnCollMatches) {
      log(chalk.red(`No match for irn: ` + r._irn));
    }
    if (r.collection_uuid === "urn:uuid:8c69e443-6d38-4223-ba7e-b62ab230d020f5") {
      log(chalk.yellow('IGNORED:  collection_uuid urn:uuid:8c69e443-6d38-4223-ba7e-b62ab230d020f5 has an IRN that seems wrong. It is therefor ignored.\n'));
      return;
    }
    if (r.collection_uuid === 'urn:uuid:d0f95001-b7bb-424c-bd99-edf778477d0e') {
      console.log(chalk.yellow(`IGNORED: ${r.institution} ${r._instCode} has an IRN that seems wrong. It points to a german institution with a different code\n`));
      return
    }
    let intersection = _.intersection(r._irnInstMatches, r._fuzzyInst);
    if (intersection.length === 1) {
      instFuzzyMatchCount++;
    }

    intersection = _.intersection(r._irnInstMatches);
    if (intersection.length === 1) {
      const match = helpers.instMap[intersection[0]];
      const country = match._country;
      if (country && country !== 'US') console.log(chalk.red('IRN mapping to a non us collection'));
      if (match._code !== r._instCode) {
        console.log(chalk.yellow(`IRN mapped to grbio, but codes are in conflict:`));
        console.log(chalk.yellow(`GRBIO  : ${match.name} ${match._code}`));
        console.log(chalk.yellow(`IDIGBIO: ${r.institution} ${r._instCode}`));
        console.log();
      }
      
      instMatchCount++;
      r._grbioInstMatch = intersection[0];
      r._matchReason = 'IRN';
      if (reporting) {
        log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
        log('GRBIO  :  ', chalk.blue((match._code + '').padEnd(10)), chalk.blue(match.name), ' - ', chalk.yellow(match.key));
        log();
      }
    }

    intersection = _.intersection(r._irnCollMatches);
    if (intersection.length === 1) {
      collMatchCount++;
      r._grbioCollMatch = intersection[0];
    }

  });

  console.log(`${instMatchCount} can be matched to an institution by IRN`);
  console.log(`${instFuzzyMatchCount} of those have a good institution title match`);
  console.log(`${collMatchCount} can be matched to a collection by IRN`);
  log(chalk.yellow(`${idig.filter(x => !x._grbioInstMatch).length} missing an institution match`));
  helpers.saveJson(idig, './idigbio/data/irnMatches.json');
}

module.exports = start;
