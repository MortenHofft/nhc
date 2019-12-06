const institutions = require('./tmp/codeOnly.json');
const _ = require('lodash');
const fs = require('fs');

function saveJson(o, name) {
  fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {

    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}

const hasId = x => {
  let institutionid = _.get(x, 'institutionid', '');
  let institutioncode = _.get(x, 'institutioncode', '');

  return institutioncode.indexOf('biocol.org') > -1 || 
    institutionid.indexOf('biocol.org') > -1 || 
    institutioncode.indexOf('grbio.org') > -1 ||
    institutionid.indexOf('grbio.org') > -1;
}
const withId = institutions.filter(hasId);
const noId = institutions.filter(x => !hasId(x));

saveJson(withId, './occurrences/tmp/alreadyHasId.json');
console.log(_.sumBy(withId, 'occurrences'));
saveJson(noId, './occurrences/tmp/noId.json');
