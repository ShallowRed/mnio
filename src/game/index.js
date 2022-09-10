import 'img/close.svg';
import 'img/home.svg';
import 'img/refresh.svg';
import 'img/zoom-in.svg';
import 'img/zoom-out.svg';

import 'styles/commons/commons.scss';
import 'styles/game/index.scss';

import io from 'socket.io-client';

import Game from './game';

const socket = io('/game');

socket.once("INIT_GAME", data => {

	console.log('INIT_GAME', data);
	
	const game = new Game(socket, data);

	game.init();
});