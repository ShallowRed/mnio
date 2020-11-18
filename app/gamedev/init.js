import io from 'socket.io-client';

import Tutoriel from './tutoriel/tutoriel';

import Game from './Game';

const socket = io('/gamedev');

socket.on("initGame", data => {
  // Tutoriel[isPlayerNew ? "init" : "end"]();
  new Game(data, socket);
});
