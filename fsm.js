'use strict';
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const is = require('is_js');

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
      else
        edges.push([j, new RegExp(char)]);
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

  let index = this.states.length;
  let newState = this.states[index] = new State;

  if (edges !== void(0)) {
    for (let edge of edges) {
      if (is.array(edge)) {
        // still no destructuring ;_;
        let to = edge[0];
        let gate = edge[1];
        this.addEdge(newState, to, gate);
      }
      else {
        let to = edge;
        this.addEdge(newState, to);
      }
    }
  }
  if (is.boolean(isAccept))
    newState.isAccept = isAccept;
  else
    newState.isAccept = false;

  return newState;
}
/*
@param state: State (required): State to add edge to
@param to: Number or String or State (required): State that edge goes to
@param gate: Regex (optional): Gate which decides access to edge
*/
FSM.prototype.addEdge = function (state, to, gate) {
  if (gate === void(0))
    gate = /./;
  if (to instanceof State)
    to = this.states.indexOf(to);
  return state.addEdge(to, gate);
}
FSM.prototype.isNDA = function () {
  return 'asdf';
}




var State = function () {
  this.edges = [];
}
State.prototype.isAccept = false;
/*
@param to: Number or String (required): State that the edge goes to
@param gate: Regex (required): Gate which decides access to the edge
*/
State.prototype.addEdge = function (to, gate) {
  // still no variable object keys ;_;
  let edge = {};
  edge[to] = gate;
  this.edges.push(edge);
}

module.exports = FSM;
