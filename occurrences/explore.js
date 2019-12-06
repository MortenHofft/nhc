const grbio = require('./data/grbioNormalized.json');
const institutionsStart = require('./tmp/candidatesFuzzy.json');
const institutions2 = require('./tmp/matching2.json');
const alreadyHasId = require('./tmp/alreadyHasId.json');
// const datasetTags = require('./tmp/datasetTags.json');
const confirmedPublisherCodeMatches = require('./tmp/confirmedPublisherCodeMatches.json');
const _ = require('lodash');
const fs = require('fs');
const lookups = require('./getLookups');
const log = console.log;
const chalk = require('chalk');

function saveJson(o, name) {
  fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

function test() {
  let inst = _.sortBy(institutions, x => -x.occurrences);
  // let inst = _.sortBy(_.uniqBy(institutions.filter(x => x.occurrences > 0), x => `${x.publishingorgkey}_${x.institutioncode}`), x => -x.occurrences);

  let matched = [];

  inst.forEach(x => {
    //filter for this query
    let intersection = _.intersection(x._codeMatches);
    if (x.matchTo) return;
    if (x._blocked) return;

    // if (!confirmedPublisherCodeMatches[`${x.publishingorgkey}_${x.institutioncode}`]) return;

    if (intersection.length === 0) {
      // let grbio = lookups.grbioMap[intersection[0]];
      // if (!x.publisherCity && x.publisherCity !== grbio._city && !grbio._city) return;
      // if (!confirmedPublisherCodeMatches[`${x.publishingorgkey}_${grbio.code}`]) return;

      matched.push(x);
      // confirmedPublisherCodeMatches[`${x.publishingorgkey}_${grbio.code}`] = true;
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  // log(datasetTags);
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(inst.filter(x => x.matchTo), 'occurrences'));
}

function step1(institutions) {
  let inst = _.sortBy(institutions, x => -x.occurrences);
  let matched = [];
  inst.forEach(x => {
    //filter for this query
    let intersection = _.intersection(x._codeMatches, x._publisherMatches, x._countryCodeMatches);
    if (x.matchTo) return;
    if (x._blocked) return;

    if (intersection.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(inst.filter(x => x.matchTo), 'occurrences'));
  saveJson(inst, './occurrences/tmp/matching2.json');
}

function step2(institutions) {
  let inst = _.sortBy(institutions, x => -x.occurrences);
  let matched = [];
  inst.forEach(x => {
    //filter for this query
    let intersection = _.intersection(x._codeMatches, x._datasetMatches, x._countryCodeMatches);
    if (x.matchTo) return;
    if (x._blocked) return;

    if (intersection.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(inst.filter(x => x.matchTo), 'occurrences'));
  saveJson(inst, './occurrences/tmp/matching2.json');
}

function step3(institutions) {
  let inst = _.sortBy(institutions, x => -x.occurrences);
  let matched = [];
  inst.forEach(x => {
    //filter for this query
    let intersection = _.intersection(x._codeMatches, x._fuzzyMatchPerfect, x._countryCodeMatches);
    if (x.matchTo) return;
    if (x._blocked) return;

    if (intersection.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(inst.filter(x => x.matchTo), 'occurrences'));
  saveJson(inst, './occurrences/tmp/matching2.json');
}

function step4(institutions) {
  let inst = _.sortBy(institutions, x => -x.occurrences);
  let matched = [];
  inst.forEach(x => {
    //filter for this query
    let intersection = _.intersection(x._codeMatches, x._fuzzyMatchGood, x._countryCodeMatches);
    if (x.matchTo) return;
    if (x._blocked) return;

    if (intersection.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(inst.filter(x => x.matchTo), 'occurrences'));
  saveJson(inst, './occurrences/tmp/matching2.json');
}

function step5(institutions) {
  let inst = _.sortBy(institutions, x => -x.occurrences);
  let matched = [];
  inst.forEach(x => {
    //filter for this query
    let intersection = _.intersection(x._codeMatches, x._fuzzyMatchWeak, x._countryCodeMatches);
    if (x.matchTo) return;
    if (x._blocked) return;

    if (intersection.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(inst.filter(x => x.matchTo), 'occurrences'));
  saveJson(inst, './occurrences/tmp/matching2.json');
}

function step6(institutions) {
  let inst = _.sortBy(institutions.filter(x => x.occurrences > 50), x => -x.occurrences);
  let matched = [];
  inst.forEach(x => {
    //filter for this query
    let intersection = _.intersection(x._codeMatches, x._countryCityMatches, x._countryCodeMatches);
    if (x.matchTo) return;

    if (x.datasetkey === 'e316afc7-2ec6-45e6-b48e-8d06d56772b0' && x.institutioncode === 'ROM') {
      x._blocked = true;
    }
    if (x._blocked) return;

    if (intersection.length === 1 && x._codeMatches.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(inst.filter(x => x.matchTo), 'occurrences'));
  saveJson(inst, './occurrences/tmp/matching2.json');
}

function step7(institutions) {
  let matched = [];
  institutions.forEach(x => {
    if (x.occurrences < 50) return;
    //filter for this query
    let intersection = _.intersection(x._codeMatches, x._countryCityMatches, x._countryCodeMatches);
    if (x.matchTo) return;
    if (x._blocked) return;

    if (intersection.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(institutions.filter(x => x.matchTo), 'occurrences'));
  saveJson(institutions, './occurrences/tmp/matching2.json');
}

function step8(institutions) {
  let matched = [];
  institutions.forEach(x => {
    //filter for this query
    if (x.occurrences < 500000) return;
    let intersection = _.intersection(x._codeMatches, x._countryCodeMatches);
    if (x.matchTo) return;
    if (x._blocked) return;

    if (intersection.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(institutions.filter(x => x.matchTo), 'occurrences'));
  saveJson(institutions, './occurrences/tmp/matching2.json');
}

function step9(institutions) {
  let matched = [];
  institutions.forEach(x => {
    //filter for this query
    if (x.occurrences < 100000) return;
    let intersection = _.intersection(x._codeMatches, x._countryCodeMatches);
    if (x.matchTo) return;

    if (x.datasetkey === 'beed1b50-8c73-11dc-aaed-b8a03c50a862' && x.institutioncode === 'CSIRO') {
      x._blocked = true; //this one is a bit tricky. It is clearly what they intended, but the GrBio entry claims that it only deals with fish.
    }
    if (x.datasetkey === 'e36d0997-2f51-4718-b684-16ec092ecd82' && x.institutioncode === 'UA') {
      x._blocked = true;//publisher: University of Arizona Insect Collection 	 grscicoll: University of Alabama
    }

    if (x._blocked) return;

    if (intersection.length === 1 && x._codeMatches.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(institutions.filter(x => x.matchTo), 'occurrences'));
  saveJson(institutions, './occurrences/tmp/matching2.json');
}

function step10(institutions) {
  let matched = [];
  institutions.forEach(x => {
    //filter for this query
    if (x.occurrences < 100000) return;
    let intersection = _.intersection(x._codeMatches);
    if (x.matchTo) return;
    if (x._blocked) return;

    if (x._codeMatches && x._codeMatches.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      log(chalk.yellow(x.datasetTitle), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.yellow(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(institutions.filter(x => x.matchTo), 'occurrences'));
  saveJson(institutions, './occurrences/tmp/matching2.json');
}

function step11(institutions) {
  let matched = [];
  institutions.forEach(x => {
    //filter for this query
    if (x.occurrences < 50000) return;
    let intersection = _.intersection(x._publisherMatches);
    if (x.matchTo) return;
    if (x._blocked) return;

    if (!x._codeMatches && x._publisherMatches && x._publisherMatches.length === 1) {
      let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
      x.matchTo = grbio.key;
      x.matchfromCode = x.institutioncode;
      log(chalk.yellow(x.datasetTitle), chalk.green(x.institutioncode), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.green(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(institutions.filter(x => x.matchTo), 'occurrences'));
  saveJson(institutions, './occurrences/tmp/matching2.json');
}

function step12(institutions) {
  let matched = [];
  institutions.forEach(x => {
    //filter for this query
    if (x.occurrences < 100000) return;
    let union = _.union(x._publisherMatches, x._datasetMatches, x._fuzzyMatchPerfect, x._fuzzyMatchGood, x._fuzzyMatchWeak);
    if (x.matchTo) return;
    if (x._blocked) return;

    if (union.length >= 1) {
    //   let grbio = lookups.grbioMap[intersection[0]];
      matched.push(x);
    //   x.matchTo = grbio.key;
    //   x.matchfromCode = x.institutioncode;
      log(chalk.yellow(x.datasetTitle), chalk.green(x.institutioncode), '\t', chalk.red(x.publisherTitle), '\t', chalk.blue(grbio.name), '\t', chalk.green(grbio.code), '\t', chalk.green(x.occurrences));
    }
  });
  log(_.sumBy(matched, 'occurrences'));
  log(_.uniqBy(matched, 'publishingorgkey').length);
  log(_.sumBy(institutions.filter(x => x.matchTo), 'occurrences'));
  // saveJson(institutions, './occurrences/tmp/matching2.json');
}

// step1(institutionsStart);
// step2(institutions2);
// step3(institutions2);
// step4(institutions2);
// step5(institutions2);
// step6(institutions2);
// step7(institutions2);
// step8(institutions2);
// step9(institutions2);
// step10(institutions2);
// step11(institutions2);
step12(institutions2);

// log(_.sumBy(institutions2.filter(x => !x.matchTo), 'occurrences'));