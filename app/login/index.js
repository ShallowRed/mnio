import '../layouts/global.css';

import './lobby.css';
import './login.css';
import './login.css';

import io from 'socket.io-client';

import showInstallOptions from './installation';
import Login from './login';

showInstallOptions();

const socket = io('/login');
Login.init(socket);

socket.on('loginSuccess', isPlayerNew => {
  window.location = isPlayerNew ? "./palette" : "./game";
});
