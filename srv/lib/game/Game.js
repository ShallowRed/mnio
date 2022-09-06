import Tables from '#database/tables';
import Pokedex from '#database/pokedex';
import GAME_TABLES from '#database/tables-config';

import GameMap from '#game/map';
import Players from '#game/players';

import Debug from '#debug';
const debug = Debug('game     |');

import clientConnections from '#game/client-connections';
import connection from '#database/connection';

// to end game: "UPDATE grids SET isOver = ? WHERE gridId = ?"
const gameDate = Math.floor(Date.now() / 1000);

export default class Game {

	constructor(io, socketSessionStore, socketSessionMiddleware, { DEFAULT_ROWS, DEFAULT_COLS }) {

		this.io = io;

		this.sessionStore = socketSessionStore;

		this.socketSessionMiddleware = socketSessionMiddleware;

		this.defaultRows = DEFAULT_ROWS;
		this.defaultCols = DEFAULT_COLS;
	}

	async init(DB) {

		this.players = new Players();

		this.tables = new Tables(GAME_TABLES, new connection.Pool(DB));

		const { palettes, gridState, rows, cols } = await this.getGameData();

		this.palettes = palettes;

		this.map = new GameMap({ gridState, rows, cols });

		for (const namespace in clientConnections) {

			debug(`Initializing socket.io namespace: ${namespace}`);

			this.io
				.of(namespace)
				.use(this.socketSessionMiddleware)
				.on('connection', clientConnections[namespace].bind(this));
		}
	}

	async fetchPlayerData(userId) {

		const joined = await this.tables.get('gridPalettes')
			.join('palettes', { on: { 'paletteId': 'paletteId' } })
			.select('*', { where: { "userId": userId }, limit: 1 });

		const palette = Object.keys(joined)
			.filter(key => key.match(/color/))
			.map(key => `#${joined[key]}`);

		const ownCells = await this.tables.get('gridEvents')
			.select('cellid', { where: { "userId": userId } });

		return {
			palette,
			ownCells: ownCells?.map(({ cellid }) => cellid) ?? []
		};
	}

	async getGameData() {

		const gamesTable = await this.tables.create("grids");

		const lastGame = await gamesTable.select("*", { orderBy: 'gridId DESC', limit: 1 });

		const gameData = lastGame ?
			await this.fetchLastGame(lastGame) :
			await this.createNewGame();

		gameData.palettes = await this.getPalettes();

		return gameData;
	}

	async fetchLastGame(lastGame) {

		const { gridId, gridRows, gridCols } = lastGame;

		await this.createGameTables(gridId);

		const gridEvents = await this.tables.get("gridEvents").select("*");

		const gridState = this.parseGridState(gridEvents, gridRows, gridCols);

		this.tables.get('grids')
			.update({ "lastMod": gameDate }, { where: { "gridId": gridId } });

		return { gridState, gridId, rows: gridRows, cols: gridCols };
	}

	async createNewGame() {

		const gridId = await this.tables.get('grids').insert({
			gridRows: this.defaultRows,
			gridCols: this.defaultCols,
			lastMod: gameDate,
			palettesId: Pokedex.id,
			isOver: 0
		});

		await this.createGameTables(gridId);

		await this.fillPalettes(Pokedex);

		const gridState = this.getEmptyGridState({ rows: this.defaultRows, cols: this.defaultCols });

		return { gridState, gridId, rows: this.defaultRows, cols: this.defaultCols };
	}

	async createGameTables(gridId) {

		return Promise.all([
			this.tables.create("gridEvents", gridId),
			this.tables.create("gridPalettes", gridId),
			this.tables.create("gridUsers", gridId),
			this.tables.create("palettes", Pokedex.id)
		]);
	}

	async fillPalettes(Pokedex) {

		const table = this.tables.get("palettes", Pokedex.id);

		return Promise.all(
			Pokedex.palettes.map(async (palette) => {
				return table.insert({
					color1: palette[0],
					color2: palette[1],
					color3: palette[2],
					color4: palette[3],
					color5: palette[4]
				});
			})
		);
	}

	async getPalettes() {

		const palettes = await this.tables.get('palettes')
			.select("*");

		return palettes.map(({ paletteId, ...colors }) => {

			return {
				id: paletteId,
				colors: Object.values(colors).map(color => `#${color}`)
			};
		});
	}

	parseGridState(gridEvents, rows, cols) {

		const gridState = this.getEmptyGridState({ rows, cols });

		let i = 0;

		for (i; i < gridEvents.length; i++) {

			const { cellid, color } = gridEvents[i];

			gridState[cellid] = color;

		}

		return gridState;
	}

	getEmptyGridState({ rows, cols }) {

		return new Array(rows * cols).fill(null);
	}
}