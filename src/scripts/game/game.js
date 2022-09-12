import Player from 'game/components/player';
import GameMap from 'game/components/map';

import listenServerEvents from 'game/events/server-events';
import listenClickEvents from 'game/events/click-events';
import listenKeyboardEvents from 'game/events/keyboard-events';
import listenTouchEvents from 'game/events/touch-events';
import listenWindowEvents from 'game/events/window-events';
import GAME_EVENTS from 'game/events/game-events';

import fillAnimation from 'game/utils/fill-animation';
import animationTimeout from 'game/utils/animation-timeout';

export default class Game {

	duration = 0.2;

	flags = {};

	constructor(socket, data) {

		this.socket = socket;

		this.map = new GameMap(this, data.map);

		this.player = new Player(this, data.player);

		this.events = GAME_EVENTS;

		this.fillAnimation = fillAnimation.bind(this);

		this.animationTimeout = animationTimeout.bind(this);
	}

	emit(eventName, data) {

		this.events[eventName].call(this, data);
	}

	init() {

		listenClickEvents.call(this);
		
		listenKeyboardEvents.call(this);
		
		listenTouchEvents.call(this);
		
		listenWindowEvents.call(this);

		listenServerEvents.call(this);

		this.emit("SELECT_COLOR", 0);

		this.render();
	}

	render() {

		this.map.getViewSize();

		this.updateState();

		this.map.render();

		this.player.render();
	}

	updateState(position, direction) {

		this.player.updatePosition(position, direction);

		if (!this.flags.isTranslating) {

			this.map.updateCanvasGrid();
		}

		this.player.updatePosInView();

		this.map.updateCanvasOrigin();
	}
}
