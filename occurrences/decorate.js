const axios = require('axios');
const fs = require('fs');
const _ = require('lodash');
const inst = require('./tmp/institutionsHosts');
const async = require('async');

function saveJson(o, name, cb) {
  fs.writeFile(name, JSON.stringify(o, null, 2), function (err) {

    if (err) {
      if (cb) cb(err);
      return console.log(err);
    }

    console.log(`The file "${name}" was saved!`);
    if (cb) cb(null);
  });
}

function addDatasets(institutions) {
  const distinctDatasetKeys = _.uniq(institutions.map(x => x.datasetkey));
  async.mapLimit(distinctDatasetKeys, 10, function (item, callback) {
    axios.get('http://api.gbif.org/v1/dataset/' + item)
      .then(function (response) {
        callback(null, response.data);
      })
      .catch(function (err) {
        callback(err);
      });
  }, function (err, results) {
    // if any of the saves produced an error, err would equal that error
    if (err) {
      console.log(err);
    } else {
      //we now have the individual datasets
      //transform the results into a lookup
      const datasetMap = _.keyBy(results, 'key');
      institutions.forEach(function (e, i) {
        e.datasetTitle = datasetMap[e.datasetkey].title;
      });
      saveJson(institutions, './occurrences/tmp/institutionsDatasets.json', x => {
        if (!x) addPublishers(institutions);
      })
    }
  });
}

function addPublishers(institutions) {
  const distinctPublisherKeys = _.uniq(institutions.map(x => x.publishingorgkey));
  async.mapLimit(distinctPublisherKeys, 10, function (item, callback) {
    axios.get('http://api.gbif.org/v1/organization/' + item)
      .then(function (response) {
        callback(null, response.data);
      })
      .catch(function (err) {
        callback(err);
      });
  }, function (err, results) {
    // if any of the saves produced an error, err would equal that error
    if (err) {
      console.log(err);
    } else {
      //we now have the individual datasets
      //transform the results into a lookup
      const publisherMap = _.keyBy(results, 'key');
      institutions.forEach(function (e, i) {
        const pub = publisherMap[e.publishingorgkey];
        e.publisherTitle = pub.title;
        e.publisherCountry = pub.country;
        e.publisherCity = pub.city;
        e.publisherPostalCode = pub.postalCode;
        e.publisherHomepage = _.get(pub, 'homepage[0]');
      });
      saveJson(institutions, './occurrences/tmp/institutionsPublishers.json', x => {
        if (!x) cleanUp(institutions);
      })
    }
  });
}

function cleanUp(institutions) {
  institutions.forEach(x => {
    if (x.institutioncode === 'NULL') delete x.institutioncode;
    if (x.institutionid === 'NULL') delete x.institutionid;
    if (x.publisherServer) delete x.publisherServer;
  });
  saveJson(institutions, './occurrences/tmp/institutionsCleaned2.json');
}

async function getHostNames(institutions) {
  const distinctUrls = _.uniq(institutions.filter(x => !x.publisherHost).filter(x => x.publisherHomepage).map(x => x.publisherHomepage));
  async.mapLimit(distinctUrls, 20, function (item, callback) {
    if (!item.startsWith('http')) item = 'http://' + item;
    console.log(item);
    axios.get(item, {
      timeout: 10000
    }).then(function (response) {
        callback(null, _.get(response, 'request.socket._host'));
      })
      .catch(function (err) {
        callback(null);
      });
  }, function (err, results) {
    // if any of the saves produced an error, err would equal that error
    if (err) {
      console.log(err);
    } else {
      //we now have the individual datasets
      //transform the results into a lookup
      const serverMap = _.zipObject(distinctUrls, results);
      console.log(serverMap);
      institutions.forEach(function (e, i) {
        if (serverMap[e.publisherHomepage]) e.publisherHost = serverMap[e.publisherHomepage];
      });
      saveJson(institutions, './occurrences/tmp/institutionsHosts.json');
    }
  });
}

cleanUp(inst);
//addDatasets(inst);
//getHostNames(inst);

// axios.get('http://ngpherbaria.org/portal/collections/misc/collprofiles.php?collid=205').then(x => {
//   console.log(x.request);
//   console.log(_.get(x, 'request.socket.servername'));
//   console.log(_.get(x, 'request.socket._host'));
// }).catch(err => {
//   console.log(err);
// });
