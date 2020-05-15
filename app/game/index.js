import './js/install';
import './js/roulette';
import io from 'socket.io-client';
import GAME from './js/game';

import './css/global.css';
import './css/lobby.css';
import './css/roulette.css';
import './css/canvas.css';
import './css/buttons.css';
import './css/utils.css';
import './css/tuto.css';

const socket = io();
let admin = false;
// Send a username and a password to server
document.getElementById('logBtn').addEventListener('click', () => {
  let username = document.getElementById("userName").value;
  let password = document.getElementById("Password").value;
  if (!username.length) alert("Le nom d'utilisateur ne peut pas être nul !")
  else if (!password.length) alert("Le mot de passe ne peut pas être nul !")
  else if (password.length > 8) alert("Le mot de passe ne peut pas contenir plus de 8 caractères !")
  else socket.emit("login", [username, password])
  if (username == "a" && password =="a") admin = true;
});

// if (window.location.hostname == "localhost" || window.location.hostname !== "127.0.0.1")
//   socket.emit("login", ["a", "a"] );

// Receive data needed for initialization, start the game
socket.on('InitData', data =>
  GAME.init(data, socket, admin)
);

socket.on('alert', data =>
  alert(data));


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
