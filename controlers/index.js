const express = require('express');
const socketIO = require('socket.io');

const Config = require('./config');
const Player = require('../models/player');
const Check = require('../models/check');

function InitPlayer(playerids, MNIO, colors, owncells) {

  // Create a new player in the session
  let userid = playerids[0];
  let username = playerids[1];
  let socket = playerids[2];
  let player = MNIO.PLAYERS[socket.id] = new Player(userid, username, colors, owncells, MNIO.ColorList);

  // Send info to the player
  socket.emit('InitData', {
    position: player.position,
    colors: player.colors,
    allowedlist: player.allowedcells,
    ColorList: MNIO.ColorList,
    PositionList: MNIO.PositionList,
    uiparams: [Config.rows, Config.cols]
  });

  // Send info to others and save position
  MNIO.PositionList.push(player.position);
  socket.broadcast.emit("NewPosition", player.position);
  console.log("Player n° " + userid + " (" + username + ") is connected");

};

function MovePlayer(direction, socket, MNIO) {

  // Check if move is ok
  let player = MNIO.PLAYERS[socket.id];
  let nextposition = Check.move(player, direction, MNIO.ColorList, MNIO.PositionList);
  if (!nextposition) return;

  // Clear last position
  socket.broadcast.emit("ClearPosition", player.position);
  MNIO.PositionList.splice(MNIO.PositionList.indexOf(player.position), 1);

  // Set new position
  player.position = nextposition; // TODO:  use setter getter to affect players value
  MNIO.PositionList.push(nextposition);
  socket.broadcast.emit("NewPosition", nextposition);
  socket.emit("NewPlayerPos", nextposition);

}

function DrawCell(cell, socket, MNIO) {
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

function DisconnectPlayer(socket, MNIO) {
  let player = MNIO.PLAYERS[socket.id];

  // Save player's palette, clear its last position
  console.log("Player n° " + player.dbid + " (" + player.name + ") got disconnected");
  MNIO.PositionList.splice(MNIO.PositionList.indexOf(player.position), 1);
  socket.broadcast.emit("ClearPosition", player.position);

}

function WrongPass(socket) {
  socket.emit("alert", "Wrong password");
}

function sendgames(socket, data) {
  socket.emit("games", data);
}

function sendtable(socket, data) {
  socket.emit("table", data);
}

module.exports = {
  WrongPass,
  sendtable,
  sendgames,
  MovePlayer,
  DrawCell,
  InitPlayer,
  DisconnectPlayer
};
