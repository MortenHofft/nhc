// const csvFilePath = './institutions.csv';
// const csv = require('csvtojson');
const fs = require('fs');
const axios = require('axios');
const _ = require('lodash');
// const institutions = require('../data/institutions2.json');
const datasetTitles = require('../data/datasets.json');
const publisherTitles = require('../data/publishers.json');
const grbioInstitutions = require('../data/grbio.json');
const grbioIdentifierMap = require('../data/grbioIdentifierMap.json');
const grbioCodeMap = require('../data/grbioCodeMap.json');
const grbioTitleMap = require('../data/grbioTitleMap.json');
const institutions = require('../data/instgrBioMatches.json');

// const eachLimit = async (collection, limit, iteratorFunction) => {
//   let index = 0;
//   let result = [];
//   while (index < collection.length) {
//     try {
//       let results = await Promise.all(collection.slice(index, index + limit).map(iteratorFunction));
//       result = result.concat(results);
//       index += limit;
//       console.log(index);
//     } catch (err) {
//       return result;
//     }
//   }
//   return result
// }

function saveJson(o, name) {
  fs.writeFile("./tmp/" + name, JSON.stringify(o, null, 2), function (err) {

    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}

// csv()
//   .fromFile(csvFilePath)
//   .then((jsonObj) => {
//     console.log(jsonObj);
//     saveJson(jsonObj, 'institutions.json');
//     /**
//      * [
//      * 	{a:"1", b:"2", c:"3"},
//      * 	{a:"4", b:"5". c:"6"}
//      * ]
//      */
//   });

// let publishers = {};
// let datasets = {};
// institutions.forEach(x => {
//   datasets[x.datasetkey] = true;
//   publishers[x.publishingorgkey] = true;
// });

// console.log(Object.keys(publishers));

// async function attachDatasets(datasets) {
//   let results = await eachLimit(datasets, 10, d => { return datasetTitles[d] || axios.get('https://api.gbif.org/v1/dataset/' + d) });
//   let titles = {};

//   titles = datasetTitles;
//   results.forEach(x => {
//     if (x.data && x.data.key) titles[x.data.key] = x.data.title
//   });
//   saveJson(titles, 'datasets.json')
// }

// async function attachPublishers(publishers) {
//   let results = await eachLimit(publishers, 10, d => { return publisherTitles[d] || axios.get('https://api.gbif.org/v1/organization/' + d) });
//   let titles = {};

//   titles = publisherTitles;
//   results.forEach(x => {
//     if (x.data && x.data.key) titles[x.data.key] = x.data.title
//   });
//   saveJson(titles, 'publishers.json')
// }

// attachDatasets(Object.keys(datasets));
// attachPublishers(Object.keys(publishers));
// console.log(Object.keys(datasetTitles).length);


// institutions.forEach(x => {
//   x.datasetTitle = datasetTitles[x.datasetkey];
//   x.publisherTitle = publisherTitles[x.publishingorgkey];
// });
// saveJson(institutions, 'enriched.json');

// async function getinstitutions() {
//   let results = [];
//   for (var i = 0; i < 10; i++) {
//     let response = await axios.get('http://api.gbif.org/v1/grscicoll/institution?limit=1000&offset=' + i * 1000);
//     results = results.concat(response.data.results);
//     console.log(i);
//   }
//   saveJson(results, 'grbio.json');
// }
// getinstitutions();


// console.log(grbioInstitutions.length);

// // Create maps with codes and titles of grbio entities for fast lookup
// let grbioCodeMap = {};
// let grbioTitles = {};
// grbioInstitutions.forEach(x => {
//   if (x.code) {
//     grbioCodeMap[x.code] = grbioCodeMap[x.code] ? grbioCodeMap[x.code].concat({ key: x.key, name: x.name }) : [{ key: x.key, name: x.name }]
//   }
//   grbioTitles[x.key] = x.name;
// });
// saveJson(grbioCodeMap, 'codeMap.json');
// saveJson(grbioTitles, 'grbioTitleMap.json');

// // Sanity check - all identifiers should be unique in their namespace
// let identifiers = {};
// grbioInstitutions.forEach(i => {
//   if (i.identifiers) {
//     i.identifiers.forEach(x => {
//       if (identifiers[x.identifier]) {
//         console.log(JSON.stringify(x));
//         console.log('----------------');
//       }
//       identifiers[x.identifier] = true;
//     });
//   }
// });


// // Create identifiers map for grbio
// let identifiers = {};
// grbioInstitutions.forEach(i => {
//   if (i.identifiers) {
//     i.identifiers.forEach(x => {
//       if (identifiers[x.identifier]) {
//         console.log('same identifier used twice');
//       }
//       identifiers[x.identifier] = {key: i.key, name: i.name};
//     });
//   }
// });
// saveJson(identifiers, 'grbioIdentifierMap.json');




// let biocolRegex = /(biocol\.org:col:)[0-9]+$/g;
// function resolver(id) {
//   // var biocolFound = id.match(biocolRegex);
//   // if (biocolFound) {
//   //   let grbioId = id.match(/[0-9]+$/g)[0];
//   //   return grbioIdentifierMap[grbioId];
//   // }
//   return grbioIdentifierMap[id];
// }

// institutions.forEach(x => {
//   //remove NULLS
//   if (x.institutionid === 'NULL') delete x.institutionid;
//   if (x.institutioncode === 'NULL') delete x.institutioncode;
//   x.occurrences = Number(x.occurrences);

//   // Match by code ( could be multiple values)
//   if (x.institutioncode) {
//     x.grbioCodeMatch = grbioCodeMap[x.institutioncode];
//     if (x.grbioCodeMatch) x.codeMatches = x.grbioCodeMatch.length;
//   }
//   if (x.institutionid && x.institutionid !== x.institutioncode) {
//     x.grbioCodeMatch_fromId = grbioCodeMap[x.institutionid];
//     if (x.grbioCodeMatch_fromId) x.codeMatchesFromId = x.grbioCodeMatch_fromId.length;
//     if (x.grbioCodeMatch && x.grbioCodeMatch_fromId) x.conflictingCodes = true;
//   }
//   codeMatches = _.uniqBy(_.compact(_.concat(x.grbioCodeMatch, x.grbioCodeMatch_fromId)), 'key');

//   // Match by ID ( could be multiple values)
//   if (x.institutionid) {
//     x.grbioFromId = resolver(x.institutionid)
//   }
//   if (x.institutioncode && x.institutionid !== x.institutioncode) {
//     x.grbioFromCode = resolver(x.institutioncode)
//     if (x.grbioFromId && x.grbioFromCode && x.grbioFromCode !== x.grbioFromId) x.conflictingIDs = true;
//   }
//   idMatches = _.uniqBy(_.compact(_.concat(x.grbioFromId, x.grbioFromCode)), 'key');

//   // if there is 1 id match and no code match or at least one supporting code match then that is THE match.
//   if (idMatches.length === 1 && _.intersection([codeMatches, idMatches])) {
//     // x.exactMatch = _.uniqBy(_.compact(_.concat(x.grbioCodeMatch, x.grbioCodeMatch_fromId, x.grbioFromId, x.grbioFromCode)), 'key');
//     x.exactMatch = idMatches[0];
//   } else if (codeMatches.length === 1) {
//     x.exactMatch = codeMatches[0];
//   }

// });
// saveJson(_.sortBy(institutions, function(x){return -x.occurrences}), 'instGrBioMatches.json');


//Create table for unmatched
// let unmatched = [];
// let matched = [];
// institutions.forEach(x => {
//   if (x.exactMatch) {
//     matched.push(x);
//   } else if ( x.occurrences >= 100 && 
//               x.publishingorgkey !== 'b3bf3a83-1f68-4541-a03f-330d30d567f5' && 
//               x.publishingorgkey !== 'ab733144-7043-4e88-bd4f-fca7bf858880') {
//     unmatched.push(x);
//   }
// });
// saveJson(_.sortBy(matched, function(x){return -x.occurrences}), 'matched.json');
// saveJson(_.sortBy(unmatched, function(x){return -x.occurrences}), 'unmatched.json');

// let matchedGrBioEntities = new Set(institutions.filter(x => x.exactMatch).map(x => x.exactMatch.key));
// console.log(matchedGrBioEntities.size);

// enrich institutions with country for stats
let grbioCountryMap = {};
grbioInstitutions.forEach(x => {
  let country = _.get(x, 'address.country') || _.get(x, 'mailingAddress.country');
  if (country) {
    grbioCountryMap[x.key] = country;
  }
});

let grbioInstMap = _.keyBy(grbioInstitutions, 'key');
institutions.forEach(x => {
  if (x.exactMatch) {
    grbioInstMap[x.exactMatch.key].total = grbioInstMap[x.exactMatch.key].total || 0;
    grbioInstMap[x.exactMatch.key].total += x.occurrences;
  }
});

let matchedInstitutions = _.uniqBy(institutions.filter(x => x.exactMatch).map(x => {
  return {
    key: x.exactMatch.key, 
    country: grbioCountryMap[x.exactMatch.key],
    total: grbioInstMap[x.exactMatch.key].total
  }
}), 'key');
// console.log(new Set(matchedInstitutions.map(x => x.country)));
console.log(matchedInstitutions.length);
saveJson(_.sortBy(matchedInstitutions, x => -x.total), 'institutionCounts.json');