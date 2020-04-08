const idig = require('./data/idigbio.json');
const inst = require('./data/grbioInstitutions.json');
const coll = require('./data/grbioCollections.json');
const _ = require('lodash');
const helpers = require('./helpers');
const chalk = require('chalk');
const log = console.log;


// helpers
function getIrnFromIdentifiers(obj) {
  const ihIdentifier = _.get(obj, 'identifiers', []).find(x => x.type === 'IH_IRN');
  if (ihIdentifier) {
    const irnIdentifier = _.get(ihIdentifier, 'identifier', '').substr(12);
    return irnIdentifier;
  }
}

// ====== idigbio ======== //
function decorate_idigbio() {
  idig.forEach(x => {
    //normalize institution name
    x._normalizedInst = helpers.normalize(x.institution);
    x._strippedAndNormalizedInst = helpers.stripDiacrits(x._normalizedInst);

    //normalize collection name
    x._normalizedColl = helpers.normalize(x.collection);
    x._strippedAndNormalizedColl = helpers.stripDiacrits(x._normalizedColl);

    // extract a representative city as it could serve as a sanity check on matches
    x._city = _.get(x, 'physical_city') || _.get(x, 'mailing_city');
    if (x._city) x._city = x._city.toLowerCase();
    
    //normalize code
    x._instCode = x.institution_code.toUpperCase().replace('<IH>', '');
    x._collCode = x.collection_code.toUpperCase().replace('<IH>', '');

    //extract irn if available
    x._irn = _.get(x, 'sameAs', '').substr(x.sameAs.indexOf('irn=') + 4);
    if (x._irn === '') delete x._irn;

  });
  helpers.saveJson(idig, './idigbio/data/idigNormalized.json');
}

// ====== registry institutions ======== //
function decorate_inst() {
  inst.forEach(x => {
    //normalize name
    x._normalized = helpers.normalize(x.name);
    x._strippedAndNormalized = helpers.stripDiacrits(x._normalized);

    // extract a country. I assume all idigbio entries should be US collections
    x._country = _.get(x, 'address.country') || _.get(x, 'mailingAddress.country');

    // extract a representative city as it could serve as a sanity check on matches
    x._city = _.get(x, 'address.city') || _.get(x, 'mailingAddress.city');
    if (x._city) x._city = x._city.toLowerCase();
    
    //normalize code
    x._code = x.code.toUpperCase();

    //make IRN a easily readable property
    x._irn = getIrnFromIdentifiers(x);

    //flatten identifiers to an array of string to easy matching
    x._identifiers = x.identifiers.filter(x => x.type !== 'GRSCICOLL_ID').map(x => x.identifier);
  });
  instFiltered = inst.filter(x => !x._country || x._country === 'US');
  helpers.saveJson(instFiltered, './idigbio/data/instNormalized.json');
}


// ====== registry colelctions ======== //
function decorate_coll() {
  coll.forEach(x => {
    //normalize name
    x._normalized = helpers.normalize(x.name);
    x._strippedAndNormalized = helpers.stripDiacrits(x._normalized);

    // extract a country. I assume all idigbio entries should be US collections
    x._country = _.get(x, 'address.country') || _.get(x, 'mailingAddress.country');

    // extract a representative city as it could serve as a sanity check on matches
    x._city = _.get(x, 'address.city') || _.get(x, 'mailingAddress.city');
    if (x._city) x._city = x._city.toLowerCase();
    
    //normalize code
    x._code = x.code.toUpperCase();

    //make IRN a easily readable property
    x._irn = getIrnFromIdentifiers(x);

    //flatten identifiers to an array of string to easy matching
    x._identifiers = x.identifiers.filter(x => x.type !== 'GRSCICOLL_ID').map(x => x.identifier);
  });
  helpers.saveJson(coll, './idigbio/data/collNormalized.json');
}

decorate_idigbio();
decorate_inst();
decorate_coll();