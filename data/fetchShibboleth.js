/**
 * Fetch the list of available InCommon IDPs
 */
const fs = require('fs');
const { fetchJson } = require('./utils');

const shibUrl = 'https://login.bionimbus.org/Shibboleth.sso/DiscoFeed';
const shibPath = `${__dirname}/shibboleth.json`;

fetchJson(shibUrl).then(
  (data) => {
    // save to local file
    fs.writeFileSync(shibPath, JSON.stringify(data, null, 2));
  },
).then(
  () => {
    console.log('All done!');
    process.exit(0);
  },
  (err) => {
    console.error('Error: ', err);
    process.exit(2);
  },
);
