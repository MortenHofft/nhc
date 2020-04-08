const axios = require('axios');
const fs = require('fs');

function saveJson(o, name) {
  fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {

    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}

async function getGrBioInstitutions() {
  let results = [];
  for (var i = 0; i < 12; i++) {
    let response = await axios.get('http://api.gbif.org/v1/grscicoll/institution?limit=1000&offset=' + i * 1000);
    results = results.concat(response.data.results);
  }
  saveJson(results, './duplicates/data/grbioInstitutions.json');
}

async function getGrBioCollections() {
  let results = [];
  for (var i = 0; i < 2; i++) {
    let response = await axios.get('http://api.gbif.org/v1/grscicoll/collection?limit=1000&offset=' + i * 1000);
    results = results.concat(response.data.results);
  }
  saveJson(results, './duplicates/data/grbioCollections.json');
}

getGrBioInstitutions();
getGrBioCollections();