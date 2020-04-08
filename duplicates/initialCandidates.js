
/**
 * extract potential duplicates
 * 
 * result
 * grouped by code
 * grouped by exact title
 * grouped by normalized title
 * grouped by word overlaps
 * grouped by fuzzy titles
**/

const instNormalized = require('./data/instNormalized.json');
const collNormalized = require('./data/collNormalized.json');
const _ = require('lodash');
const helpers = require('./helpers');
const levenshtein = require('fast-levenshtein');
const getAsLookup = helpers.getAsLookup;

const instCodeMap = getAsLookup(instNormalized, '_code');
const instNameMap = getAsLookup(instNormalized, '_normalized');
const instNormNameMap = getAsLookup(instNormalized, '_strippedAndNormalized');
const instSimplifiedMap = getAsLookup(instNormalized, '_simplified');
const instCityMap = getAsLookup(instNormalized, '_city');
// const instCountryMap = getAsLookup(instNormalized, '_country');

const collCodeMap = getAsLookup(collNormalized, '_code');
const collNameMap = getAsLookup(collNormalized, '_normalized');
const collNormNameMap = getAsLookup(collNormalized, '_strippedAndNormalized');
const collCityMap = getAsLookup(collNormalized, '_city');
// const collCountryMap = getAsLookup(collNormalized, '_country');

// run through all IH records and attach grbio candidates
instNormalized.forEach(r => {
  r._nameDuplicates = _.filter(instNormNameMap[r._strippedAndNormalized], x => x !== r.key);
  if (r._simplified !== '') r._simpleNameDuplicates = _.filter(instSimplifiedMap[r._simplified], x => x !== r.key);
  r._codeDuplicates = _.filter(instCodeMap[r._code], x => x !== r.key);
  r._cityDuplicates =  _.filter(instCityMap[r._city], x => x !== r.key);
  // r._countryDuplicates =  _.filter(instCountryMap[r._country], x => x !== r.key);
  if (r._nameDuplicates.length === 0) delete r._nameDuplicates;
  if (r._simpleNameDuplicates && r._simpleNameDuplicates.length === 0) delete r._simpleNameDuplicates;
  if (r._codeDuplicates.length === 0) delete r._codeDuplicates;
  if (r._cityDuplicates.length === 0) delete r._cityDuplicates;
  // if (r._countryDuplicates.length === 0) delete r._countryDuplicates;
  delete r.contacts;
  delete r.identifiers;
});

// fuzzy name matches
instNormalized.forEach((r, index) => {
  let name = r._strippedAndNormalized;
  if (name) {
    let threshold = Math.ceil(name.length / 6);
    instNormalized.forEach((i, index2) => {
      if (index2 <= index) return; // To avoid double matching
      let instName = i._strippedAndNormalized;
      if (instName) {
        let distance = levenshtein.get(name, instName);
        if (distance <= threshold) {
          r._fuzzyNameDuplicates = r._fuzzyNameDuplicates ? r._fuzzyNameDuplicates.concat(i.key) : [i.key];
          i._fuzzyNameDuplicates = i._fuzzyNameDuplicates ? i._fuzzyNameDuplicates.concat(r.key) : [r.key];
        }
      }
    });
  }
});

// word overlap
instNormalized.forEach((r, index) => {
  let name = r._simplified.split(' ');
  if (name.length < 2) return;
  const overlap = {};
  instNormalized.forEach((i, index2) => {
    if (index2 === index) return; // No need to match against the same
    let otherName = i._simplified;
    const overlapArray = _.intersection(otherName.split(' '), name);
    const overlapSize = overlapArray.length;
    if (overlapSize === 0) return;
    if (overlapSize < 2) {
      if (!r._city || r._city !== i._city) return;
    }
    overlap[`wordOverlap_${overlapSize}`] = overlap[`wordOverlap_${overlapSize}`] || [];
    overlap[`wordOverlap_${overlapSize}`].push(i.key);
  });
  r._wordOverlap = overlap;
});

helpers.saveJson(instNormalized, './duplicates/data/initialCandidates.json');