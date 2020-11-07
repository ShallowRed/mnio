const Mysql = require('mysql');

const { db } = require('../config');
const { host, user, database } = db;

const Database = Mysql.createConnection(db);
const { promisify } = require('util');

const SQL = {

  GAMEDATE: Math.floor(Date.now() / 1000),

  connect: () =>
    Database.connect(err => {
      if (!!err) throw err;
      console.log('Mysql connected !');
      console.table({ host, user, database })
    }),

  query: (query, arg1, arg2) => {
    const callback = typeof arg1 !== "function" ? arg2 : arg1;
    const entry = typeof arg1 !== "function" ? arg1 : null;
    Database.query(SQL.queries[query], entry, (err, res) => {
      if (!!err) throw err;
      if (!!callback) callback(res);
    });
  },

  sQuery: (query, args) => {
    return promisify(Database.query)
      .call(Database, SQL.queries[query], args);
  }
};

const N_COLORS = 5;

const replaceX = (string, i) =>
  string.replace("X", ++i);

const colorex = new Array(N_COLORS)
  .fill("colorX VARCHAR(6) NOT NULL")
  .map(replaceX)
  .join(', ');

const dexColors = new Array(N_COLORS)
  .fill("`colorX`")
  .map(replaceX)
  .join(', ');

const dexValues = new Array(N_COLORS)
  .fill("?")
  .join(", ");



SQL.queries = {
  createUsersTable: "CREATE TABLE IF NOT EXISTS users (playerid MEDIUMINT PRIMARY KEY NOT NULL AUTO_INCREMENT, Username VARCHAR(15) NOT NULL, Password VARCHAR(20) NOT NULL)",
  createGamesTable: "CREATE TABLE IF NOT EXISTS games (gameid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, usedrows SMALLINT NOT NULL, usedcols SMALLINT NOT NULL, gridid INT NOT NULL, flag BOOLEAN)",
  createPokedex: "CREATE TABLE IF NOT EXISTS pokedex (" + colorex + ")",
  createGridTable: "CREATE TABLE game_?__grid (orderid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, cellid MEDIUMINT, playerid SMALLINT NOT NULL, color VARCHAR(6) NOT NULL)",
  createPlayersTable: "CREATE TABLE game_?__players (playerid SMALLINT PRIMARY KEY NOT NULL, color1 VARCHAR(6) NOT NULL, color2 VARCHAR(6) NOT NULL, color3 VARCHAR(6) NOT NULL, color4 VARCHAR(6) NOT NULL, color5 VARCHAR(6) NOT NULL)",

  selectGrid: "SELECT * FROM game_?__grid",
  isUserinPlayers: "SELECT * FROM game_?__players WHERE playerid=?",
  isUserinUsers: "SELECT * FROM users WHERE Username=?",
  isUserinGrid: "SELECT * FROM game_?__grid WHERE playerid=?",
  getLastGame: "SELECT * FROM games ORDER BY gameid DESC LIMIT 1",
  isPokedexfilled: "SELECT * FROM pokedex",
  saveGame: "INSERT INTO games (`usedrows`, `usedcols`, `gridid` ,`flag`) VALUES(?, ?, ?, 0)",
  fillPokedex: "INSERT INTO pokedex (" + dexColors + ") VALUES(" + dexValues +
    ")",
  saveFill: "INSERT INTO game_?__grid (`cellid`, `playerid`, `color`)  VALUES(?, ?, ?)",
  savePalette: "INSERT INTO game_?__players (`playerid`, " + dexColors +
    ") VALUES(?, " + dexValues + ")",
  updateFlag: "UPDATE games SET flag = ? WHERE gameid = ?",
  saveUser: "INSERT INTO users (`Username`, `Password`) VALUES(?, ?)",

  updateTime: "UPDATE games SET gridid = ? WHERE gameid = ?"
};

module.exports = SQL;
