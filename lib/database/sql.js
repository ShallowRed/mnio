const Mysql = require('mysql');
const Config = require('../../config/mnio.config').conf;

const db = Mysql.createConnection({
  host: Config.host,
  user: Config.user,
  password: Config.password,
  database: Config.base
});

const SQL = {

  GAMEDATE: Math.floor(Date.now() / 1000),

  connect: () => db.connect(err => {
    if (!!err) throw err;
    console.log('mysql connected to ' + Config.host + ", user " + Config.user + ", database " + Config.base);
  }),

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

  getLastGame: "SELECT gameid FROM games WHERE gridid=?",
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
}

SQL.getGameId = cb =>
  SQL.query("getLastGame", [SQL.GAMEDATE], res =>
    cb(res[0].gameid));

module.exports = SQL;
