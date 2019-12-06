const institutions = require('./tmp/noId.json');
const _ = require('lodash');
const fs = require('fs');
const log = console.log;

function saveJson(o, name) {
  fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

let inst = institutions.filter(x => x.institutioncode !== 'Pangaea');

saveJson(inst, './occurrences/tmp/noPangaea.json');