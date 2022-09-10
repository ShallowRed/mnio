export default {

	isPositionInBounds(position) {

		const coords = this.indexToCoords(position);

		return this.areCoordsInBounds(coords);
	},

	areCoordsInBounds([x, y]) {

		return (
			x >= 0 &&
			y >= 0 &&
			x < this.cols &&
			y < this.rows
		);
	},

	indexToCoords(index) {

		const x = index % this.cols;

		const y = (index - x) / this.rows;

		return [x, y];
	},

	coordsToIndex([x, y]) {

		return this.cols * y + x;
	},

	getNeighbours(position) {

		const coords = this.indexToCoords(position);

		return this.getNeighboursCoords(coords)
			.filter(coords => this.areCoordsInBounds(coords))
			.map(coords => this.coordsToIndex(coords));
	},

	getNeighboursCoords([x, y]) {

		return [
			[x - 1, y],
			[x + 1, y],
			[x, y - 1],
			[x, y + 1]
		];
	},

	checkMove(direction) {

		const { map, player } = this;

		let [x, y] = this.game.map.indexToCoords(player.position);

		if (direction == "left" && x !== 0) {

			x--;

		} else if (direction == "right" && x !== map.cols - 1) {

			x++;

		} else if (direction == "up" && y !== 0) {

			y--;

		} else if (direction == "down" && y !== map.rows - 1) {

			y++;

		} else {

			return;
		}

		const targetPosition = map.coordsToIndex([x, y]);

		if (player.ownCells.includes(targetPosition) || (
			player.allowedCells.includes(targetPosition) &&
			!map.playersPositions.includes(targetPosition) &&
			!map.gridState[targetPosition]
		)) {

			return targetPosition;
		}
	},

	// isAvailable(position) {

	// 	const { map, player } = this;

	// 	return (
	// 		player.ownCells.includes(position) ||
	// 		(
	// 			player.allowedCells.includes(position) &&
	// 			!map.playersPositions.includes(position) &&
	// 			!map.gridState[position]
	// 		)
	// 	);
	// }
};