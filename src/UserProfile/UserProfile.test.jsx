import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';

import UserProfile, { APIKeyCell, DeleteButton, RequestButton } from './UserProfile';

describe('the UserProfile component', () => {
  const testProps = {
    user: {
      project_access: {
        frickjack: ['read', 'write'],
      },
    },
    userProfile: {
      jtis: [
        { jti: 'f8733984-8164-4689-9c25-56707962d7e0', exp: 1459487258 },
        { jti: 'f8733984-8164-4689-9c25-56707962d7e9', exp: 1459487259 },
      ],
    },
    popups: {},
    submission: {
      projects: {
        frickjack: 'program-frickjack',
      },
    },
  };

  const noop = () => {};

  it('lists access keys', () => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/identity' }}>
        <UserProfile
          {...testProps}
          onCreateKey={noop}
          onClearCreationSession={noop}
          onUpdatePopup={noop}
          onDeleteKey={noop}
          onRequestDeleteKey={noop}
          onClearDeleteSession={noop}
        />
      </StaticRouter>,
    );
    expect($vdom.find(APIKeyCell)).toHaveLength(testProps.userProfile.jtis.length);
  });

  it('triggers create-key events', (done) => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/identity' }}>
        <UserProfile
          {...testProps}
          onCreateKey={() => { done(); }}
          onClearCreationSession={noop}
          onUpdatePopup={noop}
          onDeleteKey={noop}
          onRequestDeleteKey={noop}
          onClearDeleteSession={noop}
        />
      </StaticRouter>);
    const $createBtn = $vdom.find('button[id="create_key_button"]');
    expect($createBtn).toHaveLength(1);
    $createBtn.simulate('click');
    // should invoke onCreateKey callback (above - calls done()) ...
  });

  it('triggers delete-key events', (done) => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/identity' }}>
        <UserProfile
          {...testProps}
          onCreateKey={noop}
          onClearCreationSession={noop}
          onUpdatePopup={noop}
          onDeleteKey={noop}
          onRequestDeleteKey={() => { done(); }}
          onClearDeleteSession={noop}
        />
      </StaticRouter>,
    );
    const $deleteBtn = $vdom.find(DeleteButton);
    expect($deleteBtn).toHaveLength(2);
    $deleteBtn.at(0).simulate('click');
    // should invoke onRequestDeleteKey callback  (above - calls done()) ...
  });
});
