const _ = require('lodash');
const helpers = require('../helpers');
const chalk = require('chalk');
const log = console.log;

const instMap = helpers.instMap;

function start(){
  const idig = require('../data/identifierMatches.json');
  log(chalk.blue('All entities that can be linked by both code and title (and the country is US) are considered correct'));
  log(chalk.blue('If there is more than one that match both code and title, then the first will be selected. If there are exactly one code and fuzzy title match, then tht will be selected.'));

  //get matches by identifiers
  var inst2instMatchCount = 0;
  var coll2instMatchCount = 0;
  var collMatchCount = 0;

  idig.forEach(r => {
    if (r._grbioCollMatch) {
      return;
    }
    let intersection = _.intersection(r._inst2collName, r._inst2collCode);
    if (intersection.length > 0) {
      collMatchCount++;
      r._grbioCollMatch = intersection[0];
      const collMatch = helpers.collMap[r._grbioCollMatch];
      if (collMatch.institutionKey) r._grbioCollMatch_institutionKey = collMatch.institutionKey;
    }
  });

  idig.forEach(r => {
    if (r._grbioInstMatch) {
      return;
    }
    let intersection = _.intersection(r._inst2instCode, r._inst2instName);
    if (intersection.length > 0) {
      inst2instMatchCount++;
      // use collection matches as a way to disamiguate
      const hasColMatchToo = _.intersection(intersection, [r._grbioCollMatch_institutionKey]);
      r._grbioInstMatch = hasColMatchToo.length === 1 ? hasColMatchToo[0] : intersection[0];
      // r._grbioInstMatch = intersection[0];
      r._matchReason = 'TITLE_AND_CODE_FIRST_MATCH';
    }

    if (r._grbioInstMatch) {
      return;
    }
    intersection = _.intersection(r._coll2instCode, r._inst2instName);
    if (intersection.length > 0) {
      coll2instMatchCount++;
      r._grbioInstMatch = intersection[0];
      r._matchReason = 'TITLE_AND_CODE_FIRST_MATCH';
    }
  });

  idig.forEach(r => {
    if (r._grbioInstMatch) {
      return;
    }
    let intersection = _.intersection(r._inst2instCode, r._fuzzyInst);
    if (intersection.length === 1) {
      inst2instMatchCount++;
      r._grbioInstMatch = intersection[0];
    }
  });

  console.log(`${inst2instMatchCount} can be matched to an institution by iDigBio institutuin code and fuzzy title`);
  console.log(`${coll2instMatchCount} can be matched to an institution by iDigBio collection code and fuzzy title`);
  console.log(`${collMatchCount} can be matched to an a collection by title and code`);
  log(chalk.yellow(`${idig.filter(x => !x._grbioInstMatch).length} missing an institution match`));
  helpers.saveJson(idig, './idigbio/data/codeTitleMatches.json');
}

module.exports = start;