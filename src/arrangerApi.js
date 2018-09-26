import { ARRANGER_API } from '@arranger/components/dist/utils/config';
import urlJoin from 'url-join';
import { params } from '../data/parameters';
import { paramByApp } from '../data/dictionaryHelper';

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

const fieldVariablesInBody = (body, config) => {
  return body && config && (body.fields || (body.variables && body.variables.fields));
}

const api = ({ endpoint = '', body, headers }) => {
  let arrangerConfig = paramByApp(params, 'arrangerConfig');
  arrangerConfig = arrangerConfig ? arrangerConfig.filters.tabs.map(tab => tab.fields).flat() : null;
  console.log('original body', body);
  if (fieldVariablesInBody(body, arrangerConfig)) {
    console.log('changing body...');
    let fields = body.fields ? body.fields.split('\n') : body.variables.fields;
    fields = fields.filter(field => arrangerConfig.includes(field));
    if (body.fields) {
      body.fields = fields.join('\n');
    } else {
      body.variables.fields = fields;
    }
  }
  console.log('new body', body);
  const promiseList = projects.map(proj => {
    return fetch(urlJoin(urls[proj], endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...tokenHeaders(
              sessionStorage.getItem(`${proj}Csrf`),
              sessionStorage.getItem(`${proj}Token`)
            ),
          ...headers
        },
        body: JSON.stringify(body),
        credentials: 'include',
    }).then(r => r.json());
  });
  return Promise.all(promiseList).then(
    // case.aggsState.state, mapping
    // case.extended, aggregations
    // case.columnsState.state.columns
    // case.extended
    // case.hits

    (jsonList) => {
      let mergedJson = _.merge(...jsonList);
      console.log('mergedJson', mergedJson);
      return mergedJson;
    }
  );
};

export default api;
