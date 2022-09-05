import '../global.css';

import './styles/main.css';
import './styles/help.css';
import './styles/menu.css';
import './styles/map.css';
import './styles/player.css';
import './styles/ui.css';

///////////////////////

import io from 'socket.io-client';

import Tutoriel from './tutoriel';
import Game from './Game';

const socket = io('/game');

socket.once("initGame", data => {

	console.log('initGame', data);
	
	new Game(data, socket);

	const hasAlreadyPlayed = data.Game.owned.length;
	
	Tutoriel[hasAlreadyPlayed ? "end" : "init"](socket);

	showAll();
});

socket.once('redirect', path => {
	window.location.href = path;
})

function showAll() {
  [...document.querySelectorAll('body>*')].forEach(el => {
    el.style.opacity = 1;
  });
};