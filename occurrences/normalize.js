const institutions = require('./tmp/institutionsHosts.json');
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

function normalize(a, stopwordsPattern) {
  stopwordsPattern = stopwordsPattern || /\b(the|to|from|of|de|and)\b/g;
  a = a.toLowerCase().replace(/[,.|/)(]/g, ' ').replace(stopwordsPattern, ' ').replace(/\s\s+/g, ' ');
  a = a.split(' ').sort().join(' ').trim();
  return a;
}

function stripDiacrits(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

institutions.forEach(x => {
  x._normalizedDataset = normalize(x.datasetTitle);
  x._normalizedPublisher = normalize(x.publisherTitle);
  x._strippedAndNormalizedDataset = stripDiacrits(normalize(x._normalizedDataset, /\b(university|museum|college|institute|universidad|research|natural)\b/g)); // remove words that appear more than 150 times in IH
  x._strippedAndNormalizedPublisher = stripDiacrits(normalize(x._normalizedPublisher, /\b(university|museum|college|institute|universidad|research|natural)\b/g)); // remove words that appear more than 150 times in IH

  if (x.publisherCity) x.publisherCity = x.publisherCity.toLowerCase();
});
saveJson(institutions, './occurrences/tmp/normalized.json');
