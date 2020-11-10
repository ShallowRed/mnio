const Pokedex = require('../pokedex/pokedex.min');

// const { connect, query, sQuery, GAMEDATE } = require('./mysql');
const { rows, cols } = require('../config');

module.exports = async () => {
  createTablesIfNotExist.bind(this);
  fillPokedexIfEmpty.bind(this);
  const lastGame = await checkLastGame();
  return !lastGame ?
    await initNewGame.bind(this) :
    await retreiveLastGame.bind(this, lastGame);
};

const createTablesIfNotExist = () => {
  this.query("createUsersTable");
  this.query("createGamesTable");
  this.query("createPokedex");
};

const fillPokedexIfEmpty = async () => {
  const isPokedexfilled = !!(await this.sQuery("isPokedexfilled"))
    .length;
  if (isPokedexfilled) return;
  Pokedex.forEach(palette =>
    this.query("fillPokedex", palette.map(removeSharp))
  )
};

const removeSharp = c => c.substring(1)

const checkLastGame = async () => {
  const lastGame = await this.sQuery("getLastGame");
  if (lastGame.length && !lastGame[0].flag)
    return lastGame[0];
};

const initNewGame = async () => {
  console.log("Creating new game :");
  const gameid = await saveGameNGetId.bind(this);
  createGridTable.bind(this, gameid);
  createPlayersTable.bind(this, gameid);
  const gridState = emptyGrid(rows, cols);
  return { gridState, gameid, rows, cols };
};

const retreiveLastGame = async ({ usedrows, usedcols, gameid }) => {
  console.log("Retreiving last game :");
  console.table({ usedrows, usedcols, gameid });
  const gridEvents = await this.sQuery("selectGrid", gameid);
  const gridState = emptyGrid(usedrows, usedcols);
  for (const { cellid, color } of gridEvents)
    gridState[cellid] = color;
  this.query("updateTime", [this.GAMEDATE, gameid]);
  return { gridState, gameid, rows: usedrows, cols: usedcols };
};

const saveGameNGetId = async () => {
  await this.sQuery("saveGame", [rows, cols, this.GAMEDATE]);
  const gameid = await getLastGameId.bind(this);
  console.log("Game n° " + gameid + " created");
  return gameid;
}

const getLastGameId = async () => {
  const res = await this.sQuery("getLastGame", [this.GAMEDATE]);
  return res[0].gameid;
};

const createGridTable = async (gameid) => {
  await this.sQuery("createGridTable", gameid);
  console.log(
    `Grid table created with name : game_${gameid}__grid`);
};

const createPlayersTable = async (gameid) => {
  await this.sQuery("createPlayersTable", gameid);
  console.log(
    `Players table created with name : game_${gameid}__players`);
};

const emptyGrid = (rows, cols) =>
  new Array(rows * cols)
  .fill(null);
