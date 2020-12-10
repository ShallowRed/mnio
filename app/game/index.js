import '../global.css';
import './tutoriel/introtuto.css';
import './tutoriel/tutoriel.css';

import './styles/main.css';
import './styles/map.css';
import './styles/player.css';
import './styles/ui.css';

///////////////////////

import io from 'socket.io-client';

import Tutoriel from './tutoriel/tutoriel';

import Game from './Game';

const socket = io('/game');

socket.on("initGame", data => {
  // console.log(data);
  // Tutoriel.init();
  // Tutoriel[isPlayerNew ? "init" : "end"]();
  new Game(data, socket);
  showAll();
});

socket.on('redirect', path => {
  window.location.href = path;
})

const showAll = () => {
  [...document.querySelectorAll('body>*')].forEach(el => {
    el.style.opacity = 1;
  });
}
