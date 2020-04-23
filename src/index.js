import io from 'socket.io-client';
import GAME from './js/game';
import PLAYER from './js/player';
import MAP from './js/map';
import UI from './js/ui';
import {render as Render, clear as Clear} from './js/cell';
import {events} from './js/events';
import './js/animation';
import './css/lobby.css';
import './css/canvas.css';
import './css/buttons.css';

const socket = io();
events(PLAYER, GAME, UI, MAP, socket);

// Send a username and a password to server
document.getElementById('login').addEventListener('click', function() {
  socket.emit("login", {
    user: document.getElementById("userName").value,
    pass: document.getElementById("Password").value
  });
});

// Receive data needed for initialization, start the game
socket.on('InitData', function(data) {
  GAME.init(data, PLAYER, UI, MAP, socket);
});

//Move player if new position has ben allowed on server side
socket.on("NewPlayerPos", function(position) {
  PLAYER.position = position;
  window.Translate.init(GAME, MAP, PLAYER);
});

// Set other's new position and clear last when they move
socket.on("NewPosition", function(position) {
  GAME.positions.push(position[1]);
  Render.position(position[1], PLAYER, GAME, MAP);
  if (!position[0]) return;
  GAME.positions.splice(GAME.positions.indexOf(position[0]), 1);
  Clear(position[0], MAP.ctx3, PLAYER, GAME, MAP);
});

//Fill other's cells when they do so
socket.on('NewCell', function(cell) {
  GAME.colors[cell.position] = cell.color;
  Render.color(cell.position, cell.color, PLAYER, GAME, MAP);
});

// Draw the cells where the player is allowed to move
socket.on('AllowedCells', function(cells) {
  cells.forEach(function(position) {
    if (!GAME.allowed.includes(position)) {
      GAME.allowed.push(position);
      Render.allowed(position, PLAYER, GAME, MAP);
    }
  });
});

socket.on("message", function(data) {
  console.log(data);
});

socket.on("alert", function(data) {
  alert(data);
});

socket.on("error", function() {
  alert("Error: Please try again!");
});
