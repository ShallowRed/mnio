export default class {

	constructor(tables, Pokedex, defaultRows, defaultCols) {

		this.tables = tables;

		this.Pokedex = Pokedex;

		this.defaultRows = defaultRows;

		this.defaultCols = defaultCols;
	}

	async getGameData(gridId = null) {

		const gamesTable = await this.tables.create("grids");

		const previousGameData = gridId ?
			await gamesTable.select("*", { where: { "gridId": gridId }, limit: 1 }) :
			await gamesTable.select("*", { orderBy: 'lastMod DESC', limit: 1 });

		const timeStamp = Math.floor(Date.now() / 1000);

		const gameData = previousGameData ?
			await this.getExistingGameData(previousGameData, timeStamp) :
			await this.createNewGame(timeStamp);

		const palettes = await this.tables.get("palettes")
			.select("*");

		return {
			...gameData,
			gridState: this.parseGridState(gameData),
			palettes: palettes.map(this.decodePalette)
		};
	}

	async getExistingGameData(gameData, timeStamp) {

		const {
			gridId,
			gridRows: rows,
			gridCols: cols,
			palettesLengths
		} = gameData;

		await this.createTables(gridId);

		const gridEvents = await this.tables.get("gridEvents").select("*");

		this.tables.get('grids')
			.update({ "lastMod": timeStamp }, { where: { "gridId": gridId } });

		return {
			gridId,
			gridEvents,
			palettesLengths,
			rows,
			cols
		};
	}

	async createNewGame(timeStamp) {

		const palettesLengths = this.Pokedex.lengths;
		const rows = this.defaultRows;
		const cols = this.defaultCols;

		const gridId = await this.tables.get('grids').insert({
			"gridRows": rows,
			"gridCols": cols,
			"palettesId": this.Pokedex.id,
			"palettesLengths": palettesLengths,
			"lastMod": timeStamp,
			"isOver": 0
		});

		await this.createTables(gridId);

		await this.insertPalettes(this.Pokedex.palettes);

		return {
			gridId,
			palettesLengths,
			rows,
			cols
		};
	}

	async createTables(gridId) {

		return Promise.all([
			this.tables.create("gridUsers", gridId),
			this.tables.create("gridEvents", gridId),
			this.tables.create("palettes", this.Pokedex.id, 6 * this.Pokedex.lengths)
		]);
	}

	async insertPalettes(palettes) {

		const table = this.tables.get("palettes");

		return Promise.all(palettes
			.map(this.encodePalette)
			.map(palette => table.insert(palette))
		);
	}

	encodePalette(palette, i) {
		return {
			"paletteId": i + 1,
			"colors": palette.join(''),
		};
	}

	decodePalette({ paletteId, colors }) {
		return {
			id: paletteId,
			colors: colors.match(/.{1,6}/g).map(color => `#${color}`)
		};
	};

	parseGridState({ rows, cols, gridEvents = null }) {

		const gridState = new Array(rows * cols).fill(null);

		if (gridEvents) {

			let i = 0;

			for (i; i < gridEvents.length; i++) {

				const { cellid, color } = gridEvents[i];

				gridState[cellid] = color;
			}
		}

		return gridState;
	}
}