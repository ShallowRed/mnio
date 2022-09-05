import '../global.css';
import './css/main.css';
import './css/buttons.css';
import './css/lobby.css';
import './css/login.css';
import './css/installation.css';

import io from 'socket.io-client';
import listenLogin from './js/login';
import registerServiceWorker from './js/registerServiceWorker';
import initLobby from './js/lobby';

const socket = io('/login');
initLobby(socket);
registerServiceWorker();
listenLogin(socket);

socket.once('loginSuccess', isPlayerNew => {
  window.location = isPlayerNew ? "/palette" : "/game";
});

socket.once('redirect', path => {
  window.location = path;
});
