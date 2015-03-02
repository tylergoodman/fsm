#!iojs
'use strict';

const util = require('util');
const fsm = require('./fsm');

const input = new fsm('./test/graph.csv');

console.log(util.inspect(input, { depth: null }));

// console.log(input.doSubset());
// console.log(util.inspect(input.doSubset(false), { depth: null }));
input.doSubset(true);
