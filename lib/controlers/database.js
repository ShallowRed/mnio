const Mysql = require('mysql');
const Config = require('../config').conf;
const User = require('./networking');

const db = Mysql.createConnection({
  host: Config.host,
  user: Config.user,
  password: Config.password,
  database: Config.base
});

let GAMEDATE = Math.floor(Date.now() / 1000);

function connect() {
  db.connect(err => {
    if (!!err) throw err;
    console.log('mysql connected to ' + Config.host + ", user " + Config.user + ", database " + Config.base);
  });
}

const SelectGames = "SELECT * FROM games"

function getgames(socket) {
  db.query(SelectGames, (err, res) => {
    if (!!err) throw err;
    User.sendgames(socket, res.map(game => [game.gameid, game.usedrows, game.usedcols, game.flag]));
  });
}

const GetLastGame = "SELECT * FROM games ORDER BY gameid DESC LIMIT 1"
const UpdateFlag = "UPDATE games SET flag = ? WHERE gameid = ?"

function setflag(flag) {
  db.query(GetLastGame, (err, res) => {
    if (!!err) throw err;
    db.query(UpdateFlag, [flag, [res[0].gameid]], err => {
      if (!!err) throw err;
    });
  });
}

function gettable(socket, gameid) {
  db.query(SelectGrid, [parseInt(gameid)], (err, res) => {
      if (!!err) throw err;
      User.sendtable(socket, res.map(cell => [cell.cellid, '#' + cell.color]));
      });
  }

  const UpdateTime = "UPDATE games SET gridid = ? WHERE gameid = ?"

  function init(ColorList) {
    CreateMainDB();
    db.query(GetLastGame, (err, res) => {
      if (!!err) throw err;
      if (!res.length || res[0].flag) CreateGameDB();
      else {
        ColorlistfromDB(ColorList, [res[0].gameid]);
        db.query(UpdateTime, [GAMEDATE, res[0].gameid], err => {
          if (!!err) throw err;
        });
      }
    });
  }

  const SelectGrid = "SELECT * FROM game_?__grid"

  function ColorlistfromDB(ColorList, gameid) {
    db.query(SelectGrid, [gameid], (err, res) => {
      if (!!err) throw err;
      res.forEach(cell => ColorList[cell.cellid] = '#' + cell.color);
    });
  }

  const CreateUsersTable = "CREATE TABLE IF NOT EXISTS users (playerid MEDIUMINT PRIMARY KEY NOT NULL AUTO_INCREMENT, Username VARCHAR(15) NOT NULL, Password VARCHAR(20) NOT NULL)"
  const CreateGamesTable = "CREATE TABLE IF NOT EXISTS games (gameid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, usedrows SMALLINT NOT NULL, usedcols SMALLINT NOT NULL, gridid INT NOT NULL, flag BOOLEAN)"

  function CreateMainDB() {
    db.query(CreateUsersTable, (err, result) => {
      if (err) throw err;
    });
    db.query(CreateGamesTable, (err, result) => {
      if (err) throw err;
    });
  };

  const CreateGridTable = "CREATE TABLE game_?__grid (orderid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, cellid MEDIUMINT NOT NULL, playerid SMALLINT NOT NULL, color VARCHAR(6) NOT NULL)";
  const CreatePlayersTable = "CREATE TABLE game_?__players (playerid SMALLINT PRIMARY KEY NOT NULL, color1 VARCHAR(6) NOT NULL, color2 VARCHAR(6) NOT NULL, color3 VARCHAR(6) NOT NULL)";
  const NewGame = "INSERT INTO games (`usedrows`, `usedcols`, `gridid` ,`flag`) VALUES(?, ?, ?, 0)";
  const GetGameid = "SELECT gameid FROM games WHERE gridid=?";

  function CreateGameDB() {
    db.query(NewGame, [require('../config').rows, require('../config').cols, GAMEDATE], (err, result) => {
      if (err) throw err;
      db.query(GetGameid, [GAMEDATE], (err, res) => {
        if (err) throw err;
        console.log("Game n° " + res[0].gameid + " created");
        db.query(CreateGridTable, res[0].gameid, (err, result) => {
          if (err) throw err;
          console.log("Grid table created with name game_" + res[0].gameid + "__grid");
        });
        db.query(CreatePlayersTable, res[0].gameid, (err, result) => {
          if (err) throw err;
          console.log("Players table created with name game_" + res[0].gameid + "__players");
        });
      });
    });
  };

  const AddCelltoGrid = "INSERT INTO game_?__grid (`cellid`, `playerid`, `color`)  VALUES(?, ?, ?)";

  function SaveFill(cellid, playerid, color) {
    db.query(GetGameid, [GAMEDATE], (err, res) => {
      if (err) throw err;
      db.query(AddCelltoGrid, [res[0].gameid, cellid, playerid, color], err => {
        if (err) throw err;
        console.log("Player n°" + playerid + " filled cell n°" + cellid + " with color #" + color + " in game n°" + res[0].gameid);
      });
    });
  };

  const IsUserinUsers = "SELECT * FROM users WHERE Username=?";
  const SaveUserPalette = "INSERT INTO game_?__players (`playerid`, `color1`, `color2`, `color3`) VALUES(?, ?, ?, ?)";

  function SavePlayer(playerid, col) {
    db.query(GetGameid, [GAMEDATE], (err, res1) => {
      if (err) throw err;
      db.query(IsUserinPlayers, [res1[0].gameid, playerid], (err, res2, fields) => {
        if (err) throw err;
        if (!res2.length) {
          db.query(SaveUserPalette, [res1[0].gameid, playerid, col[0].split('#')[1], col[1].split('#')[1], col[2].split('#')[1]], (err, result) => {
            if (err) throw err;
            console.log("Palette of player n° " + playerid + " saved in game_" + res1[0].gameid + "__players");
          });
        };
      });
    });
  };

  const AddUsertoUsers = "INSERT INTO users (`Username`, `Password`) VALUES(?, ?)";
  const IsUserinGrid = "SELECT * FROM game_?__grid WHERE playerid=?";
  const IsUserinPlayers = "SELECT * FROM game_?__players WHERE playerid=?";

  function log(user, pass, socket, MNIO) {

    db.query(IsUserinUsers, [user], (err, res1, fields) => {

      if (!res1.length) { // If user is not in database
        db.query(AddUsertoUsers, [user, pass], (err, result) => {
          if (!!err) throw err;
          User.init([result.insertId, user, socket], MNIO);
        });
        return;
      }

      if (pass !== res1[0].Password) { // If wrong password
        User.WrongPass(socket);
        return;
      }

      let playerids = [res1[0].playerid, user, socket]; // If user is in database and right pass
      db.query(GetGameid, [GAMEDATE], (err, res2) => {
        if (err) throw err;
        let gameid = res2[0].gameid;

        db.query(IsUserinPlayers, [gameid, playerids[0]], (err, res4, fields) => {
          if (err) throw err;
          if (!res4.length) { // If user never draw
            console.log("New user n°" + playerids[0] + " on game n°" + gameid);
            User.init(playerids, MNIO);
            return
          }

          let owncells = [];
          let colors = ["#" + res4[0].color1, "#" + res4[0].color2, "#" + res4[0].color3];
          db.query(IsUserinGrid, [gameid, playerids[0]], (err, res3, fields) => {
            if (err) throw err;
            res3.forEach(cell => owncells.push(cell.cellid));
            User.init(playerids, MNIO, colors, owncells);
            console.log("user n°" + playerids[0] + " is returning to game n°" + gameid);
          });

        });
      });
    });
  };

  module.exports = {
    setflag,
    getgames,
    gettable,
    connect,
    init,
    log,
    SaveFill,
    SavePlayer
  }
