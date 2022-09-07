import Debug from '#config/debug';
const debug = Debug('game     |');

export class Players {

	collection = {};

	constructor() { }

	set(socket, data) {

		debug(`Saving data in game players collection for socketId '${socket.id}'`);

		if (!socket.request.sessionId) {

			debug(`SocketId '${socket.id}' has no sessionId, redirecting to /login`);

			socket.emit('redirect', '/');

			return;
		}

		this.collection[socket.request.sessionId] = data;
	}

	get(socket) {

		debug(`Getting data from game players collection for socketId '${socket.id}'`);

		if (!socket.request.sessionId) {

			debug(`SocketId '${socket.id}' has no sessionId, redirecting to /login`);

			socket.emit('redirect', '/');

			return;
		}

		return this.collection[socket.request.sessionId];
	}

	delete(socket) {

		if (this.getSession(socket)) {

			debug(`Deleting data from game players collection for socketId '${socket.id}'`);

			delete this.collection[socket.request.sessionId];
		}
	}
}

export class Player {

	constructor({ userId, position, palette, ownCells }) {

		this.userId = userId;

		this.palette = palette;

		this.ownCells = ownCells;

		this.position = position;
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