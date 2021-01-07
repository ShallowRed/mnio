const N_COLORS = 5;

const replaceX = (string, i) =>
  string.replace("X", ++i);

const colorColumns = new Array(N_COLORS)
  .fill("colorX VARCHAR(6) NOT NULL")
  .map(replaceX)
  .join(', ');

const colorKeys = new Array(N_COLORS)
  .fill("`colorX`")
  .map(replaceX)
  .join(', ');

const colorValues = new Array(N_COLORS)
  .fill("?")
  .join(", ");

module.exports = {
  createGamesTableIfNotExist: "CREATE TABLE IF NOT EXISTS games (gameid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, usedrows SMALLINT NOT NULL, usedcols SMALLINT NOT NULL, gridid INT NOT NULL, pokedexid INT NOT NULL, flag BOOLEAN)",
  createGridTable: "CREATE TABLE IF NOT EXISTS game_?__grid (orderid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, cellid MEDIUMINT, playerid SMALLINT NOT NULL, color VARCHAR(6) NOT NULL)",
  createPalettesTable: "CREATE TABLE IF NOT EXISTS game_?__palettes (playerid SMALLINT PRIMARY KEY NOT NULL, paletteid SMALLINT NOT NULL)",
  createCredsTable: "CREATE TABLE IF NOT EXISTS game_?__creds (playerid MEDIUMINT PRIMARY KEY NOT NULL AUTO_INCREMENT, Username VARCHAR(15) NOT NULL, Password VARCHAR(20) NOT NULL)",

  createPokedex: "CREATE TABLE IF NOT EXISTS pokedex_2 (paletteid INT PRIMARY KEY NOT NULL AUTO_INCREMENT," + colorColumns + ")",
  fillPokedex: "INSERT INTO pokedex_2 (" + colorKeys + ") VALUES(" + colorValues + ")",

  getLastGame: "SELECT * FROM games ORDER BY gameid DESC LIMIT 1",
  saveGame: "INSERT INTO games (`usedrows`, `usedcols`, `gridid` ,`flag`) VALUES(?, ?, ?, 0)",
  getGridState: "SELECT * FROM game_?__grid",

  isUserNameInDb: "SELECT * FROM game_?__creds WHERE Username=?",
  saveCredentials: "INSERT INTO game_?__creds (`Username`, `Password`) VALUES(?, ?)",
  getPlayerPalette: "SELECT paletteid FROM game_?__palettes WHERE playerid=?",
  getPlayerOwnCells: "SELECT cellid FROM game_?__grid WHERE playerid=?",

  saveFill: "INSERT INTO game_?__grid (`playerid`, `cellid`, `color`)  VALUES(?, ?, ?)",
  savePlayerPalette: "INSERT INTO game_?__palettes (`playerid`, `paletteid`) VALUES(?, ?)",

  updateTime: "UPDATE games SET gridid = ? WHERE gameid = ?",
  updateFlag: "UPDATE games SET flag = ? WHERE gameid = ?"
};
