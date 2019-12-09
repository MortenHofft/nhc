const ih = require('./data/ihInstitutions_2019_11_19.json');
const institutionCodes = require('./data/herbariaInstitutionCodes.json');
const collectionCodes = require('./data/herbariaCollectionCodesTop.json');
const sameCodes = require('./data/sameCodes.json');
const _ = require('lodash');
const log = console.log;
const chalk = require('chalk');

//get unique codes for each - with NULL removed
let ihDistinct = _.uniqBy(ih, 'code');
let instDistinct = _.uniqBy(institutionCodes.filter(x => x.institutioncode !== 'NULL'), 'code');
let collDistinct = _.uniqBy(collectionCodes.filter(x => x.collectioncode !== 'NULL'), 'code');
let sameDistinct = _.uniqBy(sameCodes.filter(x => x.code !== 'NULL'), 'code');

log('== DISTINCT ==');
log('IH: ', chalk.yellow(ihDistinct.length));
log('institutions: ', chalk.yellow(instDistinct.length));
log('collections: ', chalk.yellow(collDistinct.length));
log('shared: ', chalk.yellow(sameDistinct.length));

//overlaps in codes and counts
log('\n== OVERLAPS ==');
let instituionOverlap = _.intersectionBy(instDistinct, ihDistinct, x => x.code)
let overlapInstOccurrences = _.sumBy(instituionOverlap, 'occurrences');
log('Institutions and IH:', chalk.yellow(`${instituionOverlap.length} codes`), chalk.magenta(`${overlapInstOccurrences} institutionCode occurrences`));

log('\n');
let collectionOverlap = _.intersectionBy(collDistinct, ihDistinct, x => x.code)
let overlapCollOccurrences = _.sumBy(collectionOverlap, 'occurrences');
log('Collections and IH:', chalk.yellow(`${collectionOverlap.length} codes`), chalk.magenta(`${overlapCollOccurrences} collectionCode occurrences`));

log('\n');
let sameOverlap = _.intersectionBy(sameDistinct, ihDistinct, x => x.code)
let overlapSameOccurrences = _.sumBy(sameOverlap, 'occurrences');
log('Same code and IH:', chalk.yellow(`${sameOverlap.length} codes`), chalk.magenta(`${overlapSameOccurrences} occurrences`));

log('\n');
let overlapA = _.intersectionBy(instDistinct, collDistinct, ihDistinct, x => x.code)
let overlapB = _.intersectionBy(collDistinct, instDistinct, ihDistinct, x => x.code)
let overlapOccurrencesA = _.sumBy(overlapA, 'occurrences');
let overlapOccurrencesB = _.sumBy(overlapB, 'occurrences');
log('Shared between all 3:', chalk.yellow(`${overlapA.length} codes`), chalk.magenta(`${overlapOccurrencesA} institutionCode occurrences`));
log('Shared between all 3:', chalk.yellow(`${overlapB.length} codes`), chalk.magenta(`${overlapOccurrencesB} collectionCode occurrences`));
log('Shared between inst and coll:', chalk.yellow(`${_.intersectionBy(instDistinct, collDistinct, x => x.code).length} codes`));

log(_.sumBy(instDistinct, 'occurrences'));
log(_.sumBy(collDistinct, 'occurrences'));