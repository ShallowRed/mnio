import io from 'socket.io-client';
import GAME from './js/models/game';

import './css/lobby.css';
import './css/canvas.css';
import './css/buttons.css';

const socket = io();

// Send a username and a password to server
document.getElementById('login').addEventListener('click', () => socket.emit("login", {
  user: document.getElementById("userName").value,
  pass: document.getElementById("Password").value
}));

// Receive data needed for initialization, start the game
socket.on('InitData', data => GAME.init(data, socket));

//Move player if new position has ben allowed on server side
socket.on("NewPlayerPos", position => GAME.NewPlayerPos(position));

// Set other's new position and clear last when they move
socket.on("NewPosition", position => GAME.NewPosition(position));

//Fill other's cells when they do so
socket.on('NewCell', cell => GAME.NewCell(cell));

// Draw the cells where the player is allowed to move
socket.on('AllowedCells', cells => GAME.AllowCells(cells));

socket.on("error", () => alert("Error: Please try again!"));

// TODO: button flip button left/right side
// TODO: settings button
// TODO: exit button
// TODO: set limit to player expansion progressively
// TODO: fix xy inversion
// TODO: fix can't access cell 0,0
// TODO: startcell according to device
// TODO: erase color ?
// TODO: darken /lighten selected color
// TODO: add tutorial
// TODO: eventually animate other's move
