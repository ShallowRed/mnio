const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const Database = require('./database');

function DisconnectPlayer(socket, PositionList, PLAYERS) {

  let player = PLAYERS[socket.id];
  if (!player) return;
  console.log("Player n° " + player.dbid + " (" + player.name + ") got disconnected");

  // Save player's owning and palette, clear its last position
  Database.SavePallette(player.dbid, player.colors);
  PositionList.splice(PositionList.indexOf(player.position), 1);
  socket.broadcast.emit("ClearPosition", player.position);

}

module.exports = DisconnectPlayer;
