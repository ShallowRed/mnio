import io from 'socket.io-client';

import showInstallOptions from './lobby/installation';
import Login from './lobby/login';
import PaletteSelection from './lobby/paletteSelection';
import Tutoriel from './lobby/tutoriel';

import Game from './Game';

showInstallOptions();

const socket = io();

Login.init(socket);

socket.on('loginSuccess', isPlayerNew => {

  Login.end();

  isPlayerNew && PaletteSelection.init(socket);

  socket.on("initGame", data => {
    Tutoriel[isPlayerNew ? "init" : "end"]();
    new Game(data, socket);
  });

});
