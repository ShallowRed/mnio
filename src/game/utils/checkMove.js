import { indexToCoord, coordToIndex } from './converters';

export default function checkmove(dir, position, game) {

	const { rows, cols } = game;

	let [x, y] = indexToCoord(position, { cols, rows });

	if (dir == "left" && x !== 0) x--;

	else if (dir == "right" && x !== cols - 1) x++;

	else if (dir == "up" && y !== 0) y--;

	else if (dir == "down" && y !== rows - 1) y++;

	else return;

	const nextpos = coordToIndex([x, y], { cols });

	if (isAvailable(nextpos, game)) {

		return nextpos;
	}
}

const isAvailable = (nextpos, { ownCells, allowedCells, gridState, playersPositions }) => {

	return (
		ownCells.includes(nextpos) ||
		(
			allowedCells.includes(nextpos) &&
			!playersPositions.includes(nextpos) &&
			!gridState[nextpos]
		)
	);
}
