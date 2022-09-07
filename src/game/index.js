import 'styles/commons/commons.scss';
import 'styles/game/index.scss';

///////////////////////

import io from 'socket.io-client';

import Tutoriel from './tutoriel';
import Game from './Game';

const socket = io('/game');

socket.once("initGame", data => {

	console.log('initGame', data);
	
	new Game(data, socket);

	const hasAlreadyPlayed = data.Game.owned.length;
	
	// Tutoriel[hasAlreadyPlayed ? "end" : "init"](socket);

	showAll();
});

socket.once('redirect', path => {
	window.location.href = path;
})

function showAll() {
  [...document.querySelectorAll('body>*')].forEach(el => {
    el.style.opacity = 1;
  });
}