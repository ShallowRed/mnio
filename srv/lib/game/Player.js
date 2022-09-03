module.exports = class PlayersFactory {

	constructor(database, map) {
		this.map = map;
		this.database = database;
	}

	async createExisting({ position, playerid }) {

		console.log("Creating existing player:", playerid);

		const palette = await this.database.getPlayerPalette(playerid);

		const ownCells = await this.database.getPlayerOwnCells(playerid);

		return new Player({ playerid, palette, position, ownCells }, this.map, this.database);
	}

	async createNew(index, creds) {

		const playerid = await this.database.saveCredentials(creds);

		console.log("Creating new player:", playerid);

		const palette = await this.database.savePlayerPalette(playerid, index);

		const player = new Player({ playerid, palette }, this.map, this.database);

		return player;
	}
}

class Player {

	constructor(params, map, database) {

		const { playerid, position, palette, ownCells } = params;

		this.map = map;

		// this.database = new database.playerDatabase(playerid);

		this.playerid = playerid;
		this.palette = palette;
		this.ownCells = ownCells || [];
		this.position = position || this.ownCells[0] || this.map.randomPosition()

		this.updateOwnedCells(this.position);
		this.updateAllowedCells();
	}

	updateOwnedCells(position) {

		if (!this.ownCells.includes(position)) {

			this.ownCells.push(position);

			return true;
		}
	}

	updateAllowedCells() {

		return this.ownCells.reduce((cells, position) => {

			console.log(cells);

			const coords = this.map.indexToCoords(position);

			const newNeighbours = this.map.getNeighboursCoords(coords)
				.filter(coords => this.map.areCoordsInBounds(coords))
				.map(coords => this.map.coordsToIndex(coords))
				.filter(position => !this.ownCells.includes(position))


			cells.push(...newNeighbours);

			return cells;

		}, []);
	}
}