const { pool } = require('@database/connection');
const { rows, cols } = require('@config');

const Pokedex = require('@database/pokedex.js');

const debug = require('@debug')('database');

module.exports = async () => {

	const lastGame = await getLastGame();
	
	if (lastGame) {

		return await fetchLastGame(lastGame);

	} else {

		return await initNewGame();
	}
};

const getLastGame = async () => {

	try {
		const lastGame = await pool.query("getLastGame");

		if (lastGame.length && !lastGame[0].flag) {

			return lastGame[0];
		}

	} catch {

		return null;
	}
};

const fetchLastGame = async ({ usedrows, usedcols, gameid }) => {

	debug("Retreiving last game :", { usedrows, usedcols, gameid });

	const gridState = await getGridState(gameid, { usedrows, usedcols });

	pool.query("updateTime", [pool.GameDate, gameid]);

	return { gridState, gameid, rows: usedrows, cols: usedcols };
};

const getGridState = async (gameid, { usedrows, usedcols }) => {

	const gridEvents = await pool.query("getGridState", gameid);

	const gridState = new Array(usedrows * usedcols).fill(null);

	for (const { cellid, color } of gridEvents) {

		gridState[cellid] = color;
	}

	return gridState;
}

const initNewGame = async () => {

	const gameid = await saveGameNGetId();

	debug("Creating new game :", { rows, cols, gameid });
	
	createGridTable(gameid);
	
	createPalettesTable(gameid);
	
	createCredsTable(gameid);
	
	createPokedex();
	
	const gridState = new Array(rows * cols).fill(null);
	
	return { gridState, gameid, rows, cols };
};

const saveGameNGetId = async () => {

	await pool.query("saveGame", [rows, cols, pool.GameDate]);
	
	return 1;
	
	const gameid = await getLastGameId();

	debug(`Game n°${gameid} created`);

	return gameid;
}

const getLastGameId = async () => {

	const lastGame = await pool.query("getLastGame", [pool.GameDate]);
	
	return lastGame[0].gameid;
};

const createGridTable = async (gameid) => {
	
	await pool.query("createGridTable", gameid);

	debug(`Grid table created with name : game_${gameid}__grid`);
};

const createPalettesTable = async (gameid) => {
	
	await pool.query("createPalettesTable", gameid);
	
	debug(`Palettes table created with name : game_${gameid}__palettes`);
};

const createCredsTable = async (gameid) => {
	
	await pool.query("createCredsTable", gameid);
	
	debug(`Creds table created with name : game_${gameid}__creds`);
};

const createPokedex = async () => {
	
	await pool.query("createPokedex");
	
	debug(`Pokedex table created with name : pokedex_i`);
	
	Pokedex.forEach(palette => {
		pool.query("fillPokedex", palette);
	});
}

// const createPokedex = async gameid => {
//   await pool.query("createPokedex", gameid);
//   debug(
//     `Pokedex table created with name : pokedex_i`);
//   Pokedex.forEach(palette => {
//     pool.query("fillPokedex", [gameid, ...palette.map(c => c.substring(1))]);
//   });
// }