import io from 'socket.io-client';

import showInstallOptions from './lobby/installation';
import Login from './lobby/login';
import PaletteSelection from './lobby/paletteSelection';
import TUTO from './lobby/tutoriel';
import initGame from './game/initGame';

// import GAME from './components/Game';

showInstallOptions();

const socket = io();
Login.init(socket);

socket.on('loginSuccess', isPlayerNew => {
  Login.end();
  isPlayerNew && PaletteSelection.init(socket);
  socket.on("initGame", data => {
    TUTO[isPlayerNew ? "init" : "end"]();
    initGame(data, socket);
  });
});

socket.on('alert', data =>
  alert(data)
);
