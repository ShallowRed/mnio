import Pokedex from '#database/pokedex';

import GameMap from '#game/map';
import { Players } from '#game/players';

import Debug from '#config/debug';
const debug = Debug('game     |');

import clientConnections from '#game/client-connections';

// to end game: "UPDATE grids SET isOver = ? WHERE gridId = ?"
const gameDate = Math.floor(Date.now() / 1000);

export default class Game {

	constructor(io, tables, socketSessionStore, socketSessionMiddleware, { DEFAULT_ROWS, DEFAULT_COLS }) {

		this.io = io;

		this.tables = tables;

		this.sessionStore = socketSessionStore;

		this.socketSessionMiddleware = socketSessionMiddleware;

		this.defaultRows = DEFAULT_ROWS;
		this.defaultCols = DEFAULT_COLS;
	}

	async init(tables) {

		this.players = new Players();

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

	getShuffledPalettes(palette) {

		return [...this.palettes].sort(() => Math.random() - 0.5);
	}

	async fetchPlayerData(userId, paletteId) {

		let palette = await this.tables.get('palettes')
			.select('*', { where: { "paletteId": paletteId }, limit: 1 });

		palette = Object.keys(palette)
			.filter(key => key.match(/color/))
			.map(key => `#${palette[key]}`);

		let ownCells = await this.tables.get('gridEvents')
			.select('cellid', { where: { "userId": userId } });

		ownCells = ownCells?.map(({ cellid }) => cellid) ?? []

		const position = ownCells.length ?
			ownCells[0] :
			this.map.getRandomPosition();

		return {
			position,
			palette,
			ownCells
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
			// this.tables.create("gridUsers", gridId),
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