const inst = require('./data/grbioInstitutions.json');
const coll = require('./data/grbioCollections.json');
const occurrenceData = require('./data/occurrenceData.json');
const _ = require('lodash');
const helpers = require('./helpers');
const chalk = require('chalk');
const log = console.log;
const getAsLookup = helpers.getAsLookup;

occurrenceData.forEach((x, index) => {
  x.key = index;
  x.institutioncode = x.institutioncode ? x.institutioncode.toUpperCase() : x.institutioncode
});
const getOccurrenceUsageFromCode = getAsLookup(occurrenceData, 'institutioncode', true);
const getOccurrenceUsageFromId = getAsLookup(occurrenceData, 'institutionid', true);

// ====== registry institutions ======== //
function decorate_inst() {
  inst.forEach(x => {
    //normalize name
    x._normalized = helpers.normalize(x.name);
    x._strippedAndNormalized = helpers.stripDiacrits(x._normalized);
    x._simplified = helpers.normalize(x._strippedAndNormalized, /\b(centre|society|historic|centro|universitat|school|historie|history|natural|naturelle|university|college|state|museum|national|institute|collection|research|doi|universidad|department|sciences|culture|museo|universidade|science|nacional|academy|instituto|center)\b/g);

    x._country = _.get(x, 'address.country') || _.get(x, 'mailingAddress.country');

    // extract a representative city as it could serve as a sanity check on matches
    x._city = _.get(x, 'address.city') || _.get(x, 'mailingAddress.city') || _.get(x, 'address.address') || _.get(x, 'mailingAddress.address');
    if (x._city) x._city = x._city.toLowerCase().trim();
    
    //normalize code
    x._code = x.code.toUpperCase().trim();

    //get occurrence suggestions
    if (x._code !== '') x._occurrenceCodeUsages = getOccurrenceUsageFromCode[x._code];
    
    x._identifiers = x.identifiers.filter(x => x.type !== 'GRSCICOLL_ID').map(x => x.identifier);
    let idUsages = [];
    x._identifiers.forEach(identifier => {
      let usages = getOccurrenceUsageFromId[identifier];
      if (!usages) usages = [];
      idUsages.push(...usages);
    });
    x._occurrenceIdentiferUsages = _.uniqBy(idUsages, 'key');
  });
  helpers.saveJson(inst, './duplicates/data/instNormalized.json');


  // const wordMap = {};
  // inst.forEach(x => {
  //   const words = x._simplified.split(' ');
  //   words.forEach(y => {
  //     wordMap[y] = wordMap[y] ? wordMap[y]+1 : 1;
  //   });
  // });
  // var wordList = [];
  // Object.keys(wordMap).forEach(x => {
  //   wordList.push({count: wordMap[x], w: x});
  // });
  // wordList = _.sortBy(wordList, 'count');
  // console.log(JSON.stringify(wordList, null, 2));
}


// ====== registry colelctions ======== //
function decorate_coll() {
  coll.forEach(x => {
    //normalize name
    x._normalized = helpers.normalize(x.name);
    x._strippedAndNormalized = helpers.stripDiacrits(x._normalized);
    x._simplified = helpers.normalize(x._strippedAndNormalized, /\b(historie|history|natural|naturelle)\b/g);

    x._country = _.get(x, 'address.country') || _.get(x, 'mailingAddress.country');

    // extract a representative city as it could serve as a sanity check on matches
    x._city = _.get(x, 'address.city') || _.get(x, 'mailingAddress.city') || _.get(x, 'address.address') || _.get(x, 'mailingAddress.address');
    if (x._city) x._city = x._city.toLowerCase().trim();
    
    //normalize code
    x._code = x.code.toUpperCase();
  });
  helpers.saveJson(coll, './duplicates/data/collNormalized.json');
}

decorate_inst();
decorate_coll();