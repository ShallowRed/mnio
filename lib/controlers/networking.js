const express = require('express');
const socketIO = require('socket.io');

const Config = require('../../config/mnio.config');
const Player = require('../models/player');
const allow = require('../models/allow');
const move = require('../models/move');

////////////////////////////// login

const askPass = (socket, isNew) => socket.emit("askPass", isNew);

const wrongPass = socket => socket.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");

////////////////////////////// INITPLAYER

const init = (id, user, socket, MNIO, colors, owncells) => {

  // Create a new player in the session
  const player = MNIO.PLAYERS[socket.id] =
    new Player(id, user, colors, owncells, MNIO.ColorList);

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
    colors: colors,
    new: !colors,
    admin: user == "a"
  });

  if (player.position) {
    // Send info to others and save position
    MNIO.PositionList.push(player.position);
    socket.broadcast.emit("NewPosition", [null, player.position]);
  }
};

////////////////////////////// New position/ ask for move

const update = (dir, socket, MNIO) => {
  const player = MNIO.PLAYERS[socket.id];
  const nextPos = move(player, dir, MNIO);
  if (nextPos) newPosition(player.position, nextPos);
}

const newPosition = (lastPos, newPos) => {
  socket.emit("NewPlayerPos", newPos);
  socket.broadcast.emit("NewPosition", [lastPos, newPos]);
  MNIO.PositionList.splice(MNIO.PositionList.indexOf(player.position), 1);
  MNIO.PositionList.push(newPos);
  player.position = newPos;
}

////////////////////////////// filling

const render = (cell, socket, MNIO) => {
  const position = cell[0];
  const color = cell[1];

  // Store color changes and inform everyone
  MNIO.ColorList[position] = color;
  socket.broadcast.emit('NewCell', {
    position: position,
    color: color,
  });

  // Update player's owning and allowed cells
  const player = MNIO.PLAYERS[socket.id];
  if (player.owncells.includes(position)) return;
  player.owncells.push(position);

  const allowedcells = allow(player.owncells);
  player.allowedcells = allowedcells;
  socket.emit('AllowedCells', allowedcells);

};

////////////////////////////// disconnect

const disconnect = (player, socket, MNIO) => {
  // Save player's palette, clear its last position
  MNIO.PositionList.splice(MNIO.PositionList.indexOf(player.position), 1);
  if (player.position) socket.broadcast.emit("NewPosition", [player.position, null]);
};

module.exports = {
  init,
  render,
  update,
  disconnect,
  askPass,
  wrongPass
};
