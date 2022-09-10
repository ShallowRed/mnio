import { fillCell, roundSquare } from './drawCanvas';
import { getCellCoordsInView } from './checkPosInView';
import { fillAnimation } from './fillAnimation';

export default class Cell {

	render = {};

	constructor(game) {

		this.game = game;
	}

	fillAnimation = (position) => {

		fillAnimation(position, this.game);
	}

	render = {
		
		clear: (position) => {

			const coords = getCellCoordsInView(position, this.game);

			if (!coords) return;

			const { ctx, cellSize } = this.game.map;

			fillCell(coords, cellSize, ctx[2], null);
		},

		color: (position) => {

			const coords = getCellCoordsInView(position, this.game);

			if (!coords) return;

			const { gridState, map: { ctx, cellSize } } = this.game;

			fillCell(coords, cellSize, ctx[1], `#${gridState[position]}`);

		},

		allowedCells: (position) => {

			const coords = getCellCoordsInView(position, this.game);

			if (!coords) return;

			const { ctx, cellSize } = this.game.map;

			fillCell(coords, cellSize, ctx[0], '#e9e9e9');
		},

		position: (position) => {

			const coords = getCellCoordsInView(position, this.game);

			if (!coords) return;

			const { ctx, cellSize } = this.game.map;

			const shift = Math.round(cellSize / 8);

			roundSquare(coords, cellSize, ctx[2], shift);
		}
	}
}
