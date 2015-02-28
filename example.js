#!iojs
'use strict';

const util = require('util');
const fsm = require('./fsm');

const input = new fsm('./test/graph.csv');

console.log(util.inspect(input, { depth: null }));

console.log(input.doSubset());
