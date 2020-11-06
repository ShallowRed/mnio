const { connect, query, getGameId, GAMEDATE } = require('./sql');
const pokedex = require('../pokedex/pokedex.min');

const init = (MNIO, Config) => {

  const retreiveOrInitNew = res => {
    if (!res.length || res[0].flag) {
      console.log("Using new game :");
      initGame.new(MNIO, Config);
    } else {
      console.log("Using last game :");
      initGame.last(res[0], MNIO, Config);
      console.table(res[0])
    }
  };

  connect();
  query("createUsersTable");
  query("createGamesTable");
  query("createPokedex");
  query("isPokedexfilled", fillPokedex);
  query("getLastGame", retreiveOrInitNew)
};

const fillPokedex = res => {
  if (!res.length) pokedex.forEach(e => {
    const color = e.map(el => el.split('#')[1]);
    query("fillDex", color, res => console.log(res));
  });
};

const initGame = {

  new(MNIO, { rows, cols }) {

    MNIO.ColorList.length = rows * cols;
    MNIO.ColorList.fill(null);
    MNIO.rows = rows;
    MNIO.cols = cols;

    console.log("-----------------------------------------");
    query("saveGame", [rows, cols, GAMEDATE], () =>
      getGameId(gameid => {
        console.log("Game n° " + gameid + " created");
        query("createGridTable", gameid, () =>
          console.log("Grid table created with name game_" + gameid +
            "__grid"));
        query("createPlayersTable", gameid, () =>
          console.log("Players table created with name game_" +
            gameid + "__players"));
      }))
      console.log("-----------------------------------------");
  },

  last({ usedrows, usedcols, gameid }, MNIO, { rows, cols }) {

    MNIO.ColorList.length = usedrows * usedcols;
    MNIO.ColorList.fill(null);
    MNIO.rows = rows !== usedrows ? usedrows : rows;
    MNIO.cols = cols !== usedcols ? usedcols : cols;

    query("selectGrid", gameid, gridState => {
      gridState.forEach(({ cellid, color }) =>
        MNIO.ColorList[cellid] = color
      )
    });

    query("updateTime", [GAMEDATE, gameid])
  }
}

module.exports = init;
