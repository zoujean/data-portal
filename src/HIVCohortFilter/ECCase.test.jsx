import React from 'react';
// import { mount } from 'enzyme';
// import * as d3 from 'd3-selection';

import ECCase from './ECCase';
// import { buildTestData } from '../GraphUtils/testData';

function mockFollowup(
  subjectID, visitNumber, thrpyv, visitDate, fposdate, frstdthd, leu3n, viralLoad
  ) {
    return {
          "subject_id": subjectID,
          "visit_number": visitNumber,
          "thrpyv": thrpyv,
          "visit_date": visitDate,
          "fposdate": fposdate,
          "frstdthd": frstdthd,
          "leu3n": leu3n,
          "submitter_id": "x",
          "viral_load": viralLoad
        };
}

describe('the ECCase', () => {
  /*
   * EC: Elite Controller. These are patients with the ability to
   * spontaneously control HIV viral loads for prolonged periods of time.
  */
  it('classifies EC Case correctly (1)', () => {
    /*
      Case 1: Patient with no HAART treatments, Y months of consecutive, adjacent followups
      that all have viral_load < X should be classified as EC
    */
    let X = 4000;
    let Y = 18;
    const subjectToVisitMap = {
      "subject-1" : [ 
        mockFollowup("subject-1", 1, null, 1900, 1900, 1920, null, 4005),
        // consecutive viral loads below threshold begin here
        mockFollowup("subject-1", 2, null, 1900, 1900, 1920, null, 3000),
        mockFollowup("subject-1", 3, null, 1900, 1900, 1920, null, 2000),
        mockFollowup("subject-1", 4, null, 1900, 1900, 1920, null, 3999),
        // the 18 month window is above; the below followup makes the subject EC
        mockFollowup("subject-1", 5, null, 1900, 1900, 1920, null, 3800),
      ]
    };
    
    expect( ).toBe( );
    expect( ).toBe( );
  });

  it('classifies EC Case correctly (2)', () => {
    
    expect( ).toBe( );
    expect( ).toBe( );
  });

  it('classifies control case correctly (1)', () => {
    
    expect( ).toBe( );
    expect( ).toBe( );
  });

  it('classifies control case correctly (2)', () => {
    
    expect( ).toBe( );
    expect( ).toBe( );
  });


});
