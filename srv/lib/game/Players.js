import Debug from '#debug';
const debug = Debug('game     |');

export default class Players {

	collection = {};

	constructor() { }

	set(socket, data) {

		debug(`Saving data in game players collection for socketId '${socket.id}'`);

		this.collection[socket.request.sessionId] = data;
	}

	get(socket) {

		debug(`Getting data from game players collection for socketId '${socket.id}'`);

		return this.collection[socket.request.sessionId];
	}

	delete(socket) {

		if (this.getSession(socket)) {

			debug(`Deleting data from game players collection for socketId '${socket.id}'`);

			delete this.collection[socket.request.sessionId];
		}
	}

	create(socket, { userId, palette, position, ownCells }, map) {

		debug(`Creating new player with socketId '${socket.id}' and userId '${userId}'`);

		const player = new Player({ userId, palette, position, ownCells });

		player.updateAllowedCells(map);

		this.set(socket, player);

		return player;
	}
}

class Player {

	constructor({ userId, position, palette, ownCells }) {

		this.userId = userId;

		this.palette = palette;

		this.ownCells = ownCells;

		this.position = position;
	}

	updateOwnedCells(position) {

		if (!this.ownCells.includes(position)) {

			this.ownCells.push(position);

			return true;
		}
	}

	updateAllowedCells(map) {

		this.allowedCells = this.ownCells.reduce((cells, position) => {

			const newNeighbours = map.getNeighbours(position)
				.filter(position => !this.ownCells.includes(position))

			cells.push(...newNeighbours);

			return cells;

		}, []);
	}
}