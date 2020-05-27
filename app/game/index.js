import io from 'socket.io-client';

import './js/lobby';
import Intro from './js/intro';
import login from './js/login';

import './css/global.css';
import './css/lobby.css';
import './css/login.css';
import './css/intro.css';
import './css/introtuto.css';
import './css/canvas.css';
import './css/buttons.css';
import './css/utils.css';
import './css/tuto.css';

const socket = io();
login(socket);
// const ids = [];
// login(socket, ids);

// if (window.location.hostname == "localhost" || window.location.hostname !== "127.0.0.1")
//   socket.emit("login", ["a", "a"] );

socket.on('InitData', data => {
  // data.ids = ids;
  // console.log(data);
  Intro(data, socket)
});

socket.on('alert', data => alert(data));
