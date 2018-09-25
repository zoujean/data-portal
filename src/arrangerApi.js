import { ARRANGER_API } from '@arranger/components/dist/utils/config';
import urlJoin from 'url-join';
import { params } from '../data/parameters';
import { paramByApp } from '../data/dictionaryHelper';

/* File from @arranger node module - customized to pass additional params in fetch request */

export const getCookie = name => {
  if (!document.cookie) {
    return null;
  }
  const xsrfCookies = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(name + '='));
  if (xsrfCookies.length === 0) {
    return null;
  }
  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
}

const alwaysSendHeaders = { 'Content-Type': 'application/json' };
const tokenHeaders = (csrf, authToken) => {
  return { 'X-CSRF-Token': csrf, 'Authorization': `bearer ${authToken}` };
}

let urls = {
  bhc: 'https://qa-brain.planx-pla.net/api/v0/flat-search',
  dcp: 'https://qa-dcp.planx-pla.net/api/v0/flat-search',
};

let projects = [
  'bhc',
  'dcp',
];

const api = ({ endpoint = '', body, headers }) => {
  let data = [];
  let config = paramByApp(params, 'arrangerConfig');
  console.log('current body', body);
  config = config ? config.filters.tabs.map(tab => tab.fields).flat() : null;
  if (body && (body.fields || (body.variables && body.variables.fields)) && config) {
    console.log('changing fields in body')
    let fields = body.fields ? body.fields.split('\n') : body.variables.fields;
    fields = fields.filter(field => config.includes(field));
    console.log('fields are', fields)
    if (body.fields) {
      console.log('changing body.fields')
      body.fields = fields.join('\n');
    } else {
      console.log('changing body.variables.fields')
      body.variables.fields = fields;
    }
  }
  console.log('new body', body);
  projects.forEach(proj => {
    let json = fetch(urlJoin(urls[proj], endpoint), {
        method: 'POST',
        headers: {
          ...alwaysSendHeaders,
          ...tokenHeaders(
              sessionStorage.getItem(`${proj}Csrf`),
              sessionStorage.getItem(`${proj}Token`)
            ),
          ...headers
        },
        body: JSON.stringify(body),
        credentials: 'include',
    }).then(r => r.json());
    data.push(json);
  })
  console.log('total data', data);
  return data[0];
};

export default api;
