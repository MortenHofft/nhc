const grbio = require('./data/grbioNormalized.json');
const _ = require('lodash');

// Create lookup maps
function getAsLookup(collection, entryKey) {
  let m = {};
  collection.forEach(x => {
    m[x[entryKey]] = m[x[entryKey]] ? m[x[entryKey]].concat(x.key) : [x.key]
  });
  return m;
}
let grbioCodeLookup = getAsLookup(grbio, 'code');
let grbioTitleLookup = getAsLookup(grbio, 'name');
let grbioCountryLookup = getAsLookup(grbio, '_country');
let grbioCityLookup = getAsLookup(grbio, '_city');

// get a map to look up institutions by their key
let grbioMap = _.keyBy(grbio, 'key');

module.exports = {
  grbioCodeLookup,
  grbioTitleLookup,
  grbioCountryLookup,
  grbioCityLookup,
  grbioMap
}