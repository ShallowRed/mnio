import 'resources/img/close.svg';
import 'resources/img/home.svg';
import 'resources/img/refresh.svg';
import 'resources/img/help.svg';
import 'resources/img/zoom-in.svg';
import 'resources/img/zoom-out.svg';

import 'styles/commons/commons.scss';
import 'styles/game/index.scss';

import io from 'socket.io-client';

import Game from 'game/game';

import { startTutoriel, listenHelpButtonClick } from 'game/components/help';

const socket = io('/game');

socket.once("INIT_GAME", data => {

	const game = new Game(socket, data);

	game.init();

	const isPlayerFirstLog = data.ownCells.length === 0;

	if (isPlayerFirstLog) {

		startTutoriel(socket);

	} else {

		listenHelpButtonClick();
	}
});