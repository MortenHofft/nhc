const idig = require('./data/idigbioCollections.json');
const ih = require('./data/ihMatchedLatest.json');
const _ = require('lodash');
const helpers = require('./helpers');
const chalk = require('chalk');
const log = console.log;

const ihMap = _.keyBy(ih, 'irn');

//log(idig.filter(x => x.sameAs !== '').map(x => x.sameAs).map(x => x.substr(62)))//.filter(x => !ihMap[x]));

log(chalk.yellow('All sameAs are to Inden herbariorum, but some of them are not in IH'))
log(idig.filter(x => x.sameAs !== '').map(x => x.sameAs).map(x => x.substr(x.indexOf('irn=') + 4)).filter(x => !ihMap[x]));

//_grbioEquivalent



/*
idigbio data issues spotted

// there are records that reference non existing IH records
e.g. http://sweetgum.nybg.org/science/ih/herbarium_details.php?irn= from Kaibab National Forest and New Mexico Natural History Institute
log(idig.filter(x => x.sameAs !== '').map(x => x.sameAs).map(x => x.substr(62)).filter(x => !ihMap[x]));

*/

// which fields are used
let withValue = {};
let withField = {};
idig.forEach(x => _.merge(withValue, _.pickBy(x, x => x !== '' && x)));
idig.forEach(x => _.merge(withField, x, _.pickBy(x, x => x !== '' && x)));
log(chalk.yellow('\nThese fields are in use, and here are example usages'))
console.log(withValue);
log(chalk.yellow('\nThese fields do not have any data in any records'))
console.log(_.difference(Object.keys(withField), Object.keys(withValue)));