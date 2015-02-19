'use strict';

const should = require('should');
const assert = require('assert');


const FSM = require('../fsm.js');
describe('FSM', function () {
  describe('#constructor', function () {
    let fsm = new FSM;
    fsm.addState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
    fsm.addState([
      [2, /\d/]
    ]);
    fsm.addState([
      [2, /\d/]
    ], true);
    fsm.addState([
      [4, /\d/],
      [6, /\./]
    ]);
    fsm.addState([
      [4, /\d/],
      [5, /\./]
    ]);
    fsm.addState([
      [5, /\d/]
    ], true);
    fsm.addState([
      [5, /\d/]
    ]);
    fsm.addState([
      [8, /\w/]
    ]);
    fsm.addState([
      [8, /\w|\d/],
      [9, /\-/]
    ], true);
    fsm.addState([
      [8, /\w|\d/]
    ]);
    fsm.addState([
      [11, /\=/]
    ]);
    fsm.addState(true);
    fsm.addState([
      [13, /\+/]
    ]);
    fsm.addState(true);
    fsm.addState([
      [15, /\;/]
    ]);
    fsm.addState(true);
    fsm.addState([
      [17, /\*/]
    ]);
    fsm.addState(true);
    fsm.addState([
      [19, /\(/]
    ]);
    fsm.addState(true);
    fsm.addState([
      [21, /\)/]
    ]);
    fsm.addState(true);
    let fsm_csv = new FSM('./test/graph.csv');
    it('should produce same results from CSV and manual entry', function () {
      assert.deepEqual(fsm, fsm_csv);
    });
  });
  describe('#addState', function () {
    let fsm = new FSM;
    let testState0 = fsm.addState([
      4,
      [5, /asdf/],
      6
    ]);
    let testState1 = fsm.addState([
      [7, /123/],
      8,
    ], true);
    let testState2 = fsm.addState();
    let testState3 = fsm.addState(true);

    it('should add edges to state', function () {
      testState0.should.have.property('edges').with.lengthOf(3);
      testState1.should.have.property('edges').with.lengthOf(2);
      testState2.should.have.property('edges').with.lengthOf(0);
      testState3.should.have.property('edges').with.lengthOf(0);
    });
    it('should add default gate when not specified', function () {
      // testState0.should.have.property('edges').with.property(1).with.property(4, /./);
      testState0['edges'][0].should.have.property(4, /./);
      testState1['edges'][1].should.have.property(8, /./);
    });
    it('should add explicit gate when specified', function () {
      testState0['edges'][1].should.have.property(5, /asdf/);
      testState1['edges'][0].should.have.property(7, /123/);
    });
    it('should correctly assign acceptedness', function () {
      testState0.should.have.property('isAccept', false);
      testState1.should.have.property('isAccept', true);
      testState2.should.have.property('isAccept', false);
      testState3.should.have.property('isAccept', true);
    });
    it('should be added to the FSM', function () {
      fsm.should.have.property('states').with.lengthOf(4);
    });
  });
});
