import React from 'react';
import * as expectedData from './__test__/expected.json';
import * as dictonary from '../../data/dictionary.json';
import { submitAndUpdate } from './ReduxProjectSubmission';
import configureMockStore from 'redux-mock-store';
import thunk from "redux-thunk";
import {routerReducer} from "react-router-redux";
import {getNodeTypes} from "../graphutils";

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('the Project Submission component', () => {
  it('Update redux store when submitting', () => {
    const state = {
      submission: {
        file_type: 'json',
        file: './__test__/data.json',
        dictionary: dictonary,
        nodeTypes: getNodeTypes(dictonary)
      },
      routing: {
        locationBeforeTransitions: {
          pathname: '_root'
        }
      }
    };
    const store = mockStore(state);
    const expectedActions = [
      {
        type: 'RECEIVE_SUBMISSION',
        submit_status: 200,
        data: expectedData,
      }
    ];

    fetch.mockResponseOnce(JSON.stringify(expectedData), { status: 200 });
    return store.dispatch(submitAndUpdate(state.submission.nodeTypes, '_root', state.submission.dictionary))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
