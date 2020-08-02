const SQL = require('./sql');
const Config = require('../config');
const pokedex = require('../pokedex/pokedex.min');

const init = ColorList => {
  SQL.connect();
  SQL.query("createUsersTable");
  SQL.query("createGamesTable");
  SQL.query("createPokedex");

  SQL.query("isPokedexfilled", res => {
    if (!res.length) pokedex.forEach(e => {
      const color = e.map(el => el.split('#')[1]);
      SQL.query("fillDex", color, res => console.log(res));
    });
  });

  SQL.query("getLastGame", res => {
    if (!res.length || res[0].flag) initGame.new();
    else initGame.last(res[0].gameid, ColorList);
  })
}

const initGame = {

  new: () => {
    SQL.query("saveGame", [Config.rows, Config.cols, SQL.GAMEDATE], () =>
      SQL.getGameId(gameid => {
        console.log("Game n° " + gameid + " created");
        SQL.query("createGridTable", gameid, () =>
          console.log("Grid table created with name game_" + gameid + "__grid"));
        SQL.query("createPlayersTable", gameid, () =>
          console.log("Players table created with name game_" + gameid + "__players"));
      }))
  },

  last: (gameid, ColorList) => {
    SQL.query("selectGrid", gameid, gridState =>
      gridState.forEach(cell =>
        ColorList[cell.cellid] = `#${cell.color}`
      )
    );
    SQL.query("updateTime", [SQL.GAMEDATE, gameid])
  }

  // new: async () => {
  //   const saveGame = await SQL.query2("saveGame", [Config.rows, Config.cols, SQL.GAMEDATE]);
  //   const gameId = await SQL.getgameId();
  //   console.log("Game n° " + gameId + " created");
  //   const createGridTable = await SQL.query2("createGridTable", gameId);
  //   console.log("Grid table created with name game_" + gameId + "__grid");
  //   const createPlayersTable = await SQL.query2("createPlayersTable", gameId);
  //   console.log("Players table created with name game_" + gameId + "__players");
  // },

  // last: async (gameId, ColorList) => {
  //   console.log(gameId);
  //   const gridState = await SQL.query2("selectGrid", gameId);
  //   console.log(gridState);
  //   gridState.forEach(cell =>
  //     ColorList[cell.cellid] = `#${cell.color}`
  //     );
  //   SQL.query("updateTime", [SQL.GAMEDATE, gameId])
  // }
}

module.exports = init;
