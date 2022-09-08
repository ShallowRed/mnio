import GameMap from '#game/map';
import { Players } from '#game/players';

import Debug from '#config/debug';
const debug = Debug('game     |');

import clientConnections from '#game/client-connections';

// to end game: "UPDATE grids SET isOver = ? WHERE gridId = ?"

export default class Game {

	constructor(io, tables) {

		this.io = io;

		this.tables = tables;
	}

	async init({
		palettes,
		palettesLengths,
		gridState,
		rows,
		cols
	}) {

		this.palettes = palettes;

		this.palettesLengths = palettesLengths;

		this.map = new GameMap({ gridState, rows, cols });

		this.players = new Players(this);

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