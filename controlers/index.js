const express = require('express');
const socketIO = require('socket.io');

const setallowedcells = require('../models/allowedcells');
const isallowed = require('../models/allowedmoves');
const Player = require('../models/newplayer');
const PARAMS = require('../models/parameters');
const uiparams = [PARAMS.rows, PARAMS.cols, PARAMS.vrows, PARAMS.vcols, PARAMS.lw, PARAMS.celltimeout];
const rows = PARAMS.rows;
const cols = PARAMS.cols;

function InitPlayer(userid, username, position, colors, owncells, socket, ColorList, PositionList, PLAYERS) {
  if (!userid) {
    socket.emit("alert", "Wrong password");
    return;
  }

  // Create a new player in the session
  let player = PLAYERS[socket.id] = new Player(userid, username, position, colors, owncells, ColorList);

  // Send info to the player
  socket.emit('initdata', {
    position: player.position,
    colors: player.colors,
    allowedlist: player.allowedcells,
    ColorList: ColorList,
    PositionList: PositionList,
    uiparams: uiparams
  });

  // Send info to others and save position
  PositionList.push(player.position);
  socket.broadcast.emit("NewPosition", player.position);
  console.log("Player n° " + userid + " (" + username + ") is connected");

};

function MovePlayer(direction, socket, ColorList, PositionList, PLAYERS) {

  // Check if move is ok
  let player = PLAYERS[socket.id];
  let nextposition = isallowed(player, direction, ColorList, PositionList);
  if (!nextposition) return;

  // Clear last position
  socket.broadcast.emit("ClearPosition", player.position);
  PositionList.splice(PositionList.indexOf(player.position), 1);

  // Set new position
  player.position = nextposition;
  PositionList.push(nextposition);
  socket.broadcast.emit("NewPosition", nextposition);
  socket.emit("newplayerpos", nextposition);

}

function DrawCell(cell, socket, ColorList, PLAYERS) {
  let position = cell[0];
  let color = cell[1];

  // Store color changes and inform everyone
  ColorList[position] = color;
  socket.broadcast.emit('NewCell', {
    position: position,
    color: color,
  });

  // Update player's owning and allowed cells
  let player = PLAYERS[socket.id];
  if (player.owncells.includes(position)) return;
  player.owncells.push(position);
  let allowedcells = setallowedcells(player.owncells);
  player.allowedcells = allowedcells;
  socket.emit('allowedcells', allowedcells);

};

function DisconnectPlayer(socket, PositionList, PLAYERS) {
  let player = PLAYERS[socket.id];

  // Save player's palette, clear its last position
  console.log("Player n° " + player.dbid + " (" + player.name + ") got disconnected");
  PositionList.splice(PositionList.indexOf(player.position), 1);
  socket.broadcast.emit("ClearPosition", player.position);

}

module.exports = {
  MovePlayer,
  DrawCell,
  InitPlayer,
  DisconnectPlayer
};
