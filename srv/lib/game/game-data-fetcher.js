export default class GameDataFetcher {

	constructor(tables, Pokedex, defaultRows, defaultCols) {

		this.tables = tables;

		this.Pokedex = Pokedex;

		this.defaultRows = defaultRows;

		this.defaultCols = defaultCols;
	}

	async fetch(gridId = null) {

		const gridsTable = await this.tables.create("grids");

		const previousGameData = gridId ?
			await gridsTable.select("*", { where: { "gridId": gridId }, limit: 1 }) :
			await gridsTable.select("*", { orderBy: 'lastMod DESC', limit: 1 });

		const timeStamp = Math.floor(Date.now() / 1000);

		const grid = previousGameData ?
			await this.getExistingGrid(previousGameData, timeStamp) :
			await this.createNewGrid(timeStamp);

		await this.createAndOrGetTables(grid.gridId);

		const gameData = await grid.fetch();

		const palettes = await this.tables.get("palettes")
			.select("*");

		return {
			...gameData,
			gridState: this.parseGridState(gameData),
			palettes: palettes.map(this.decodePalette)
		};
	}

	async getExistingGrid(gameData, timeStamp) {

		const {
			gridId,
			gridRows: rows,
			gridCols: cols,
			palettesLengths
		} = gameData;

		return {

			gridId,

			fetch: async () => {

				const gridEvents = await this.tables.get("gridEvents").select("*");

				this.tables.get('grids')
					.update({ "lastMod": timeStamp }, { where: { "gridId": gridId } });

				return {
					gridEvents,
					palettesLengths,
					rows,
					cols
				}
			}
		};
	}

	async createNewGrid(timeStamp) {

		const palettesLengths = this.Pokedex.lengths;
		const rows = this.defaultRows;
		const cols = this.defaultCols;

		const insertId = await this.tables.get('grids').insert({
			"gridRows": rows,
			"gridCols": cols,
			"palettesId": this.Pokedex.id,
			"palettesLengths": palettesLengths,
			"lastMod": timeStamp,
			"isOver": 0
		});

		return {

			gridId: insertId,

			fetch: async () => {

				await this.insertPalettes(this.Pokedex.palettes);

				return {
					palettesLengths,
					rows,
					cols
				}
			}
		};
	}

	async createAndOrGetTables(gridId) {

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
			colors: colors
				.match(/.{1,6}/g)
				.map(color => `#${color}`)
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