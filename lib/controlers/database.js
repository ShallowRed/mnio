const Mysql = require('mysql');
const Config = require('../../config/mnio.config');
const Conf = Config.conf;
const Player = require('./networking');

const GAMEDATE = Math.floor(Date.now() / 1000);

const db = Mysql.createConnection({
  host: Conf.host,
  user: Conf.user,
  password: Conf.password,
  database: Conf.base
});

////////////////////////////////// UTILS

const SQL = {

  connect: () => db.connect(err => {
    if (!!err) throw err;
    console.log('mysql connected to ' + Conf.host + ", user " + Conf.user + ", database " + Conf.base);
  }),

  getGameId: callback => {
    db.query("SELECT gameid FROM games WHERE gridid=?", [GAMEDATE], (err, response) => {
      if (!!err) throw err;
      callback(response[0].gameid);
    });
  },

  query: (query, el, cb) => {
    const callback = (typeof el !== "function") ? cb : el;
    const entry = (typeof el !== "function") ? el : null;
    db.query(SQL.queries[query], entry, (err, response) => {
      if (!!err) throw err;
      if (callback) callback(response);
    });
  }
};

SQL.queries = {
  createUsersTable: "CREATE TABLE IF NOT EXISTS users (playerid MEDIUMINT PRIMARY KEY NOT NULL AUTO_INCREMENT, Username VARCHAR(15) NOT NULL, Password VARCHAR(20) NOT NULL)",
  createGamesTable: "CREATE TABLE IF NOT EXISTS games (gameid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, usedrows SMALLINT NOT NULL, usedcols SMALLINT NOT NULL, gridid INT NOT NULL, flag BOOLEAN)",
  createGridTable: "CREATE TABLE game_?__grid (orderid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, cellid MEDIUMINT, playerid SMALLINT NOT NULL, color VARCHAR(6) NOT NULL)",
  createPlayersTable: "CREATE TABLE game_?__players (playerid SMALLINT PRIMARY KEY NOT NULL, color1 VARCHAR(6) NOT NULL, color2 VARCHAR(6) NOT NULL, color3 VARCHAR(6) NOT NULL, color4 VARCHAR(6) NOT NULL, color5 VARCHAR(6) NOT NULL)",

  selectGrid: "SELECT * FROM game_?__grid",
  isUserinPlayers: "SELECT * FROM game_?__players WHERE playerid=?",
  isUserinUsers: "SELECT * FROM users WHERE Username=?",
  isUserinGrid: "SELECT * FROM game_?__grid WHERE playerid=?",
  getLastGame: "SELECT * FROM games ORDER BY gameid DESC LIMIT 1",

  saveGame: "INSERT INTO games (`usedrows`, `usedcols`, `gridid` ,`flag`) VALUES(?, ?, ?, 0)",
  saveFill: "INSERT INTO game_?__grid (`cellid`, `playerid`, `color`)  VALUES(?, ?, ?)",
  savePalette: "INSERT INTO game_?__players (`playerid`, `color1`, `color2`, `color3`, `color4`, `color5`) VALUES(?, ?, ?, ?, ?, ?)",
  updateFlag: "UPDATE games SET flag = ? WHERE gameid = ?",
  saveUser: "INSERT INTO users (`Username`, `Password`) VALUES(?, ?)",

  updateTime: "UPDATE games SET gridid = ? WHERE gameid = ?"
};

////////////////////////////////// INIT

const init = ColorList => {
  SQL.connect();
  SQL.query("createUsersTable");
  SQL.query("createGamesTable");
  SQL.query("getLastGame", res => {
    if (!res.length || res[0].flag) setGame.new();
    else setGame.last(res[0].gameid, ColorList);
  })
}

const setGame = {

  new: () => {
    SQL.query("saveGame", [Config.rows, Config.cols, GAMEDATE], () =>
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
    SQL.query("updateTime", [GAMEDATE, gameid])
  }
}

////////////////// SAVE

const save = {

  fill: (cellid, name, playerid, color) =>
    SQL.getGameId(gameid =>
      SQL.query("saveFill", [gameid, cellid, playerid, color], () =>
      console.log("Player fill : " + name + " | " + playerid + " | " + cellid + " | " + color + " | " + gameid))
    ),

  player: (playerid, color) =>
    SQL.getGameId(gameid =>
      SQL.query("isUserinPlayers", [gameid, playerid], res => {
        const player = [gameid, playerid, ...color.map(e => e.split('#')[1])];
        if (!res.length) SQL.query("savePalette", player);
      })),

  flag: flag =>
    SQL.query("getLastGame", res =>
      SQL.query("updateFlag", [flag, [res[0].gameid]])
    )
}

////////////////// LOG

const log = {

  user: (user, socket) =>
    SQL.query("isUserinUsers", [user], res =>
      Player.askPass(socket, !res.length)),

  pass: (user, pass, socket, MNIO) =>
    SQL.query("isUserinUsers", [user], res => {
      if (!res.length) newPlayer(user, pass, socket, MNIO); // If user is not in database
      else if (pass !== res[0].Password) Player.wrongPass(socket); // If wrong password
      else returningPlayer(res[0].playerid, user, socket, MNIO); // If user is in database and right pass
    }),

}

const newPlayer = (user, pass, socket, MNIO) =>
  SQL.query("saveUser", [user, pass], res => {
    const playerid = res.insertId;
    Player.init(playerid, user, socket, MNIO);
    console.log("New player  : " + user + " | " + playerid);
  });

const returningPlayer = (playerid, user, socket, MNIO) =>
  SQL.getGameId(gameid =>
    SQL.query("isUserinPlayers", [gameid, playerid], player => {
      if (!player.length) Player.init(playerid, user, socket, MNIO); // If user never draw
      else SQL.query("isUserinGrid", [gameid, playerid], owning => {
        const colors = Object.keys(player[0]).filter(e => e[0] == "c").map(e => '#' + player[0][e]);
        const owncells = owning.map(e => e.cellid)
        Player.init(playerid, user, socket, MNIO, colors, owncells);
        console.log("Player back : " + user + " | " + playerid);
      });
    }));

module.exports = {
  init,
  log,
  save
}
