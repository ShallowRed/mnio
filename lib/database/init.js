const { connect, query, sQuery, GAMEDATE } = require('./sql');
const pokedex = require('../pokedex/pokedex.min');

const init = (MNIO, Config) => {
  connect();
  createTablesIfNotExist();
  fillPokedexIfEmpty();
  startGame(MNIO, Config)
};

const createTablesIfNotExist = () => {
  query("createUsersTable");
  query("createGamesTable");
  query("createPokedex");
}

const fillPokedexIfEmpty = async () => {
  const isFilled = await sQuery("isPokedexfilled");
  if (isFilled.length) return;
  pokedex.forEach(palette =>
    query("fillPokedex", palette.map(c => c.substring(1)))
  );
};

const startGame = async (MNIO, Config) => {
  const lastGame = await sQuery("getLastGame");
  const needNewGame = !lastGame.length || lastGame[0].flag;
    if (needNewGame)
      initNewGame(MNIO, Config)
    else
      retreiveLastGame(MNIO, Config, lastGame[0])
};

const initNewGame = async (MNIO, { rows, cols }) => {
  console.log("Using new game :");
  console.log("-----------------------------------------");
  MNIO.rows = rows;
  MNIO.cols = cols;
  MNIO.ColorList.length = rows * cols;
  MNIO.ColorList.fill(null);
  const gameid = await saveGameNGetId(MNIO, rows, cols)
  createGridTable(gameid);
  createPlayersTable(gameid);
  console.log("-----------------------------------------");
};

const saveGameNGetId = async (MNIO, rows, cols) => {
  await sQuery("saveGame", [rows, cols, GAMEDATE]);
  const gameid = MNIO.gameid = await getLastGameId();
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

const retreiveLastGame = async (MNIO, { rows, cols }, { usedrows, usedcols,
  gameid }) => {
  console.log("Using last game :");
  console.table({ usedrows, usedcols, gameid });
  MNIO.rows = rows !== usedrows ? usedrows : rows;
  MNIO.cols = cols !== usedcols ? usedcols : cols;
  MNIO.ColorList.length = usedrows * usedcols;
  MNIO.ColorList.fill(null);
  MNIO.gameid = gameid;
  getGridState(MNIO, gameid);
  query("updateTime", [GAMEDATE, gameid]);
};

const getGridState = async (MNIO, gameid) => {
  const gridState = await sQuery("selectGrid", gameid);
  gridState.forEach(({ cellid, color }) =>
    MNIO.ColorList[cellid] = color
  );
};

module.exports = init;
