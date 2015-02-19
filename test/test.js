'use strict';

const should = require('should');


const FSM = require('../index.js');
const csv = require('csv');
describe('FSM', function () {
  describe('#constructor', function () {
    let fsm = new FSM;
    let fsm_csv = new FSM('./graph.csv');
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
