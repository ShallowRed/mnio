import Player from './components/player';
import GameMap from './components/map';
import Ui from './components/ui';
import Cell from './components/cell/cell';
import ScreenRatio from './utils/styleAccordingToRatio'

import listenServerEvents from './events/server';
import listenClickEvents from './events/click';
import listenKeyboardEvents from './events/keyboard';
import listenTouchEvents from './events/touchScreen';

import animationTimeout from './utils/animationTimeout';
import checkMove from './utils/checkMove';
import './utils/polyfill';

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

		this.gridState = gridState;

		this.playersPositions = playersPositions;

		this.rows = rows;

		this.cols = cols;

		this.ownCells = ownCells;

		this.allowedCells = allowedCells;

		this.map = new GameMap(this);

		this.player = new Player({ position, palette }, this);

		this.Ui = new Ui();

		this.Cell = new Cell(this);
	}

	init() {

		this.selectColor(0);

		this.Ui.focusColorBtn(0);

		this.render();

		this.listenWindowEvents();

		listenClickEvents(this);

		listenKeyboardEvents(this)

		listenTouchEvents(this);

		listenServerEvents(this);

		console.log(this);
	}

	listenWindowEvents() {

		const render = () => this.render();

		window.addEventListener('resize', render);

		window.addEventListener("orientationchange", () => {

			setTimeout(render, 500)
		});
	}

	render() {

		ScreenRatio.update();

		this.Ui.render();

		this.map.setView();

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

		const nextpos = checkMove(direction, this.player.position, this);

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

		animationTimeout(this, () => {
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

		animationTimeout(this, () => {
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

		this.Ui.focusColorBtn(index);
	}

	fill() {

		const { socket, flags, ownCells, gridState, Cell } = this;

		const { position, selectedColor } = this.player;

		if (flags.waitingServerConfirmFill || flags.fill) return;

		if (!ownCells.includes(position)) {

			ownCells.push(position);
		}

		Cell.fillAnimation(position, this);

		const color = selectedColor.substring(1);

		gridState[position] = color;

		socket.emit("FILL", { position, color });

		flags.waitingServerConfirmFill = true;

		this.player.stamp();
	}
}