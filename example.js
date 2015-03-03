#!iojs
'use strict';

const util = require('util');
const fsm = require('./fsm');

const nfa = new fsm('./test/graph.csv');

console.log(util.inspect(nfa, { depth: null }));

// console.log(input.doSubset());
// console.log(util.inspect(input.doSubset(false), { depth: null }));
const dfa = new fsm(nfa.getSubset());
console.log(util.inspect(dfa, { depth: null }));


dfa.drawState();
