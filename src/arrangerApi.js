import { ARRANGER_API } from '@arranger/components/dist/utils/config';
import urlJoin from 'url-join';

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
const csrf = getCookie('csrf');
const accessToken = sessionStorage.getItem('token');
const tokenHeaders = { 'Authorization': `Bearer ${accessToken}` };

const api = ({ endpoint = '', body, headers }) => fetch(urlJoin('https://qa-brain.planx-pla.net/api/v0/flat-search', endpoint), {
  method: 'POST',
  headers: {
    ...alwaysSendHeaders,
    ...tokenHeaders,
    ...headers
  },
  body: JSON.stringify(body),
  credentials: 'include',
}).then(r => r.json());

export default api;
