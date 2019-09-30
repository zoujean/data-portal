const https = require('https');
const http = require('http');
const fetch = require('node-fetch');
const fs = require('fs');

/**
 * Little helper for loading a json file
 * @param {string} path
 * @return {status, data, error} parsed json in data - or {} if path does not exist or is not json
 */
function loadJsonFile(path) {
  try {
    const content = fs.readFileSync(path);
    return { status: 'ok', data: JSON.parse(content) };
  } catch (err) {
    // console.error( "Failed to load: " + path, err );
    return { status: 'error', error: err };
  }
}

const retryBackoff = [2000, 4000, 8000, 16000];

const httpAgent = new http.Agent({
  rejectUnauthorized: false,
});
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * Wrapper around fetch - retries call on 429 status
 * up to 4 times with exponential backoff
 *
 * @param {string} urlStr
 * @param {*} opts
 */
async function fetchJsonRetry(urlStr, opts) {
  let retryCount = 0;
  let doRequest = null; // for eslint happiness

  async function doRetry(reason) {
    if (retryCount > retryBackoff.length) {
      return Promise.reject(`failed fetch ${reason}, max retries ${retryBackoff.length} exceeded for ${urlStr}`);
    }

    return new Promise(((resolve) => {
      // sleep and try again ...
      const retryIndex = Math.min(retryCount, retryBackoff.length - 1);
      const sleepMs = retryBackoff[retryIndex] + Math.floor(Math.random() * 2000);
      retryCount += 1;
      console.log(`failed fetch - ${reason}, sleeping ${sleepMs} then retry ${urlStr}`);
      setTimeout(() => {
        resolve('ok');
        console.log(`Retrying ${urlStr} after sleep - ${retryCount}`);
      }, sleepMs);
    })).then(doRequest);
  }

  doRequest = async function () {
    if (retryCount > 0) {
      console.log(`Re-fetching ${urlStr} - retry no ${retryCount}`);
    }
    return fetch(urlStr, opts,
    ).then(
      (res) => {
        if (res.status === 200) {
          return res.json().catch(
            err => doRetry(`failed json parse - ${err}`),
          );
        }
        return doRetry(`non-200 from server: ${res.status}`);
      },
      err => doRetry(err),
    );
  };

  return doRequest();
}

async function fetchJson(url) {
  console.log(`Fetching ${url}`);
  return fetchJsonRetry(url, {
    agent: url.match(/^https:/) ? httpsAgent : httpAgent,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

module.exports = {
  loadJsonFile,
  fetchJson,
};
