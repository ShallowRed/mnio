const express = require('express');
const socketIO = require('socket.io');

const Config = require('../../config/mnio.config');
const Player = require('../models/player');
const Check = require('../models/checker');

const init = (playerid, user, socket, MNIO, colors, owncells) => {

  // Create a new player in the session
  let player = MNIO.PLAYERS[socket.id] =
  new Player(playerid, user, colors, owncells, MNIO.ColorList);

  // Send info to the player
  socket.emit('InitData', {
    GAME: {
      colors: MNIO.ColorList,
      positions: MNIO.PositionList,
      allowed: player.allowedcells,
      owned: player.owncells,
      RowCol: [Config.cols, Config.rows]
    },
    position: player.position,
    colors: player.colors,
    new: !colors
  });

  // Send info to others and save position
  MNIO.PositionList.push(player.position);
  socket.broadcast.emit("NewPosition", [null, player.position]);
};

const update = (direction, socket, MNIO) => {

  // Check if move is ok
  let player = MNIO.PLAYERS[socket.id];
  let nextposition = Check.move(player, direction, MNIO);
  if (!nextposition) return;

  // Clear last position
  socket.emit("NewPlayerPos", nextposition);
  socket.broadcast.emit("NewPosition", [player.position, nextposition]);
  MNIO.PositionList.splice(MNIO.PositionList.indexOf(player.position), 1);
  MNIO.PositionList.push(nextposition);
  player.position = nextposition;
}

const render = (cell, socket, MNIO) => {
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

const disconnect = (socket, MNIO) => {
  // Save player's palette, clear its last position
  let player = MNIO.PLAYERS[socket.id];
  MNIO.PositionList.splice(MNIO.PositionList.indexOf(player.position), 1);
  socket.broadcast.emit("NewPosition", [player.position, null]);
};

const wrongPass = socket => socket.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");

module.exports = {
  init,
  render,
  update,
  disconnect,
  wrongPass
};
