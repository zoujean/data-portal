import { ARRANGER_API } from '@arranger/components/dist/utils/config';
import urlJoin from 'url-join';
import { get, pick } from 'lodash';
import { params } from '../data/parameters';
import { paramByApp } from '../data/dictionaryHelper';
import columnsToGraphql from '@arranger/mapping-utils/dist/utils/columnsToGraphql';

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

export const fetchData = (projectId) => {
  let arrangerConfig = paramByApp(params, 'arrangerConfig');
  let fields = arrangerConfig ? arrangerConfig.filters.tabs.map(tab => tab.fields).flat() : [];
  return options => {
    console.log('options', options)
    let newOptions = {
      ...options,
      config: {
        ...options.config,
        columns: options.config.columns.filter(col => fields.includes(col.field)),
        defaultSorted: {
          id: 'project_id',
          desc: false,
        }
      },
    }
    console.log('newOptions', newOptions)
    return api({
      endpoint: `/${projectId}/graphql`,
      body: columnsToGraphql(newOptions),
    }).then(r => {
      console.log('r', r);
      const hits = get(r, `data.${options.config.type}.hits`) || {};
      const data = get(hits, 'edges', []).map(e => e.node);
      const total = hits.total || 0;
      console.log('table data', total, data)
      return { total, data };
    });
  };
};

export const api = ({ endpoint = '', body, headers }) => {
  let arrangerConfig = paramByApp(params, 'arrangerConfig');
  arrangerConfig = arrangerConfig ? arrangerConfig.filters.tabs.map(tab => tab.fields).flat() : null;
  if (fieldVariablesInBody(body, arrangerConfig)) {
    let fields = body.fields ? body.fields.split('\n') : body.variables.fields;
    fields = fields.filter(field => arrangerConfig.includes(field));
    if (body.fields) {
      body.fields = fields.join('\n');
    } else {
      body.variables.fields = fields;
    }
  }

  if (body.variables && body.variables.sort) {
    body.variables.sort = {field: "project_id", order: "asc"}
  }
  const promiseList = projects.map(proj => {
    console.log('looking at project', proj, 'for endpoint', endpoint);
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
      console.log('jsonList', jsonList);
      return _.merge({}, ...jsonList);
    }
  );
};
