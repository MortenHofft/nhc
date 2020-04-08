const axios = require('axios');
const fs = require('fs');
const idig = require('./data/idigCommits.json');

function saveJson(o, name) {
  try{
    fs.writeFileSync(name, JSON.stringify(o, null, 2));
    console.log("The file was saved!");
  } catch(err) {
    console.log('could not save');
    console.log(err);
  }
}

async function addComitDates() {
  for (var i = 0; i < idig.length; i++) {
    try {
      const uuid = idig[i].collection_uuid.substr(9);
      if (idig[i].modifiedDate) {
        console.log('skip');
        continue;
      }
      console.log('request ' + uuid);
      let response = await axios.get(`https://api.github.com/repos/iDigBio/idb-us-collections/commits?path=collections/${uuid}&page=1&per_page=1`, 
        { headers: {
          Authorization: 'Basic ' + new Buffer(`${username}:${password}`).toString('base64') 
        }
      });
      idig[i].modifiedDate = response.data[0].commit.author.date;
      idig[i].modifiedBy = response.data[0].commit.author.name;
    } catch(err) {
      console.error(err);
    }
    if (i%10 === 0) {
      saveJson(idig, './idigbio/data/idigCommits.json');
    }
  }
  saveJson(idig, './idigbio/data/idigCommits.json');
}

addComitDates();
