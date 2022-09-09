import { indexToCoord } from '../../utils/converters';

export function getCoordInView(position, game) {

	const { rows, cols, map: { numCellsInView, offScreenCells }, player } = game;

	const absoluteCoord = indexToCoord(position, { rows, cols });

	const relativeCoord = absoluteCoord.map((coord, i) => {

		return coord - player.coord[i] + player.posInView[i] + offScreenCells;

	});

	if (isCoordInView(relativeCoord, numCellsInView, offScreenCells)) {

		return relativeCoord;

	}

}

const isCoordInView = ([x, y], numCellsInView, offScreenCells) => {

	return x > -offScreenCells &&
		y > -offScreenCells &&
		x - 1 <= numCellsInView[0] + offScreenCells &&
		y - 1 <= numCellsInView[1] + offScreenCells
};
