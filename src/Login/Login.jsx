import React from 'react';
import querystring from 'querystring';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import MediaQuery from 'react-responsive';
import Button from '@gen3/ui-component/dist/components/Button';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import { basename, loginPath, breakpoints } from '../localconf';
import { components } from '../params';

import SlidingWindow from '../components/SlidingWindow';
import './Login.less';

const getInitialState = height => ({ height });

const shouldDisplayInCommonOptions = url =>
  // If not logging in through another fence or if an IDP is already specified
  // in the URL, do not ask the user to choose which IDP to login with.
  // This way, we can configure a login button to be specific to an IDP,
  // for example NIH.
  url.includes('/login/fence') && !url.includes('idp=');

const getLoginUrl = (baseLoginUrl, next, shibIdp = null) => {
  let queryParams = baseLoginUrl.includes('?') ? '&' : '?';
  queryParams += `redirect=${window.location.origin}${next}`;
  if (shibIdp && shouldDisplayInCommonOptions(baseLoginUrl)) {
    // Fence multi-tenant/InCommon login
    queryParams += `&idp=shibboleth&shib_idp=${shibIdp}`;
  }
  return baseLoginUrl + queryParams;
};

const getInCommonOptions = () => {
  // TODO url should be in config
  // fetch("https://login.bionimbus.org/Shibboleth.sso/DiscoFeed")
  const discofeedRes = [
    {
      entityID: 'urn:mace:incommon:uchicago.edu',
      DisplayNames: [
        {
          value: 'University of Chicago',
          lang: 'en',
        },
      ],
    },
    {
      entityID: 'https://shibboleth.umich.edu/idp/shibboleth',
      DisplayNames: [
        {
          value: 'University of Michigan',
          lang: 'en',
        },
      ],
    },
    {
      entityID: 'https://shib.ou.edu/idp/shibboleth',
      DisplayNames: [
        {
          value: 'Université d\'Oklahoma',
          lang: 'fr',
        },
        {
          value: 'University of Oklahoma',
          lang: 'en',
        },
      ],
    },
    {
      entityID: 'urn:mace:incommon:nih.gov',
      DisplayNames: [
        {
          value: 'National Institutes of Health',
          lang: 'en',
        },
      ],
    },
  ];
  return discofeedRes.map(e => ({
    shibIdp: e.entityID,
    title: e.DisplayNames[0].value, // TODO: always get english, or first value if no english
  }));
};

class Login extends React.Component {
  static propTypes = {
    providers: PropTypes.arrayOf(
      PropTypes.objectOf(PropTypes.any),
    ),
    location: PropTypes.object.isRequired,
    dictIcons: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {
    providers: [
      {
        id: 'google',
        name: 'Google OAuth',
        url: `${loginPath}google/`,
      },
    ],
  };

  constructor(props) {
    super(props);
    this.state = getInitialState(window.innerHeight - 221);
    this.resetState = this.resetState.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    this.setState({ height: window.innerHeight - 221 });
  }

  resetState() {
    this.setState(getInitialState());
  }

  render() {
    let next = basename;
    const location = this.props.location; // this is the react-router "location"
    const queryParams = querystring.parse(location.search ? location.search.replace(/^\?+/, '') : '');
    if (queryParams.next) {
      next = basename === '/' ? queryParams.next : basename + queryParams.next;
    }
    const customImage = components.login && components.login.image ?
      components.login.image
      : 'gene';

    return (
      <div className='login-page'>
        <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
          <div className='login-page__side-box'>
            <SlidingWindow
              iconName={customImage}
              dictIcons={this.props.dictIcons}
              height={this.state.height}
              scrollY={window.scrollY}
            />
          </div>
        </MediaQuery>
        <div className='login-page__central-content'>
          <div className='h1-typo login-page__title'>
            {this.props.data.title}
          </div>
          <div className='high-light login-page__sub-title'>
            {this.props.data.subTitle}
          </div>
          <hr className='login-page__separator' />
          <div className='body-typo'>{this.props.data.text}</div>
          {
            this.props.providers.map(
              (p, i) => (
                <React.Fragment key={i}>
                  {
                    shouldDisplayInCommonOptions(p.url) ? (
                      <Dropdown>
                        <Dropdown.Button>{p.name}</Dropdown.Button>
                        <Dropdown.Menu>
                          {
                            getInCommonOptions().map((btnCfg, j) => (
                              <Dropdown.Item
                                key={j}
                                onClick={() => {
                                  window.location.href = getLoginUrl(p.url, next, btnCfg.shibIdp);
                                }}
                              >
                                {btnCfg.title}
                              </Dropdown.Item>
                            ))
                          }
                        </Dropdown.Menu>
                      </Dropdown>
                    )
                      :
                      (
                        <Button
                          className='login-page__entries'
                          onClick={() => {
                            window.location.href = getLoginUrl(p.url, next);
                          }}
                          label={p.name}
                          buttonType='primary'
                        />
                      )
                  }
                </React.Fragment>
              ),
            )
          }
          <div>
            {this.props.data.contact}
            <a href={`mailto:${this.props.data.email}`}>
              {this.props.data.email}
            </a>{'.'}
          </div>
        </div>
        <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
          <div className='login-page__side-box--right'>
            <SlidingWindow
              iconName={customImage}
              dictIcons={this.props.dictIcons}
              height={this.state.height}
              scrollY={window.scrollY}
            />
          </div>
        </MediaQuery>
      </div>
    );
  }
}

export default Login;
