'use strict';
require('sugar');
const fs = require('fs');
const path = require('path');
const util = require('util');
const is = require('is_js');
const sprintf = require('sprintf');

// class syntax not implemented yet ;_;
var FSM = function (csv_filename, callback) {
  this.states = [];

  if (csv_filename !== void(0)) {
    // don't want to deal with async for this
    let csv_file = fs.readFileSync(csv_filename).toString();
    let csv = csv_file
      .split('\n')
      .map(function (line) {
        return line.split(',');
      });
    // remove last newline
    csv.pop();
    this.parse(csv);
  }
}
FSM.State = State;
/*
parses CSV after read
*/
FSM.prototype.parse = function (data) {
  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    let isAccept = row[row.length - 1] === 'true';
    let edges = [];
    for (let j = 0; j < row.length - 1; j++) {
      let char = row[j];
      if (char === '-')
        continue;
      else if (char === '.')
        edges.push(j);
      else {
        if (char.includes('|')) {
          let chars = char.split('|').map(function (char) {
            return new RegExp(char);
          });
          edges.push([j, chars]);
        }
        else
          edges.push([j, new RegExp(char)]);
      }
    }
    let state = this.addState(edges, isAccept);
    // console.log(i, row, isAccept);
    // console.log(state);
  }
}
/*
@param edges: Array (optional): edges of State
@param isAccept: Boolean (optional): marks whether the state is an accept state
*/
FSM.prototype.addState = function (edges, isAccept) {
  if (edges === void(0)) {
    let newState = new State;
    this.states.push(newState);
    return newState;
  }

  if (is.boolean(edges)) {
    isAccept = edges;
    edges = void(0);
  }

  let newState = new State;
  this.states.push(newState);

  if (edges !== void(0)) {
    for (let edge of edges) {
      if (is.array(edge)) {
        // still no destructuring ;_;
        let to = edge[0];
        let gate = edge[1];
        newState.addEdge(to, gate);
      }
      else {
        let to = edge;
        let gate = /./;
        newState.addEdge(to, gate);
      }
    }
  }
  if (is.boolean(isAccept))
    newState.isAccept = isAccept;
  else
    newState.isAccept = false;

  newState.i = this.states.length - 1;

  return newState;
}
FSM.prototype.isNDA = function () {
  return 'asdf';
}
FSM.prototype.doSubset = function (verbose) {
  if (verbose === void(0))
    verbose = false;
  let gates = this._getCharset();
  let fsm = this;

  // let capture = function (state) {
  //   if (is.array(state)) {
  //     let ret = [];
  //     for (let s of state)
  //       ret.add(capture(s));
  //     return ret;
  //   }
  //   else {
  //     // console.log(state);
  //     let ret = [state];
  //     for (let edge in state.edges) {
  //       let gate = state.edges[edge];
  //       if (gate.toString() === '/./') {
  //         ret.push(fsm.states[edge]);
  //         let recurse = capture(fsm.states[edge]);
  //         if (recurse.length)
  //           ret.add(recurse);
  //       }
  //     }
  //     return ret.unique();
  //   }
  // }

  // let a = 0;
  // let exists = [];
  // let subset = function (level) {
  //   // console.log(a++);
  //   // console.log(level);
  //   // levels.push(level);
  //   level.gates = {};
  //   for (let gate of gates) {
  //     let next_level = {
  //       states: [],
  //     };
  //     for (let state of level.capture) {
  //       for (let edge in state.edges) {
  //         let next_gate = state.edges[edge];
  //         if (gate.toString() === next_gate.toString()) {
  //           next_level.states.push(fsm.states[edge]);
  //         }
  //       }
  //     }
  //     level.gates[gate] = next_level.states.length > 0 ? next_level : '*';
  //   }
  //   // console.log(util.inspect(level, { depth: null }));
  //   for (let gate in level.gates) {
  //     let next_level = level.gates[gate];
  //     if (next_level !== '*') {
  //       let next_state = next_level.states.map(function (state) {
  //         return state.i;
  //       });
  //       // console.log(exists);
  //       let state_i = exists.findIndex(next_state);
  //       // console.log(next_level);
  //       if (state_i < 0) {
  //         next_level.capture = capture(next_level.states);
  //         next_level.i = levels.length;
  //         levels.push(next_level);
  //         exists.push(next_state);
  //         // console.log('continuing along this path ', next_level);
  //         subset(next_level);
  //       }
  //       else {
  //         next_level = level.gates[gate] = levels[state_i];
  //       }
  //     }
  //   }
  // }

  let Level = function () {
    this.states = [];
    this.captures = [];
    this.gates = {};
  }
  Level.prototype.capture = function () {
    function capture (state) {
      let ret = [state];
      for (let edge in state.edges) {
        let gate = state.edges[edge];
        if (gate.toString() === '/./') {
          ret.push(fsm.states[edge]);
          let recurse = capture(fsm.states[edge]);
          if (recurse.length)
            ret.add(recurse);
        }
      }
      return ret.unique();
    }

    for (let state of this.states) {
      this.captures.add(capture(state));
    }
  }

  let levels = [];
  let queue = [];
  let exists = [];
  let start = {
    states: [this.states[0]],
    capture: capture(this.states[0]),
    i: 0
  };
  queue.push(start);
  // levels.push(start);

  exists.push(start.states.map(function (state) {
    return state.i;
  }));
  // console.log(start);

  subset(start);

  // console.log(levels);
  if (verbose) {
    for (let i = 0; i < levels.length; i++) {
      let level = levels[i];
      // console.log(level);
      let states = level.states.map(function (state) {
        return state.i;
      }).join(',');
      let captures = level.capture.map(function (state) {
        return state.i;
      }).join(',');
      console.log(`level S${i}, {${states}} (C{${captures}})`);
      for (let gate in level.gates) {
        let next_level = level.gates[gate];
        // console.log(next_level);
        if (next_level === '*') {
          console.log(`\tS${i} -${gate}-> *`);
        }
        else {
          let states = next_level.states.map(function (state) {
            return state.i;
          }).join(',');
          let captures = next_level.capture.map(function (state) {
            return state.i;
          }).join(',');
          let j = next_level.i;
          let isAccept = next_level.capture.some(function (state) {
            return state.isAccept;
          }) ? 'accept' : 'not accept';
          console.log(`\tS${i} -${gate}-> {${states}} (C{${captures}}) = S${j} ${isAccept}`);
        }
      }
    }
  }

  return levels;
}
FSM.prototype._getCharset = function () {
  let gates = [];
  for (let state of this.states) {
    for (let edge in state.edges) {
      let gate = state.edges[edge];
      if (is.array(gate)) {
        for (let g of gate) {
            if (g.toString() !== '/./') {
              gates.push(g);
            }
        }
      }
      else {
        if (gate.toString() !== '/./') {
          gates.push(gate);
        }
      }
    }
  }
  return gates.unique();
}




var State = function () {
  this.edges = {};
}
State.prototype.isAccept = false;
/*
@param to: Number or String (required): State that the edge goes to
@param gate: Regex (required): Gate which decides access to the edge
*/
State.prototype.addEdge = function (to, gate) {
  // still no variable object keys ;_;
  this.edges[to] = gate;
}

module.exports = FSM;
