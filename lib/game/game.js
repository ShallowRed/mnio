import GameMap from '#game/map';
import Players from '#game/players';

import Debug from '#config/debug';
const debug = Debug('game     |');

import clientConnections from '#game/client-connections';

export default class Game {

	constructor(io, tables) {

		this.io = io;

		this.tables = tables;

		this.clientConnections = clientConnections;
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

		this.map = new GameMap(this, { gridState, rows, cols });

		this.players = new Players(this);

		for (const namespace in this.clientConnections) {

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

	getPalette(paletteId) {

		return this.palettes.find(palette => palette.paletteId === paletteId)?.colors;
	}

	fetchPlayerOwnCells(userId) {

		return this.tables.get('gridEvents')
			.select('cellid', { where: { "userId": userId } });
	}

	end() {

		debug(`No more empty cells in grid, ending game`);

		"UPDATE grids SET isOver = ? WHERE gridId = ?"
	}
}
