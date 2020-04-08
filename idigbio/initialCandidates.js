const idig = require('./data/idigNormalized.json');
const instNormalized = require('./data/instNormalized.json');
const collNormalized = require('./data/collNormalized.json');
const _ = require('lodash');
const fs = require('fs');
const helpers = require('./helpers');
const levenshtein = require('fast-levenshtein');
const getAsLookup = helpers.getAsLookup;

const instCodeMap = getAsLookup(instNormalized, 'code');
const instNameMap = getAsLookup(instNormalized, 'name');
const instNormNameMap = getAsLookup(instNormalized, '_strippedAndNormalized');
const instCityMap = getAsLookup(instNormalized, '_city');
const instIrnMap = getAsLookup(instNormalized, '_irn');
const collIrnMap = getAsLookup(collNormalized, '_irn');

const collCodeMap = getAsLookup(collNormalized, 'code');
const collNameMap = getAsLookup(collNormalized, 'name');
const collNormNameMap = getAsLookup(collNormalized, '_strippedAndNormalized');
const collCityMap = getAsLookup(collNormalized, '_city');

// run through all IH records and attach grbio candidates
idig.forEach(r => {
  r._inst2instCode = instCodeMap[r._instCode];
  r._inst2collCode = collCodeMap[r._instCode];
  r._coll2instCode = instCodeMap[r._collCode];
  r._coll2collCode = collCodeMap[r._collCode];

  r._inst2instName = instNormNameMap[r._strippedAndNormalizedInst];
  r._instCityMatches = instCityMap[r._city];

  r._inst2collName = collNormNameMap[r._strippedAndNormalizedInst];
  
  r._irnInstMatches = instIrnMap[r._irn];
  r._irnCollMatches = collIrnMap[r._irn];
});

// fuzzy name matches
idig.forEach(r => {
  if (r._instNormNameMatches) return; // do not bother looking for a fuzzy match if we already have a good title match
  let idigInstName = r._strippedAndNormalizedInst;
  let threshold = Math.ceil(idigInstName.length / 5);
  if (idigInstName) {
    instNormalized.forEach(i => {
      let instName = i._strippedAndNormalized;
      if (instName) {
        let distance = levenshtein.get(idigInstName, instName);
        if (distance <= threshold) {
          r._fuzzyInst = r._fuzzyInst ? r._fuzzyInst.concat(i.key) : [i.key];
        }
      }
    });

    collNormalized.forEach(i => {
      let collName = i._strippedAndNormalized;
      if (collName) {
        let distance = levenshtein.get(idigInstName, collName);
        if (distance <= threshold) {
          r._fuzzyColl = r._fuzzyColl ? r._fuzzyColl.concat(i.key) : [i.key];
        }
      }
    });
  }
});

// word overlap
idig.forEach(r => {
  let idigInstName = r._strippedAndNormalizedInst.split(' ');
  if (idigInstName) {
    const overlap = {};
    instNormalized.forEach(i => {
      let instName = i._strippedAndNormalized;
      const overlapArray = _.intersection(instName.split(' '), idigInstName);
      const overlapSize = overlapArray.length;
      if (overlapSize === 0) return;
      if (overlapSize < 3) {
        if (r._city !== i._city) return;
      }
      overlap[`wordOverlap_${overlapSize}`] = overlap[`wordOverlap_${overlapSize}`] || [];
      overlap[`wordOverlap_${overlapSize}`].push(i.key);
    });
    r.wordOverlap = overlap;
  }
});

// get matches by identifiers
idig.forEach(r => {
  let identifier = r.collection_lsid;
  if (identifier) {
    r._identifier2inst = instNormalized.filter(i => i._identifiers.indexOf(identifier) > -1).map(x => x.key);
    // there are no grbio coll with useful identifiers aside from IRNs
  }
});

helpers.saveJson(idig, './idigbio/data/initialCandidates.json');