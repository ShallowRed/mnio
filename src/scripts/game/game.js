import Player from 'game/components/player';
import GameMap from 'game/components/map';
import gameButtons from 'game/components/buttons';

import listenServerEvents from 'game/events/server-events';
import listenClickEvents from 'game/events/click-events';
import listenKeyboardEvents from 'game/events/keyboard-events';
import listenTouchEvents from 'game/events/touch-events';

import fillAnimation from 'game/utils/fill-animation';
import animationTimeout from 'game/utils/animation-timeout';

export default class Game {

	duration = 0.2;

	flags = {};

	constructor(socket, {
		gridState,
		playersPositions,
		rows,
		cols,
		ownCells,
		allowedCells,
		position,
		palette
	}) {

		this.socket = socket;

		this.map = new GameMap(this, {
			rows,
			cols,
			gridState,
			playersPositions
		});

		this.player = new Player(this, {
			position,
			palette,
			ownCells,
			allowedCells
		});

		this.fillAnimation = fillAnimation.bind(this);
		this.animationTimeout = animationTimeout.bind(this);
	}

	init() {

		this.selectColor(0);

		this.render();

		this.listenWindowEvents();

		listenClickEvents.call(this);

		listenKeyboardEvents.call(this);

		listenTouchEvents.call(this);

		listenServerEvents.call(this);
	}

	listenWindowEvents() {

		window.addEventListener('resize', () => {

			this.render();
		});

		window.addEventListener("orientationchange", () => {

			setTimeout(() => this.render(), 500)
		});
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

	moveAttempt(direction) {

		if (
			this.flags.waitingServerConfirmMove ||
			this.flags.isTranslating ||
			this.flags.isZooming
		) return;

		this.socket.emit('MOVE', direction);

		const nextPosition = this.map.checkMove(this.player, direction);

		if (nextPosition) {

			this.movePlayer(nextPosition, direction);

		} else {

			this.player.bump(direction);
		}
	}

	movePlayer(position, direction) {

		this.flags.waitingServerConfirmMove = true;

		this.flags.isTranslating = true;

		this.updateState(position, direction);

		this.map.translateCanvas({ duration: this.duration * 0.9 });

		this.animationTimeout(() => {

			this.map.render();

			this.flags.isTranslating = false;
		});

		this.player.render();
	}

	zoom(direction) {

		if (this.flags.isZooming || this.flags.isTranslating) return;

		const isZoomable = this.map.incrementMainNumCells(direction);

		if (!isZoomable) return;

		this.flags.isZooming = true;

		this.updateState();

		this.map.zoom();

		this.animationTimeout(() => {

			this.map.render();

			this.flags.isZooming = false;
		});

		this.player.render();
	}

	selectColor(index) {
		
		this.player.setColor(index);

		gameButtons.focusColorBtn(index);
	}

	fill() {

		const { position } = this.player;

		if (this.flags.waitingServerConfirmFill || this.flags.fill) return;

		if (!this.player.ownCells.includes(position)) {

			this.player.ownCells.push(position);
		}

		this.fillAnimation(position);

		const color = this.player.selectedColor.substring(1);

		this.map.gridState[position] = color;

		this.socket.emit("FILL", { position, color });

		this.flags.waitingServerConfirmFill = true;

		this.player.stamp();
	}
}
