export default class {

	constructor(tables, Pokedex, defaultRows, defaultCols) {

		this.tables = tables;

		this.Pokedex = Pokedex;

		this.defaultRows = defaultRows;

		this.defaultCols = defaultCols;
	}

	async getGameData() {

		const gamesTable = await this.tables.create("grids");

		const lastGame = await gamesTable.select("*", { orderBy: 'gridId DESC', limit: 1 });

		const timeStamp = Math.floor(Date.now() / 1000);

		const gameData = lastGame ?
			await this.fetchLastGame(lastGame, timeStamp) :
			await this.createNewGame(timeStamp);

		gameData.palettes = await this.getPalettes();

		return gameData;
	}

	async fetchLastGame(lastGame, timeStamp) {

		const { gridId, gridRows, gridCols } = lastGame;

		await this.createTables(gridId);

		const gridEvents = await this.tables.get("gridEvents").select("*");

		const gridState = this.parseGridState(gridEvents, gridRows, gridCols);

		this.tables.get('grids')
			.update({ "lastMod": timeStamp }, { where: { "gridId": gridId } });

		return { gridState, gridId, rows: gridRows, cols: gridCols };
	}

	async createNewGame(timeStamp) {

		const gridId = await this.tables.get('grids').insert({
			gridRows: this.defaultRows,
			gridCols: this.defaultCols,
			lastMod: timeStamp,
			palettesId: this.Pokedex.id,
			isOver: 0
		});

		await this.createTables(gridId);

		await this.fillPalettes(this.Pokedex);

		const gridState = getEmptyGridState({ rows: this.defaultRows, cols: this.defaultCols });

		return { gridState, gridId, rows: this.defaultRows, cols: this.defaultCols };
	}

	async createTables(gridId) {

		return Promise.all([
			this.tables.create("gridUsers", gridId),
			this.tables.create("gridEvents", gridId),
			this.tables.create("palettes", this.Pokedex.id, 6 * this.Pokedex.lengths)
		]);
	}

	async fillPalettes() {

		const table = this.tables.get("palettes");

		return Promise.all(
			this.Pokedex.palettes.map((palette, i) => {
				return table.insert({
					'paletteId': i + 1,
					'colors': palette.join(''),
				});
			})
		);
	}

	async getPalettes() {

		const palettes = await this.tables.get("palettes")
			.select("*");

		return palettes.map(({ paletteId, colors }) => {
			return {
				id: paletteId,
				colors: colors.match(/.{1,6}/g).map(color => `#${color}`)
			};
		})
	}

	parseGridState(gridEvents, rows, cols) {

		const gridState = getEmptyGridState({ rows, cols });

		let i = 0;

		for (i; i < gridEvents.length; i++) {

			const { cellid, color } = gridEvents[i];

			gridState[cellid] = color;

		}

		return gridState;
	}
}

function getEmptyGridState({ rows, cols }) {

	return new Array(rows * cols).fill(null);
}