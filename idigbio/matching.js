const irnMatching = require('./matching/irnMatching');;
const identifierMatches = require('./matching/identifierMatches');;
const codeTitleMatches = require('./matching/codeTitleMatches');;
const codeCityMatches = require('./matching/codeCityMatches');;
const missingReport = require('./matching/missingReport');;
const titleNoCodeMatches = require('./matching/titleNoCodeMatches');;
const titleManualMatches = require('./matching/titleManualMatches');;
const manualMatches = require('./matching/manualMatches');;

irnMatching();
identifierMatches();
codeTitleMatches();
codeCityMatches();
titleNoCodeMatches();

// manually assesed
titleManualMatches();
manualMatches();

missingReport();