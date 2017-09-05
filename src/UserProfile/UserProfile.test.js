import React from 'react';
import UserProfile from './component';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { parseKeyToString, createKey } from './actions';
import { RequestButton, Bullet, AccessKeyCell, ActionCell, DeleteButton } from './style';
import { mountWithStore } from '../testUtils';

const middleware = [ thunk ];
const mockStore = configureMockStore(middleware);


it('User profile listing with no key-pair', () => {
  const state = {user: { project_access: [] }, status: {}, user_profile: {access_key_pairs: []}, popups: {} };
  const store = mockStore(state);

  const userProfilePage = mountWithStore(<UserProfile />, store).first();
  expect(userProfilePage.find(RequestButton)).toHaveLength(1);
});


it('User profile listing with key-pairs', () => {
  const state = {user: { project_access: [] }, status: {}, user_profile: {access_key_pairs: [{
    access_key: 'DDZyDqCcxyYJdHF4078I',
    expire: "2017-08-29 22:21:31.858919"
  }]}, popups: {} };
  const store = mockStore(state);

  const userProfilePage = mountWithStore(<UserProfile />, store);
  expect(userProfilePage.find(RequestButton)).toHaveLength(1);
  expect(userProfilePage.find(Bullet)).toHaveLength(2);
  expect(userProfilePage.find(AccessKeyCell)).toHaveLength(1);
  expect(userProfilePage.find(ActionCell)).toHaveLength(1);
  expect(userProfilePage.find(DeleteButton)).toHaveLength(1);
});


it('Fetch creating and listing', () => {
  const expectedData = {access_key: 'abc', secret_key: 'xyz' };
  const expectedPopup = {save_key_popup: true};
  const expectedListKey = {access_keys: [{access_key: 'abc',
    secret_key: 'xyz' }]};
  const state = {user: { project_access: [] }, status: {}, user_profile: {access_key_pairs: []}, popups: {} };
  const store = mockStore(state);
  const expectedActions = [
    {
      type: 'CREATE_SUCCEED',
      access_key_pair: expectedData,
      str_access_key_pair: parseKeyToString(expectedData)
    },
    {
      type: 'UPDATE_POPUP',
      data: expectedPopup
    },
    {
      type: 'RECEIVE_USER_PROFILE',
      access_keys: expectedListKey.access_keys
    }
  ];

  fetch.mockResponseOnce(JSON.stringify(expectedData), {status: 200});
  fetch.mockResponseOnce(JSON.stringify(expectedListKey), {status: 200});
  return store.dispatch(createKey("http://anything.com"))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
});
