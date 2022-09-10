export function getCellCoordsInView(position, game) {

	const { map: { numCellsInView, offScreenCells }, player } = game;

	const absoluteCoord = game.map.indexToCoords(position);

	const relativeCoord = absoluteCoord.map((coords, i) => {

		return coords - player.coords[i] + player.posInView[i] + offScreenCells;

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
