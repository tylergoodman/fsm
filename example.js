'use strict';

const fsm = require('./index');

const input = new fsm('./test/graph.csv');
// input.addState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
// input.addState([
//   [2, /\d/]
// ]);
// input.addState([
//   [2, /\d/]
// ], true);
// input.addState([
//   [4, /\d/],
//   [6, /\./]
// ]);
// input.addState([
//   [4, /\d/],
//   [5, /\./]
// ]);
// input.addState([
//   [5, /\d/]
// ]);
// input.addState([
//   [5, /\d/]
// ]);
// input.addState([
//   [8, /\w/]
// ]);
// input.addState([
//   [8, /\w|\d/],
//   [9, /\-/]
// ]);
// input.addState([
//   [8, /\w|\d/]
// ]);
// input.addState([
//   [11, /\=/]
// ]);
// input.addState(true);
// input.addState([
//   [13, /\+/]
// ]);
// input.addState(true);
// input.addState([
//   [15, /\;/]
// ]);
// input.addState(true);
// input.addState([
//   [17, /\*/]
// ]);
// input.addState(true);
// input.addState([
//   [19, /\(/]
// ]);
// input.addState(true);
// input.addState([
//   [21, /\)/]
// ]);
// input.addState(true);





// console.log(input);
for (let state of input.states) {
  console.log(state);
}
// console.log(input.states[0]);
// console.log(input.states[1]);
// console.log(input.states[11]);
