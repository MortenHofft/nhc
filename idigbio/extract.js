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
  saveJson(results, './idigbio/data/grbioInstitutions.json');
}

async function getGrBioCollections() {
  let results = [];
  for (var i = 0; i < 2; i++) {
    let response = await axios.get('http://api.gbif.org/v1/grscicoll/collection?limit=1000&offset=' + i * 1000);
    results = results.concat(response.data.results);
  }
  saveJson(results, './idigbio/data/grbioCollections.json');
}

async function getIDigBio() {
  // there is no known endpoint for idigbio collections at the moment
  // instead we use a dump scraped from there html
  // let response = await axios.get('http://sweetgum.nybg.org/science/api/v1/institutions');
  // saveJson(response.data.data, './ih/data/ihInstitutions.json');
}

getGrBioInstitutions();
getGrBioCollections();
// getIDigBio();