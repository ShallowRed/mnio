const { connect, query, sQuery, GAMEDATE } = require('./mysql');
const Pokedex = require('../pokedex/pokedex.min');
const { rows, cols } = require('../config');
const events = require('../events');

module.exports = async () => {
  connect();
  createTablesIfNotExist();
  fillPokedexIfEmpty();
  const lastGame = await checkLastGame();
  !lastGame ?
    initNewGame() :
    retreiveLastGame(lastGame)
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
  initGridState({ gameid, rows, cols })
};

const retreiveLastGame = async ({ usedrows, usedcols, gameid }) => {
  console.log("Retreiving last game :");
  console.table({ usedrows, usedcols, gameid });
  const gridState = await getGridState(gameid, { usedrows, usedcols });
  initGridState({ gameid, rows: usedrows, cols: usedcols }, gridState);
  query("updateTime", [GAMEDATE, gameid]);
};

const initGridState = (config, gridState) => {
  config.ColorList = gridState || new Array(config.rows * config.cols)
    .fill(null);
  events.emit('initGridState', config);
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

const getGridState = async (gameid, { usedrows, usedcols }) => {
  const gridEvents = await sQuery("selectGrid", gameid);
  const gridState = new Array(usedrows * usedcols)
    .fill(null);
  const setCell = ({ cellid, color }) =>
    gridState[cellid] = color;
  gridEvents.forEach(setCell);
  return gridState;
};
