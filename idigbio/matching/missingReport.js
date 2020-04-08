const _ = require('lodash');
const helpers = require('../helpers');
const chalk = require('chalk');
const log = console.log;

const inst = require('../data/instNormalized.json');
const instMap = _.keyBy(inst, 'key');


function start(){
  const idig = require('../data/manualMatches.json');
  // helpers.reuseReport(idig);
  log(chalk.blue('Remaining entities have no clear match and should eith erbe manually evaluated or created'));

  //get matches by identifiers
  var withCodeMatch = 0;
  var withTitleMatch = 0;
  var withCityMatch = 0;
  idig.forEach(r => {
    if (r._grbioInstMatch) {
      return;
    }
    if (r._inst2instCode && r._inst2instCode.length > 0) withCodeMatch++;
    if (r._inst2instName && r._inst2instName.length > 0) withTitleMatch++;
    if (r._instCityMatches && r._instCityMatches.length > 0) withCityMatch++;

    // log(chalk.yellow(`${idig.filter(x => !x._grbioInstMatch).length} missing an institution match`));
  });

  log(chalk.yellow(`${idig.filter(x => !x._grbioInstMatch).length} missing an grbio institution match`));
  log(chalk.yellow(`${withCodeMatch} of unlinked have a code match with a grbio entry`));
  log(chalk.yellow(`${withTitleMatch} of unlinked have a title siilar to a grbio entry`));
  log(chalk.yellow(`${withCityMatch} of unlinked have the same city as a grbio entry`));
  // helpers.saveJson(idig, './idigbio/data/codeCityMatches.json');
  
  const skip = [683, 16, 64, 109, 118, 130, 256, 258, 302, 353, 371, 396, 452, 507];
  const manual = {};
  // idig.forEach((r, index) => {
  //   if (r._grbioInstMatch) {
  //     return;
  //   }
  //   if (r._inst2instCode && r._inst2instCode.length > 0) {
  //     let items = r._inst2instCode.map(x => instMap[x]);
  //     let titles = items.map(x => `${x.name} (CODE: ${r._instCode}) [${r.collection_uuid}]`).join('; ');
  //     let codes = items.map(x => x._code).join('; ');
  //     // log(chalk.green(r.institution), chalk.blue(titles), chalk.green(r._instCode), chalk.blue(codes));
  //     // log(index, chalk.green(r.institution), chalk.green(r._instCode), );
  //     // log(index, chalk.blue(titles), chalk.blue(codes));
      
  //     log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
  //     items.forEach(x => {
  //       log('GRBIO  :  ', chalk.blue((x._code + '').padEnd(10)), chalk.blue(x.name), ' - ', chalk.yellow(x.key));
  //     });
  //     log();

  //   }
  // });
  // console.log(JSON.stringify(manual, null, 2));

  // const mapping = {
  //   113: 2,
  //   125: 1,
  //   218: 2,
  //   447: 2,
  //   1044: 1,
  //   1230: 2,
  //   1270: 1
  // }

  // let wordOverlapCount = 0;
  // idig.forEach((r, index) => {
  //   if (r._grbioInstMatch) {
  //     return;
  //   }
  //   const wordOverlap = _.get(r, 'wordOverlap.wordOverlap_2', []);
  //   const intersection = _.intersection(wordOverlap, r._instCityMatches);
  //   if (intersection.length === 1) {
  //     wordOverlapCount++;
  //     const match = helpers.instMap[intersection[0]];
  //     // let items = r._inst2instName.map(x => instMap[x]);
  //     let items = intersection.map(x => instMap[x]);//.filter(x => x.active);
  //     let titles = items.map(x => `${x.name} (CODE: ${r._instCode}) [${r.collection_uuid}]`).join('; ');
  //     let active = items.map(x => x.active).join('; ');
  //     // log(chalk.green(r.institution), chalk.blue(titles), chalk.green(r._instCode), chalk.blue(codes));
  //     // log(index, chalk.green(r.institution), chalk.green(r._instCode), );
  //     // log(index, chalk.blue(titles));
  //     // if (skip.indexOf(index) === -1) {
  //     //   manual[r.collection_uuid] = items[0].key;
  //     // } else {
  //     //   log(chalk.red('skip'))
  //     // }
  //     // log();
      
  //     log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(15)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
  //     items.forEach(x => {
  //       log('GRBIO  :  ', chalk.blue((x._code + '').padEnd(15)), chalk.blue(x.name), ' - ', chalk.yellow(x.key));
  //     });
  //     log();

  //     // if (mapping[index]) {
  //     //   // log(items[mapping[index]-1].name, items[mapping[index]-1].key);
  //     //   manual[r.collection_uuid] = items[mapping[index]-1].key;
  //     // }
      
  //   }
  // });
  // log(`${wordOverlapCount} has a 2 word overlap in title and are from the same city`);


  // word count stats
  // let wordOverlapCount = 0;
  // idig.forEach((r, index) => {
  //   if (r._grbioInstMatch) {
  //     return;
  //   }
  //   const wordOverlap = _.get(r, 'wordOverlap.wordOverlap_2', []);
  //   const intersection = _.intersection(wordOverlap, r._instCityMatches);
  //   if (intersection.length === 1) {
  //     wordOverlapCount++;
  //     let items = intersection.map(x => instMap[x]);//.filter(x => x.active);
  //     log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(15)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
  //     items.forEach(x => {
  //       log('GRBIO  :  ', chalk.blue((x._code + '').padEnd(15)), chalk.blue(x.name), ' - ', chalk.yellow(x.key));
  //     });
  //     log();
  //   }
  // });
  // log(`${wordOverlapCount} has a 2 word overlap in title and are from the same city`);


  // code matches
  // idig.forEach((r, index) => {
  //   if (r._grbioInstMatch) {
  //     return;
  //   }
  //   if (r._inst2instCode && r._inst2instCode.length > 0) {
  //     let items = r._inst2instCode.map(x => instMap[x]);
  //     log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
  //     items.forEach(x => {
  //       log('GRBIO  :  ', chalk.blue((x._code + '').padEnd(10)), chalk.blue(x.name), ' - ', chalk.yellow(x.key));
  //     });
  //     log();
  //   }
  // });



  log(chalk.red('No match, but has a collection match'))
  idig.forEach((r, index) => {
    if (r._grbioCollMatch && r._grbioInstMatch) {
      const instMatch = helpers.instMap[r._grbioInstMatch];
      const collMatch = helpers.collMap[r._grbioCollMatch];
      
      // if (!collMatch.institutionKey) {
      //   log(chalk.red('matched to collection without an institution'))
      //   log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
      // }
      // if (collMatch.institutionKey && collMatch.institutionKey !== instMatch.key) {
      //   log(chalk.red('match to conflicting institution and collection'))
      //   log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
      // }
      // log('IDIGBIO:  ', chalk.green(r._instCode.padEnd(10)), chalk.green(r.institution), ' - ', chalk.yellow(r.collection_uuid));
    }
  });

}

module.exports = start;