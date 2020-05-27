const SQL = require('./sql');
const Config = require('../../config/mnio.config');

const init = ColorList => {
  SQL.connect();
  SQL.query("createUsersTable");
  SQL.query("createGamesTable");
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
    SQL.query("selectGrid", gameid, res =>
      res.forEach(e => ColorList[e.cellid] = '#' + e.color));
    SQL.query("updateTime", [SQL.GAMEDATE, gameid])
  }
}

module.exports = init;
