import '../global.css';

import './tutoriel/introtuto.css';
import './tutoriel/tutoriel.css';

import './components/map/map.css';
import './components/player/player.css';
import './components/ui/ui.css';

///////////////////////

import io from 'socket.io-client';

import Tutoriel from './tutoriel/tutoriel';

import Game from './Game';

const socket = io('/game');

socket.on("initGame", data => {
  // Tutoriel[isPlayerNew ? "init" : "end"]();
  new Game(data, socket);
});

socket.on('redirect', path => {
  window.location.href = path;
})
