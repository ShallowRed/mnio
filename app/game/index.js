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

socket.on('InitData', data =>
  Intro(data, socket)
);

socket.on('alert', data =>
  alert(data)
);
