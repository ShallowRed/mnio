export default class GameMap {

	playersPositions = [];

	constructor(game, { gridState, rows, cols }) {

		this.game = game;

		this.gridState = gridState;

		this.rows = rows;

		this.cols = cols;
	}

	newPosition({ from: lastPosition, to: newPosition }) {

		const positions = this.playersPositions;

		if (lastPosition) {

			positions.splice(positions.indexOf(lastPosition), 1);
		}

		if (newPosition && !positions.includes(newPosition)) {

			positions.push(newPosition);
		}
	}

	saveFill({ position, color }) {

		this.gridState[position] = color;
	}

	getRandomPosition() {

		const emptyCellsIndexes = this.gridState
			.map((cell, i) => cell ?? i)
			.filter(Boolean);

		if (!emptyCellsIndexes.length) {

			this.game.end();

			return false;
		}

		const randomIndex = Math.floor(Math.random() * emptyCellsIndexes.length);

		return emptyCellsIndexes[randomIndex];
	}

	isPositionInBounds(position) {

		const coords = this.indexToCoords(position);

		return this.areCoordsInBounds(coords);
	}

	areCoordsInBounds([x, y]) {

		return (
			x >= 0 &&
			y >= 0 &&
			x < this.cols &&
			y < this.rows
		);
	}

	indexToCoords(index) {

		const x = index % this.cols;

		const y = (index - x) / this.rows;

		return [x, y];
	}

	coordsToIndex([x, y]) {

		return this.cols * y + x;
	}

	getNeighbours(position) {

		const coords = this.indexToCoords(position);

		return this.getNeighboursCoords(coords)
			.filter(coords => this.areCoordsInBounds(coords))
			.map(coords => this.coordsToIndex(coords));
	}

	getNeighboursCoords([x, y]) {

		return [
			[x - 1, y],
			[x + 1, y],
			[x, y - 1],
			[x, y + 1]
		];
	};
}
