export default class SharedGameMap {

	constructor({ gridState, cols, rows }) {

		this.gridState = gridState;
		
		this.cols = cols;
		
		this.rows = rows;
	}

	indexToCoords(index) {

		const x = index % this.cols;

		const y = (index - x) / this.rows;

		return [x, y];
	}

	coordsToIndex([x, y]) {

		return this.cols * y + x;
	}

	checkMove(player, direction) {

		let [x, y] = this.indexToCoords(player.position);

		if (direction == "left" && x !== 0) {

			x--;

		} else if (direction == "right" && x !== this.cols - 1) {

			x++;

		} else if (direction == "up" && y !== 0) {

			y--;

		} else if (direction == "down" && y !== this.rows - 1) {

			y++;

		} else {

			return;
		}

		const targetPosition = this.coordsToIndex([x, y]);

		if (this.isAvailable(targetPosition, player)) {

			return targetPosition;
		}
	}

	isAvailable(position, player) {

		return (
			player.ownCells.includes(position) ||
			(
				player.allowedCells.includes(position) &&
				!this.game.players.positions.includes(position) &&
				!this.gridState[position]
			)
		);
	}
}