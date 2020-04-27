const express = require('express');
const socketIO = require('socket.io');

const Config = require('../config');
const Player = require('../models/player');
const Check = require('../models/checker');

function init(ids, MNIO, colors, owncells) {

  // Create a new player in the session
  let socket = ids[2];
  let player = MNIO.PLAYERS[socket.id] = new Player(ids[0], ids[1], colors, owncells, MNIO.ColorList);

  // Send info to the player
  socket.emit('InitData', {
    GAME: {
      colors: MNIO.ColorList,
      positions: MNIO.PositionList,
      allowed: player.allowedcells,
      owned: player.owncells,
      rc: [Config.cols, Config.rows]
    },
    position: player.position,
    colors: player.colors
  });

  // Send info to others and save position
  MNIO.PositionList.push(player.position);
  socket.broadcast.emit("NewPosition", [null, player.position]);
  console.log("Player n° " + ids[0] + " (" + ids[1] + ") is connected");

};

function update(direction, socket, MNIO) {

  // Check if move is ok
  let player = MNIO.PLAYERS[socket.id];
  let nextposition = Check.move(player, direction, MNIO);
  if (!nextposition) return;

  // Clear last position
  socket.emit("NewPlayerPos", nextposition);
  socket.broadcast.emit("NewPosition", [player.position, nextposition]);
  MNIO.PositionList.splice(MNIO.PositionList.indexOf(player.position), 1);
  MNIO.PositionList.push(nextposition);
  player.position = nextposition; // TODO:  use setter getter to affect players value
}

function render(cell, socket, MNIO) {
  let position = cell[0];
  let color = cell[1];

  // Store color changes and inform everyone
  MNIO.ColorList[position] = color;
  socket.broadcast.emit('NewCell', {
    position: position,
    color: color,
  });

  // Update player's owning and allowed cells
  let player = MNIO.PLAYERS[socket.id];
  if (player.owncells.includes(position)) return;
  player.owncells.push(position);
  let allowedcells = Check.cells(player.owncells);
  player.allowedcells = allowedcells;
  socket.emit('AllowedCells', allowedcells);

};

function disconnect(socket, MNIO) {
  let player = MNIO.PLAYERS[socket.id];

  // Save player's palette, clear its last position
  console.log("Player n° " + player.dbid + " (" + player.name + ") got disconnected");
  MNIO.PositionList.splice(MNIO.PositionList.indexOf(player.position), 1);
  socket.broadcast.emit("NewPosition", [player.position, null]);

  // if (player.owncells.length < 10) {
  //   player.owncells.forEach(function(cell) {
  //     MNIO.ColorList.splice(MNIO.ColorList.indexOf(cell), 1);
  //     socket.broadcast.emit("ClearCells", player.owncells);
  //   });
  // }

};

function WrongPass(socket) {
  socket.emit("alert", "Wrong password");
};

function sendgames(socket, data) {
  socket.emit("games", data);
};

function sendtable(socket, data) {
  socket.emit("table", data);
};

module.exports = {
  init,
  render,
  update,
  disconnect,
  sendtable,
  sendgames,
  WrongPass
};
