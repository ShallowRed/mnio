import { Tables } from '#database/tables';
import database from '#database/client-events';

import Debug from '#debug';
const debug = Debug('game:player');

export default class PlayersFactory {

	collection = {};

	constructor(map) {
		this.map = map;
	}

	set(socket, data) {

		debug("Adding new player to game collection");

		this.collection[socket.request.sessionId] = data;
	}

	get(socket) {

		debug("Getting player from game collection");

		return this.collection[socket.request.sessionId];
	}

	delete(socket) {

		debug("Deleting player from game collection");

		if (this.getSession(socket)) {

			delete this.collection[socket.request.sessionId];
		}
	}

	async createExisting(socket, { position, playerid , palette, ownCells}) {

		debug("Creating existing player:", playerid);

		const player = new Player({ playerid, palette, position, ownCells }, this.map);

		this.set(socket, player);

		return player;
	}

	async createNew(socket, { paletteid }) {

		debug("Retrieving creds from players collection");

		const creds = this.get(socket);

		debug("Creating new player:", creds);

		const playerid = await Tables.get("creds").insert({
			username: creds.userName,
			password: creds.password
		});

		debug("Saving player palette:", playerid, paletteid);

		await Tables.get("palettes").insert({
			playerid,
			paletteid
		});

		const palette = await database.getColors(paletteid);

		const player = new Player({ playerid, palette }, this.map);

		this.set(socket, player);

		socket.emit("redirect", "/game");

		return player;
	}
}

class Player {

	constructor(params, map) {

		const { playerid, position, palette, ownCells } = params;

		this.map = map;

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

		this.allowedCells = this.ownCells.reduce((cells, position) => {

			const coords = this.map.indexToCoords(position);

			const newNeighbours = this.map.getNeighboursCoords(coords)
				.filter(coords => this.map.areCoordsInBounds(coords))
				.map(coords => this.map.coordsToIndex(coords))
				.filter(position => !this.ownCells.includes(position))

			cells.push(...newNeighbours);

			return cells;

		}, []);

		this.allowedCells.push(this.position);
	}
}