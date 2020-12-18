import '../global.css';

import './styles/main.css';
import './styles/tutoriel.css';
import './styles/menu.css';
import './styles/map.css';
import './styles/player.css';
import './styles/ui.css';

///////////////////////

import io from 'socket.io-client';

import Tutoriel from './tutoriel';

import Game from './Game';

const socket = io('/game');

socket.on("initGame", data => {
  Tutoriel.setMessages();
  // Tutoriel[data.Game.owned.length ? "end" : "init"](socket);
  Tutoriel[data.Game.owned.length ? "init" : "end"](socket);
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
