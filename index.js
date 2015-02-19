'use strict';
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const is = require('is_js');
const csv = require('csv');

// class syntax not implemented yet ;_;
var FSM = function (csv_filename, callback) {
  this.states = [];
  if (csv_filename !== void(0)) {
    fs.createReadStream(csv_filename)
      .pipe(csv.parse({
        trim: true
      }, function (err, data) {
        if (err)
          throw Error(err);
        return this.parse(data);
      }.bind(this)));
  }
  if (callback !== void(0))
    this.on('loaded', fn);
}
util.inherits(FSM, EventEmitter);
FSM.State = State;
FSM.prototype.isNDA = function () {
  return 'asdf';
}
/*
parses CSV after read
*/
FSM.prototype.parse = function (data) {
  // TODO - finish this
  return this.emit('loaded');
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
  if (isAccept)
    newState.isAccept = true;

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
