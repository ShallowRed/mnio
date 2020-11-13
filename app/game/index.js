import './css/global.css';
import './css/lobby.css';
import './css/login.css';
import './css/intro.css';
import './css/introtuto.css';
import './css/canvas.css';
import './css/buttons.css';
import './css/utils.css';
import './css/tuto.css';

import io from 'socket.io-client';

import showInstallOptions from './js/installation';
import Login from './js/login';
import PaletteSelection from './js/paletteSelection';

import GAME from './js/components/game';
import TUTO from './js/tutoriel';

showInstallOptions();

const socket = io();
Login.init(socket);

socket.on('loginSuccess', isPlayerNew => {
  Login.end();
  isPlayerNew && PaletteSelection.init(socket);
  socket.on("initGame", data => {
    TUTO.[isPlayerNew ? "init" : "end"]();
    GAME.init(data, socket);
  });
});

socket.on('alert', data =>
  alert(data)
);
