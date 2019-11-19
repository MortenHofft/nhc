const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');
const _ = require('lodash');
const levenshtein = require('fast-levenshtein');
const grbioInstitutionDump = require('../data/grbio.json');
const ihMatched = require('../tmp/ihMatched.json');
const countryNames = require('../data/countryNames.json');
const grbioIhDump = require('./ih.json');
const fs = require('fs');

var app = express()

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

async function getGrBioInstitutions() {
  return grbioInstitutionDump;
  let results = [];
  for (var i = 0; i < 10; i++) {
    let response = await axios.get('http://api.gbif.org/v1/grscicoll/institution?limit=1000&offset=' + i * 1000);
    results = results.concat(response.data.results);
  }
  return results;
}

async function getIh() {
  return grbioIhDump.data;
  let response = await axios.get('http://labs.gbif.org/institutions');
  return response.data.data;
}

function normalize(a, stopwordsPattern) {
  stopwordsPattern = stopwordsPattern || /\b(the|to|from|of)\b/g;
  a = a.toLowerCase().replace(/[,.|/]/g, ' ').replace(stopwordsPattern, ' ').replace(/\s\s+/g, ' ');
  a = a.split(' ').sort().join(' ');
  return a;
}

function compareNames(a, b) {
  if (a == b) {
    return 'PERFECT';
  }
  let distance = levenshtein.get(a, b); // { useCollator: true} using the fancy comparison that tkaes diacrits etc into consideretation makes it very slow
  if (distance <= Math.ceil(a.length / 8)) return 'GOOD';
  if (distance <= Math.ceil(a.length / 6)) return 'MEDIUM';
  return 'POOR';
}

async function getTable() {
  return ihMatched;
  let institutions = await getGrBioInstitutions();
  let ihRecords = await getIh();

  //create code and title maps
  let codeLookup = {};
  let titleLookup = {};
  institutions.forEach(x => {
    if (x.code) {
      codeLookup[x.code] = codeLookup[x.code] ? codeLookup[x.code].concat(x.key) : [x.key]
    }
    if (x.name) {
      titleLookup[x.name] = titleLookup[x.name] ? titleLookup[x.name].concat(x.key) : [x.key]

      //normalize name
      x.normalizedName = normalize(x.name);
    }
  });

  // get a map to look up institutions by their key
  let institutionMap = _.keyBy(institutions, 'key');

  // attach institutions that share code
  ihRecords.forEach(r => {
    let codeMatches = codeLookup[r.code];
    if (codeMatches) r.codeMatches = codeMatches;

    let titleMatches = titleLookup[r.organization];
    if (titleMatches) r.titleMatches = titleMatches;

    if (codeMatches && codeMatches.length === 1) {
      r.codeMatch = codeMatches[0];
    }

    if (titleMatches && titleMatches.length === 1) {
      r.titleMatch = titleMatches[0];
    }

    if (r.titleMatch && r.titleMatch === r.codeMatch) {
      let grbioMatch = institutionMap[r.titleMatch];
      if (grbioMatch.indexHerbariorumRecord) {
        r.isAlreadyIhRecord = true;
      }
      let grbioCountryCode = _.get(grbioMatch, 'address.country') || _.get(grbioMatch, 'mailingAddress.country');
      let grbioCountry = countryNames[grbioCountryCode];
      let ihCountry = _.get(r, 'address.physicalCountry') || _.get(r, 'address.postalCountry');
      // grbioCountry = normalize(grbioCountry, /\b(the|to|republic|of|islamic)\b/g);
      // ihCountry = normalize(ihCountry, /\b(the|to|republic|of|islamic)\b/g);

      //synonyms
      if (ihCountry === 'U.S.A.') ihCountry = 'United States of America';
      if (ihCountry === 'Russia') ihCountry = 'Russian Federation';
      if (ihCountry === 'U.K.') ihCountry = 'United Kingdom';
      if (ihCountry === 'India') ihCountry = 'British Indian Ocean Territory';
      if (ihCountry === "People's Republic of China") ihCountry = 'China';
      if (ihCountry === "Republic of Korea") ihCountry = 'Korea, Republic of';
      if (ihCountry === "Vietnam") ihCountry = 'Viet nam';
      if (ihCountry === "Venezuela") ihCountry = 'Venezuela, Bolivarian Republic of';
      if (ihCountry === "Czech Republic") ihCountry = 'Czechia';
      if (ihCountry === "Bolivia") ihCountry = 'Bolivia, Plurinational State of';
      if (ihCountry === "Sudan") ihCountry = 'South Sudan';
      if (ihCountry === "Iran") ihCountry = 'Iran, Islamic Republic Of';
      if (ihCountry === "Tanzania") ihCountry = 'Tanzania, United Republic of';
      if (ihCountry === "Congo Republic (Congo-Brazzaville)") ihCountry = 'Congo';
      if (ihCountry === "Republic of Palau") ihCountry = 'Palau';
      if (ihCountry === "Trinidad") ihCountry = 'Trinidad and Tobago';
      if (ihCountry === "São Tomé e Príncipe") ihCountry = 'Sao Tome and Principe';
      if (ihCountry === "Ivory Coast") ihCountry = 'Côte d’Ivoire';
      if (ihCountry === "Democratic Republic of the Congo") ihCountry = 'Congo, The Democratic Republic of the';
      if (ihCountry === "United States") ihCountry = 'United States of America';
      if (ihCountry === "Moldova") ihCountry = 'Moldova, Republic of';
      if (ihCountry === "Macedonia") ihCountry = 'North Macedonia';
      if (ihCountry === "Republic of Congo-Brazzaville") ihCountry = 'Congo';

      if (grbioCountry && ihCountry && grbioCountry.toLowerCase() === ihCountry.toLowerCase()) {
        r.countryMatch = true;
      } else if(grbioCountry && ihCountry) {
        console.log();
        console.log(grbioCountry);
        console.log(ihCountry);
        console.log();
      }
    }
  });

  // // look for similar names
  // let count = 0;
  // ihRecords.forEach(r => {
  //   let ihName = r.organization;
  //   if (ihName) {
  //     console.log(count++);
  //     ihName = normalize(ihName);
  //     institutions.forEach(i => {
  //       let grbioName = i.normalizedName;
  //       if (grbioName) {
  //         let nameMatch = compareNames(ihName, grbioName);
  //         if (nameMatch !== 'POOR') {
  //           r.nameMatchQuality = nameMatch;
  //           r.nameMatches = r.nameMatches || [];
  //           r.nameMatches.push(i.key);
  //         }
  //       } 
  //     });
  //   }
  // });


  console.log(ihRecords.filter(x => x.codeMatch).length);
  console.log(ihRecords.filter(x => x.titleMatch).length);
  console.log(ihRecords.filter(x => x.countryMatch).length);
  console.log(ihRecords.filter(x => x.isAlreadyIhRecord && x.countryMatch).length);

  let results = ihRecords.map(x => {
    let item = {
      code: x.code,
      name: x.organization,
      country: _.get(x, 'address.physicalCountry') || _.get(x, 'address.postalCountry'),
      candidates: []
    }
    return item;
  });
  // saveJson(results, '3.json');
  return results;
}

async function getTransformed() {
  let institutions = await getGrBioInstitutions();
  let ihRecords = await getTable();
  let results = ihRecords.map(x => {
    let candidates = _.uniq(_.compact(_.concat([], x.codeMatches, x.titleMatches, x.nameMatches)));
    let item = {
      code: x.code,
      name: x.organization,
      country: _.get(x, 'address.physicalCountry') || _.get(x, 'address.postalCountry'),
      candidates: candidates
    }
    return item;
  });
  console.log(results);
}

let institutions = getTransformed();




// var jsonParser = bodyParser.json()

// app.get('/ih', function (req, res) {
//   institutions.then(institutions => {
//     res.json(institutions);
//   }).catch(err => {
//     console.log(err);
//   });
// })

// app.listen(3001)

/*
load and store data from APIs
create lookups with keys for codes, titles (and country and city?)
add normalized names for IH and grbio
enrich IH with candidates and add flags for each candidate telling how it qualifies
generate CSVs for manual inspection for those candidates that seem obvious 
  same name+code+country+ihStatus 
  same name+code
  similar name + same code

the rest will have to be manually inspected in more details.

things that help qualify a record:
same code, 
same or similar name, 
same city, 
is already IH record
same country

If name or code or (country and city) is the same, then it qualifies as a match. Additional flags are just a help.
*/