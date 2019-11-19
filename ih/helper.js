const _ = require('lodash');

// Create lookup maps
function ensureUnique(ihRecords) {
  let hasEntry = _.filter(ihRecords, '_grbioEquivalent');
  console.log('Matched records in total', hasEntry.length);
  let noReusedCodes = _.uniqBy(hasEntry, '_grbioEquivalent').length === hasEntry.length;
  if (!noReusedCodes) {
    console.log('At least two IH records are referencing the same grbio entry');
    let diff = _.differenceBy(hasEntry, _.uniqBy(hasEntry, '_grbioEquivalent'), 'irn');
    console.log(diff.map(x => x._grbioEquivalent));
  }
}

module.exports = {
  ensureUnique,
}