const Pokedex = require('../pokedex/pokedex.min');

const { connect, query, sQuery, GAMEDATE } = require('./mysql');
const { rows, cols } = require('../config');

module.exports = async () => {
  connect();
  createTablesIfNotExist();
  fillPokedexIfEmpty();
  const lastGame = await checkLastGame();
  return !lastGame ?
    await initNewGame() :
    await retreiveLastGame(lastGame);
};

const createTablesIfNotExist = () => {
  query("createUsersTable");
  query("createGamesTable");
  query("createPokedex");
};

const fillPokedexIfEmpty = async () => {
  const isPokedexfilled = !!(await sQuery("isPokedexfilled"))
    .length;
  if (isPokedexfilled) return;
  Pokedex.forEach(savePalette);
};

const savePalette = palette =>
  query("fillPokedex", palette.map(removeSharp));

const removeSharp = c => c.substring(1)

const checkLastGame = async () => {
  const lastGame = await sQuery("getLastGame");
  if (lastGame.length && !lastGame[0].flag)
    return lastGame[0];
};

const initNewGame = async () => {
  console.log("Creating new game :");
  const gameid = await saveGameNGetId();
  createGridTable(gameid);
  createPlayersTable(gameid);
  const gridState = emptyGrid(rows, cols);
  return { gridState, gameid, rows, cols };
};

const retreiveLastGame = async ({ usedrows, usedcols, gameid }) => {
  console.log("Retreiving last game :");
  console.table({ usedrows, usedcols, gameid });
  const gridEvents = await sQuery("selectGrid", gameid);
  const gridState = emptyGrid(usedrows, usedcols);
  for (const { cellid, color } of gridEvents)
    gridState[cellid] = color;
  query("updateTime", [GAMEDATE, gameid]);
  return { gridState, gameid, rows: usedrows, cols: usedcols };
};

const saveGameNGetId = async () => {
  await sQuery("saveGame", [rows, cols, GAMEDATE]);
  const gameid = await getLastGameId();
  console.log("Game n° " + gameid + " created");
  return gameid;
}

const getLastGameId = async () => {
  const res = await sQuery("getLastGame", [GAMEDATE]);
  return res[0].gameid;
};

const createGridTable = async (gameid) => {
  await sQuery("createGridTable", gameid);
  console.log(
    `Grid table created with name : game_${gameid}__grid`);
};

const createPlayersTable = async (gameid) => {
  await sQuery("createPlayersTable", gameid);
  console.log(
    `Players table created with name : game_${gameid}__players`);
};

const emptyGrid = (rows, cols) =>
  new Array(rows * cols)
  .fill(null);