import { fillCell, roundSquare } from './drawCanvas';
import { getCoordInView } from './checkPosInView';
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

			const coord = getCoordInView(position, this.game);

			if (!coord) return;

			const { ctx, cellSize } = this.game.map;

			fillCell(coord, cellSize, ctx[2], null);
		},

		color: (position) => {

			const coord = getCoordInView(position, this.game);

			if (!coord) return;

			const { colors, map: { ctx, cellSize } } = this.game;

			fillCell(coord, cellSize, ctx[1], `#${colors[position]}`);

		},

		allowedCells: (position) => {

			const coord = getCoordInView(position, this.game);

			if (!coord) return;

			const { ctx, cellSize } = this.game.map;

			fillCell(coord, cellSize, ctx[0], '#e9e9e9');
		},

		position: (position) => {

			const coord = getCoordInView(position, this.game);

			if (!coord) return;

			const { ctx, cellSize } = this.game.map;

			const shift = Math.round(cellSize / 8);

			roundSquare(coord, cellSize, ctx[2], shift);
		}
	}
}