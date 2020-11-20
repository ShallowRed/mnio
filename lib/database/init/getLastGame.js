const { query, sQuery, GAMEDATE } = require('../mysql');
const { rows, cols } = require('../../config');
const Pokedex = require('../../../datadev/pokedex/pokedex.min');

module.exports = async () => {
  const lastGame = await getLastGame();
  return !lastGame ?
    await initNewGame() :
    await fetchLastGame(lastGame);
};

const getLastGame = async () => {
  const lastGame = await sQuery("getLastGame");
  if (lastGame.length && !lastGame[0].flag)
    return lastGame[0];
};

// Fetch last game

const fetchLastGame = async ({ usedrows, usedcols, gameid }) => {
  console.log("\n\r");
  console.log("Retreiving last game :");
  console.table({ usedrows, usedcols, gameid });
  const gridState = await getGridState(gameid, { usedrows, usedcols });
  query("updateTime", [GAMEDATE, gameid]);
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
  console.log("\n\r");
  console.log("Creating new game :");
  const gameid = await saveGameNGetId();
  createGridTable(gameid);
  createPalettesTable(gameid);
  createCredsTable(gameid);
  createPokedex(gameid);
  const gridState = emptyGrid(rows, cols);
  return { gridState, gameid, rows, cols };
};

const saveGameNGetId = async () => {
  await sQuery("saveGame", [rows, cols, GAMEDATE]);
  const gameid = await getLastGameId();
  console.log(`Game n°${gameid} created`);
  return gameid;
}

const getLastGameId = async () => {
  const lastGame = await sQuery("getLastGame", [GAMEDATE]);
  return lastGame[0].gameid;
};

const createGridTable = async (gameid) => {
  await sQuery("createGridTable", gameid);
  console.log(
    `Grid table created with name : game_${gameid}__grid`);
};

const createPalettesTable = async (gameid) => {
  await sQuery("createPalettesTable", gameid);
  console.log(
    `Palettes table created with name : game_${gameid}__players`);
};

const createCredsTable = async (gameid) => {
  await sQuery("createCredsTable", gameid);
  console.log(
    `Creds table created with name : game_${gameid}__creds`);
};

const createPokedex = async gameid => {
  await sQuery("createPokedex", gameid);
  console.log(
    `Pokedex table created with name : game_${gameid}__pokedex`);
  Pokedex.forEach(palette => {
    query("fillPokedex", [gameid, ...palette.map(c => c.substring(1))]);
  });
}

const emptyGrid = (rows, cols) =>
  new Array(rows * cols)
  .fill(null);
