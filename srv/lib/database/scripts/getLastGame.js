const { query, sQuery, GameDate } = require('../mysql');
const { rows, cols } = require('../../config');
// const Pokedex = require('../../../data/pokedex/pokedex-2.min.json');

const Pokedex = require('../pokedex.js');

// const debug = require('debug')('mnio');
const debug = console.log;

module.exports = async () => {
  const lastGame = await getLastGame();
  return !lastGame ?
    await initNewGame() :
    await fetchLastGame(lastGame);
};

const getLastGame = async () => {
	try {

		const lastGame = await sQuery("getLastGame");
		if (lastGame.length && !lastGame[0].flag)
		return lastGame[0];
	} catch {
		return null;
	}
};

// Fetch last game

const fetchLastGame = async ({ usedrows, usedcols, gameid }) => {
  debug("\n\r");
  debug("Retreiving last game :");
  debug({ usedrows, usedcols, gameid });
  const gridState = await getGridState(gameid, { usedrows, usedcols });
  query("updateTime", [GameDate, gameid]);
  return { gridState, gameid, rows: usedrows, cols: usedcols };
};

const getGridState = async (gameid, { usedrows, usedcols }) => {
  const gridEvents = await sQuery("getGridState", gameid);
  const gridState = emptyGrid(usedrows, usedcols);
  for (const { cellid, color } of gridEvents)
    gridState[cellid] = color;
  return gridState;
}

// Init new Game

const initNewGame = async () => {
  debug("\n\r");
  debug("Creating new game :");
  const gameid = await saveGameNGetId();
  createGridTable(gameid);
  createPalettesTable(gameid);
  createCredsTable(gameid);
  createPokedex();
  const gridState = emptyGrid(rows, cols);
  return { gridState, gameid, rows, cols };
};

const saveGameNGetId = async () => {
  await sQuery("saveGame", [rows, cols, GameDate]);
  return 1;
  const gameid = await getLastGameId();
  debug(`Game n°${gameid} created`);
  return gameid;
}

const getLastGameId = async () => {
  const lastGame = await sQuery("getLastGame", [GameDate]);
  return lastGame[0].gameid;
};

const createGridTable = async (gameid) => {
  await sQuery("createGridTable", gameid);
  debug(
    `Grid table created with name : game_${gameid}__grid`);
};

const createPalettesTable = async (gameid) => {
  await sQuery("createPalettesTable", gameid);
  debug(
    `Palettes table created with name : game_${gameid}__palettes`);
};

const createCredsTable = async (gameid) => {
  await sQuery("createCredsTable", gameid);
  debug(
    `Creds table created with name : game_${gameid}__creds`);
};

const createPokedex = async () => {
  await sQuery("createPokedex");
  debug(
    `Pokedex table created with name : pokedex_2`);
  Pokedex.forEach(palette => {
    query("fillPokedex", [...palette.map(c => c.substring(1))]);
  });
}


// const createPokedex = async gameid => {
//   await sQuery("createPokedex", gameid);
//   debug(
//     `Pokedex table created with name : pokedex_2`);
//   Pokedex.forEach(palette => {
//     query("fillPokedex", [gameid, ...palette.map(c => c.substring(1))]);
//   });
// }

const emptyGrid = (rows, cols) =>
  new Array(rows * cols)
  .fill(null);
