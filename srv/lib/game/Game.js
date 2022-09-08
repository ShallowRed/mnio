import GameMap from '#game/map';
import { Players } from '#game/players';

import Debug from '#config/debug';
const debug = Debug('game     |');

import clientConnections from '#game/client-connections';

// to end game: "UPDATE grids SET isOver = ? WHERE gridId = ?"

export default class Game {

	constructor(io, tables, { DEFAULT_ROWS, DEFAULT_COLS }) {

		this.io = io;

		this.tables = tables;

		this.defaultRows = DEFAULT_ROWS;

		this.defaultCols = DEFAULT_COLS;
	}

	async init( { palettes, gridState, rows, cols }) {

		this.palettes = palettes;

		this.map = new GameMap({ gridState, rows, cols });

		this.players = new Players(this.tables, this.map, this.palettes);

		for (const namespace in clientConnections) {

			this.io.of(namespace)
				.on('connection', socket => {

					const session = socket.request?.session?.passport?.user;

					if (!session) {

						debug.error(`No session found for socket ${socket.id} connected at namespace ${namespace}`);

						return;
					}

					clientConnections[namespace].call(this, socket, session);
				});
		}
	}

	getShuffledPalettes() {

		return [...this.palettes].sort(() => Math.random() - 0.5);
	}
}