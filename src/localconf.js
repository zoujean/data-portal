const dev = (process.env.NODE_ENV && process.env.NODE_ENV == 'dev');
const mock_store = (process.env.MOCK_STORE && process.env.MOCK_STORE == 'true');

const app = (process.env.APP === undefined) ? 'bpa' : process.env.APP;
const basename = (process.env.BASENAME === undefined) ? '/' : process.env.BASENAME;
let hostname, userapi_path, submissionapi_path, submissionapi_oauth_path, credential_path, credential_oauth_path, graphql_path, appname, nav_items, login;

if (app === 'bpa'){
  hostname = dev === true ? 'http://api.bloodpac-data.org/' : 'https://data.bloodpac.org/';
  userapi_path = hostname + 'user/';
  submissionapi_path = hostname + 'api/v0/submission/';
  submissionapi_oauth_path = hostname + 'api/v0/oauth2/';
  credential_path = hostname + 'middleware/aws/v0/';
  credential_oauth_path = hostname + 'middleware/oauth2/v0/';
  graphql_path = hostname + 'api/v0/submission/graphql/';
  appname = 'BPA Metadata Submission Portal';
  nav_items = [
    {'icon': 'fui-home', 'link': '/', 'color': '#a2a2a2'},
    {'icon': 'fui-search', 'link': '/graphql', 'color': '#daa520'},
    {'icon': 'fui-bookmark', 'link': '/DD', 'color': '#a2a2a2'},
  ]
  login = {
    url: userapi_path + 'login/google' + '?redirect=',
    title: 'Login from Google'
  }

}

else {
  hostname = dev === true ? 'http://api.bloodpac-data.org/' : 'https://bionimbus-pdc.opensciencedatacloud.org/';
  userapi_path = hostname + 'api/';
  credential_path = userapi_path + 'credentials/cleversafe/';
  credential_oauth_path = userapi_path + 'oauth2/';
  appname = 'GDC Jamboree Portal';
  nav_items = [
    {'icon': 'fui-home', 'link': '/', 'color': '#a2a2a2'},
  ]
  login = {
    url: "https://itrusteauth.nih.gov/affwebservices/public/saml2sso?SPID=https://bionimbus-pdc.opensciencedatacloud.org/shibboleth&RelayState=",
    title: 'Login from NIH'
  }
}

export {dev, mock_store, app, basename, hostname, userapi_path, submissionapi_path, submissionapi_oauth_path, credential_path, credential_oauth_path, graphql_path, appname, nav_items, login};
