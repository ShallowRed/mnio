module.exports = class Map {

	constructor(gameData) {

		this.playersPositions = [];

		Object.assign(this, gameData);
	}

	newPosition([lastPos, newPos]) {

		const positions = this.playersPositions;

		if (lastPos) {
			positions.splice(positions.indexOf(lastPos), 1);
		}

		if (newPos && !positions.includes(newPos)) {
			positions.push(newPos);
		}
	}

	saveFill({ position, color }) {

		this.gridState[position] = color;
	}

	get emptyCells() {

		return this.gridState.filter(e => e === null);
	}

	randomPosition() {

		if (!this.emptyCells.length) {

			return "end";
		}

		const emptyCellsIndexes = this.gridState
			.map((cell, i) => cell ?? i)
			.filter(Boolean);

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

	getNeighboursCoords([x, y]) {

		return [
			[x, y],
			[x - 1, y],
			[x + 1, y],
			[x, y - 1],
			[x, y + 1]
		];
	};


}
