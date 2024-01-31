import SelfPlayer from '@/scripts/game/components/player-self';
import Players from '@/scripts/game/components/players';
import GameMap from '@/scripts/game/components/map';

import listenServerEvents from '@/scripts/game/events-emitter/server-events';
import listenClickEvents from '@/scripts/game/events-emitter/click-events';
import listenKeyboardEvents from '@/scripts/game/events-emitter/keyboard-events';
import listenTouchEvents from '@/scripts/game/events-emitter/touch-events';
import listenWindowEvents from '@/scripts/game/events-emitter/window-events';

import FILL_EVENTS from '@/scripts/game/game-events/fill-events';
import MOVE_EVENTS from '@/scripts/game/game-events/move-events';
import ZOOM_EVENTS from '@/scripts/game/game-events/zoom-events';

import fillAnimation from '@/scripts/game/utils/fill-animation';
import animationTimeout from '@/scripts/game/utils/animation-timeout';

export default class Game {

	durations = {
		translationAnimation: 200,
		zoomAnimation: 200,
		fillAnimation: 300,
		delayBetweenZooms: 30,
		bumpAnimation: 60,
		stampAnimation: 200,
		delayBetweenBumps: 200,
	};

	flags = {
		waitingServerConfirmMove: false,
		waitingServerConfirmFill: false,
		isTranslating: false,
		isZooming: false,
		isTouching: false,
		isFilling: false,
		isStamping: false,
	};

	constructor(socket, data) {
		this.isAdmin = data.isAdmin;
		this.socket = socket;
		this.map = new GameMap(this, data.map);
		this.player = new SelfPlayer(this, data.player);
		this.players = new Players(this, data.players);
		this.events = {
			...FILL_EVENTS,
			...MOVE_EVENTS,
			...ZOOM_EVENTS
		};
		this.fillAnimation = fillAnimation.bind(this);
		this.animationTimeout = animationTimeout.bind(this);
	}

	emit(eventName, ...args) {
		this.events[eventName].call(this, ...args);
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

	render = () => {
		this.map.setViewSize();
		this.map.updateCellsLayout();
		this.player.updateCoordsInView();
		this.map.updateCanvasOffset();
		this.map.updateCanvasLayout();
		this.map.translate(0);
		this.map.renderCells();
		this.player.translate(0);
		this.player.setSize();
		this.players.update(0);
	};
}
