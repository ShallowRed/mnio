import { fillCell, roundSquare } from './drawCanvas';
import { getCellCoordsInView } from './checkPosInView';

export default {

	clear(position) {

		const coords = getCellCoordsInView(position, this);

		if (!coords) return;

		fillCell(coords,this.map.cellSize, this.map.ctx[2], null);
	},

	renderColor(position) {

		const coords = getCellCoordsInView(position, this);

		if (!coords) return;

		fillCell(coords, this.map.cellSize, this.map.ctx[1], `#${this.map.gridState[position]}`);

	},

	renderAllowedCell(position) {

		const coords = getCellCoordsInView(position, this);

		if (!coords) return;

		fillCell(coords, this.map.cellSize, this.map.ctx[0], '#e9e9e9');
	},

	renderPosition(position) {

		const coords = getCellCoordsInView(position, this);

		if (!coords) return;

		const shift = Math.round(this.map.cellSize / 8);

		roundSquare(coords,  this.map.cellSize,  this.map.ctx[2], shift);
	}
}