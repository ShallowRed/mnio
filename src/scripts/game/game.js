import Player from './player';
import GameMap from './map';
import gameButtons from './game-buttons';

import listenServerEvents from './events/server';
import listenClickEvents from './events/click';
import listenKeyboardEvents from './events/keyboard';
import listenTouchEvents from './events/touchScreen';

import fillAnimation from './utils/fillAnimation';

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
	}

	init() {

		this.selectColor(0);

		gameButtons.focusColorBtn({ index: 0 });

		this.render();

		this.listenWindowEvents();

		listenClickEvents(this);

		listenKeyboardEvents.call(this);

		listenTouchEvents(this);

		listenServerEvents.call(this);

	}

	listenWindowEvents() {

		window.addEventListener('resize', () => {

			this.render();
		});

		window.addEventListener("orientationchange", () => {

			setTimeout(this.render, 500)
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

		const nextpos = this.map.checkMove(this.player, direction);

		if (nextpos) {

			this.movePlayer(nextpos, direction);

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

		const { selectedColor, palette } = this.player;

		const next =
			index == "next" ? 1 :
				index == "prev" ? palette.length - 1 :
					null;

		if (next) {

			index = (palette.indexOf(selectedColor) + next) % palette.length;
		}

		this.player.setColor(index);

		gameButtons.focusColorBtn({ index });
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

	animationTimeout(callback, start = Date.now(), delay) {

		delay ??= this.duration;

		const delta = (Date.now() - start) / 1000;

		if (this.flags.fill) {

			delay += 0.015;
		}

		if (delta >= delay) {

			callback();

			return;
		}

		window.requestAnimationFrame(() => {

			this.animationTimeout(callback, start, delay)
		});
	}
}
