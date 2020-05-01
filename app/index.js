import './js/install';
import io from 'socket.io-client';
import GAME from './js/game';

import './css/global.css';
import './css/lobby.css';
import './css/canvas.css';
import './css/buttons.css';
import './css/tuto.css';

const socket = io();

// Send a username and a password to server
document.getElementById('logBtn').addEventListener('click', () =>
  socket.emit("login", [
    document.getElementById("userName").value,
    document.getElementById("Password").value
  ])
);

// Receive data needed for initialization, start the game
socket.on('InitData', data =>
  GAME.init(data, socket)
);

// TODO: button flip button left/right side
// TODO: settings button
// TODO: exit button
// TODO: set limit to player expansion progressively
// TODO: fix xy inversion
// TODO: fix can't access cell 0,0
// TODO: startcell according to device
// TODO: erase color ?
// TODO: darken /lighten selectColored color
// TODO: add tutorial
// TODO: eventually animate other's move
