import urlJoin from 'url-join';
import { addDownloadHttpHeaders } from '@arranger/components/dist/utils/download';

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

let alwaysSendHeaders = { 'Content-Type': 'application/json' };
let csrf = getCookie('csrftoken');
let accessToken = getCookie('access_token')
let tokenHeaders = { 'X-CSRFToken': csrf, 'Authorization': accessToken}
const api = ({ endpoint = '', body, headers }) => {
  console.log('Hitting new endpoint');
  let json = fetch(urlJoin('https://abby.planx-pla.net/api/v0/flat-search', endpoint), {
    method: 'POST',
    headers: { ...alwaysSendHeaders, ...tokenHeaders, ...headers },
    body: JSON.stringify(body),
  }).then(r => r.json());
  console.log(json);
  return json;
};

export const graphql = body => api({ endpoint: 'graphql', body });

export const fetchExtendedMapping = ({ graphqlField, projectId }) =>
  api({
    endpoint: `/${projectId}/graphql`,
    body: {
      query: `
        {
          ${graphqlField}{
            extended
          }
        }
      `,
    },
  }).then(response => ({
    extendedMapping: response.data[graphqlField].extended,
  }));

export const addHeaders = headers => {
  alwaysSendHeaders = { ...alwaysSendHeaders, ...headers };
  addDownloadHttpHeaders(headers);
};

export const getAlwaysAddHeaders = () => alwaysSendHeaders;

export default api;
