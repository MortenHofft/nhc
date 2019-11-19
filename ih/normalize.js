/*
To help matching, normalize the titles in vadious ways (removing stopwords and punctuation and sort words)

IH use free text country names, grbio use 2 letter country codes. 
Attempt to align them by matching IH to ISO codes.

Make all codes upper case.

make all cities lower case.
*/

const grbio = require('./data/grbioInstitutions.json');
const ih = require('./data/ihInstitutions_2019_11_19.json');
const countryNames = require('./data/countryNames.json');
const _ = require('lodash');
const fs = require('fs');

const countryLookup = {};
Object.keys(countryNames).forEach(x => {
  countryLookup[countryNames[x].toLowerCase()] = x;
});

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

//Ih use free text fields for country. So some normalization is needed to match it to a country code
let normalizeCountryNames = {
  "U.S.A.": "United States of America",
  "Russia": "Russian Federation",
  "U.K.": "United Kingdom",
  "People's Republic of China": "China",
  "Republic of Korea": "Korea, Republic of",
  "Vietnam": "Viet nam",
  "Venezuela": "Venezuela, Bolivarian Republic of",
  "Czech Republic": "Czechia",
  "Bolivia": "Bolivia, Plurinational State of",
  "Iran": "Iran, Islamic Republic Of",
  "Tanzania": "Tanzania, United Republic of",
  "Congo Republic (Congo-Brazzaville)": "Congo",
  "Republic of Palau": "Palau",
  "Trinidad": "Trinidad and Tobago",
  "São Tomé e Príncipe": "Sao Tome and Principe",
  "Ivory Coast": "Côte d’Ivoire",
  "Democratic Republic of the Congo": "Congo, The Democratic Republic of the",
  "United States": "United States of America",
  "Moldova": "Moldova, Republic of",
  "Macedonia": "North Macedonia",
  "Republic of Congo-Brazzaville": "Congo",
  "Türkiye": "Turkey",
  "Laos": "Lao People’s Democratic Republic",
  "Swaziland": "Eswatini",
  "Espanya": "Spain",
  "Republic of Guinea": "Guinea",
  "Falkland Islands": "Falkland Islands (Malvinas)",
  "île de La Réunion": "Réunion",
  "Guam, U.S.A.": "Guam",
  "Alderney": "Guernsey",
  "Palestinian Territories": "Palestine, State of",
  "Republic of South Korea": "Korea, Republic of",
  "Av. Santa Fe 3951": "Argentina",
}

// let wordFrequency = {};
// ih.forEach(x => {
//   let n = normalize(x.organization || '');
//   let words = n.split(' ');
//   words.forEach(w => {
//     wordFrequency[w] = wordFrequency[w] ? ++wordFrequency[w] : 1;
//   })
// });
// console.log(_.sortBy(Object.keys(wordFrequency).map(w => {return {w: w, c: wordFrequency[w]}}), x => -x.c));

ih.forEach(x => {
  //normalize name
  x._normalized = normalize(x.organization);
  x._strippedAndNormalized = stripDiacrits(normalize(x._normalized, /\b(university|museum|college|institute|universidad|research|natural)\b/g)); // remove words that appear more than 150 times in IH

  //ih is using free text country names - try to match it to a 2 letter iso code
  let ihCountry = _.get(x, 'address.physicalCountry') || _.get(x, 'address.postalCountry');
  if (ihCountry) {
    ihCountry = normalizeCountryNames[ihCountry] || ihCountry;
    x._country = countryLookup[ihCountry.toLowerCase().trim()];
  }
  x._city = _.get(x, 'address.physicalCity') || _.get(x, 'address.postalCity');
  if (x._city) x._city = x._city.toLowerCase();
  
  x._code = x.code.toUpperCase();
});
saveJson(ih, './ih/data/ihNormalized.json');

grbio.forEach(x => {
  x._normalized = normalize(x.name);
  x._strippedAndNormalized = stripDiacrits(normalize(x._normalized, /\b(university|museum|college|institute|universidad|research|natural)\b/g)); // remove words that appear more than 150 times in IH

  x._country = _.get(x, 'address.country') || _.get(x, 'mailingAddress.country');
  x._city = _.get(x, 'address.city') || _.get(x, 'mailingAddress.city');
  if (x._city) x._city = x._city.toLowerCase();
});
saveJson(grbio, './ih/data/grbioNormalized.json');

// check for duplicate codes in IH - there shouldn't be any, but at times there will be
console.log('Has duplicate codes:', _.uniqBy(ih, 'code').length !== ih.length);