import '../global.css';

import './css/lobby.css';
import './css/login.css';
import './css/installation.css';

import io from 'socket.io-client';

import showInstallOptions from './js/installation';
import Login from './js/login';

showInstallOptions();

const socket = io('/login');

Login.init(socket);

socket.on('loginSuccess', isPlayerNew => {
  window.location = isPlayerNew ? "./palette" : "./game";
});
