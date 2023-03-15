import SharedGameMap from '#shared/map';

export default class GameMap extends SharedGameMap {

	constructor(game, { gridState, rows, cols }) {

		super({ gridState, rows, cols });

		this.game = game;
	}

	saveFill({ position, color }) {

		this.gridState[position] = color;
	}

	getRandomPosition() {

		const emptyCellsIndexes = this.gridState
			.map((cell, i) => !cell && i || null)
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
	}
}
