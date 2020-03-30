const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const randompos = require('../models/randompos');
const Player = require('../models/newplayer');
const setallowedcells = require('../models/allowedcells');
const isallowed = require('../models/allowedmoves');
const convert = require('../models/converters');
const PARAMS = require('../models/parameters');
const port = PARAMS.port;
const rows = PARAMS.rows;
const cols = PARAMS.cols;
const limit = PARAMS.limit;
const uiparams = [rows, cols, PARAMS.vrows, PARAMS.vcols, PARAMS.lw, PARAMS.celltimeout];

function startplayergame(useridindb, username, socket, OwningList, PaletteList, ColorList, PositionList, PLAYERS) {

  // Create a new player in the session
  let player = PLAYERS[socket.id] = new Player(randompos(ColorList));
  player.dbid = useridindb;
  player.name = username;

  // Check if player has already drawn cells
  if (OwningList[player.dbid]) {
    player.owncells = OwningList[player.dbid];
    player.colors = PaletteList[player.dbid];
    player.position = player.owncells[0];
    player.allowedcells = setallowedcells(player.owncells);
  };

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
  socket.broadcast.emit("newglobalpos", player.position);
  console.log("Player n° " + useridindb + " (" + username + ") is connected");

};

function MovePlayer(direction, socket, ColorList, PositionList, PLAYERS) {

  // Check if move is ok
  let player = PLAYERS[socket.id];
  let nextposition = isallowed(player, direction, ColorList, PositionList);
  if (!nextposition) return;

  // Clear last position
  socket.broadcast.emit("clearpos", player.position);
  PositionList.splice(PositionList.indexOf(player.position), 1);

  // Set new position
  player.position = nextposition;
  PositionList.push(nextposition);
  socket.broadcast.emit("newglobalpos", nextposition);
  socket.emit("newplayerpos", nextposition);
}

function DrawCell(cell, socket, ColorList, OwningList, PLAYERS) {
  let position = cell[0];
  let color = cell[1];

  // Store color changes and inform everyone
  ColorList[position] = color;
  socket.broadcast.emit('newglobalcell', {
    position: position,
    color: color,
  });

  // Update player's owning and allowed cells
  let player = PLAYERS[socket.id];
  if (player.owncells.includes(position)) return;
  player.owncells.push(position);
  OwningList[player.dbid] = player.owncells;
  let allowedcells = setallowedcells(player.owncells);
  player.allowedcells = allowedcells;
  socket.emit('allowedcells', allowedcells);
};

function DisconnectPlayer(socket, OwningList, PaletteList, PositionList, PLAYERS) {
  let player = PLAYERS[socket.id];
  if (!player) return;
  console.log("Player n° " + player.dbid + " (" + player.name + ") got disconnected");

  // Save player's owning and palette, clear its last position
  OwningList[player.dbid] = player.owncells;
  PaletteList[player.dbid] = player.colors;
  PositionList.splice(PositionList.indexOf(player.position), 1);
  socket.broadcast.emit("clearpos", player.position);
}

module.exports = {
  startplayergame,
  MovePlayer,
  DrawCell,
  DisconnectPlayer
};
