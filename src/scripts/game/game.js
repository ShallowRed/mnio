import SelfPlayer from 'game/components/player-self';
import Players from 'game/components/players';
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

	durations = {
		translation: 200,
		zoom: 150,
		fillAnimation: 300,
	};

	flags = {
		waitingServerConfirmMove: false,
		waitingServerConfirmFill: false,
		isTranslating: false,
		isZooming: false,
		isTouching: false,
		isFilling: false,
		isStamping: false,
		isFullRendering: false
	};

	constructor(socket, data) {

		this.socket = socket;

		this.map = new GameMap(this, data.map);

		this.player = new SelfPlayer(this, data.player);

		this.players = new Players(this, data.players);

		this.events = GAME_EVENTS;

		this.fillAnimation = fillAnimation.bind(this);

		this.animationTimeout = animationTimeout.bind(this);
	}

	init() {

		listenClickEvents.call(this);

		listenKeyboardEvents.call(this);

		listenTouchEvents.call(this);

		listenWindowEvents.call(this);

		listenServerEvents.call(this);

		this.emit("SELECT_COLOR", 0);

		this.fullRender();
	}

	fullRender = () => {

		this.flags.isFullRendering = true;

		this.map.setViewSize();

		this.updateState();

		this.render();

		this.flags.isFullRendering = false;
	};

	updateState(position, direction) {

		this.player.updatePosition(position, direction);

		if (
			this.flags.isZooming ||
			this.flags.isFullRendering
		) {

			this.map.updateState();
		}

		this.player.updateCoordsInView();

		this.map.updateCanvasOrigin();

		this.players.updateCoordsInView();
	}

	render() {

		this.map.render();

		this.player.render();

		this.players.render();
	}

	emit(eventName, ...data) {

		this.events[eventName].call(this, ...data);
	}
}
