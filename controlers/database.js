const mysql = require('mysql');
const Conf = require('./config');
const rows = Conf.rows;
const cols = Conf.cols;
const GAME = require('./index');
const config = Conf.conf;

var db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.base
});

var GAMEDATE = Math.floor(Date.now() / 1000);

function connect() {
  db.connect(function(error) {
    if (!!error)
      throw error;
    console.log('mysql connected to ' + config.host + ", user " + config.user + ", database " + config.base);
  });
}

const Testdb = "SELECT * FROM games"

function getgames(socket) {
  db.query(Testdb, function(err, res) {
    if (!!err) throw err;
    let games = [];
    res.forEach(function(game) {
      games.push([game.gameid, game.usedrows, game.usedcols, game.flag]);
    });
    GAME.sendgames(socket, games);
  });
}

const GetLastGame = "SELECT * FROM games ORDER BY gameid DESC LIMIT 1"
const UpdateFlag = "UPDATE games SET flag = ? WHERE gameid = ?"

function setflag(flag) {
  db.query(GetLastGame, function(err, res) {
    if (!!err) throw err;
    db.query(UpdateFlag, [flag, [res[0].gameid]], function(err) {
      if (!!err) throw err;
    });
  });
}

function gettable(socket, gameid) {
  db.query(SelectGrid, [parseInt(gameid)], function(err, res) {
    if (!!err) throw err;
    let cells = [];
    res.forEach(function(cell) {
      cells.push([cell.cellid, '#' + cell.color]);
    });
    GAME.sendtable(socket, cells);
  });
}

const UpdateTime = "UPDATE games SET gridid = ? WHERE gameid = ?"

function init(ColorList) {
  CreateMainDB();
  db.query(GetLastGame, function(err, res) {
    if (!!err) throw err;
    if (!res.length || res[0].flag) CreateGameDB();
    else {
      ColorlistfromDB(ColorList, [res[0].gameid]);
      db.query(UpdateTime, [GAMEDATE, res[0].gameid], function(err) {
        if (!!err) throw err;
      });
    }
  });
}

const SelectGrid = "SELECT * FROM game_?__grid"

function ColorlistfromDB(ColorList, gameid) {
  db.query(SelectGrid, [gameid], function(err, res) {
    if (!!err) throw err;
    res.forEach(function(cell) {
      ColorList[cell.cellid] = '#' + cell.color;
    });
  });
}

const CreateUsersTable = "CREATE TABLE IF NOT EXISTS users (playerid MEDIUMINT PRIMARY KEY NOT NULL AUTO_INCREMENT, Username VARCHAR(15) NOT NULL, Password VARCHAR(20) NOT NULL)"
const CreateGamesTable = "CREATE TABLE IF NOT EXISTS games (gameid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, usedrows SMALLINT NOT NULL, usedcols SMALLINT NOT NULL, gridid INT NOT NULL, flag BOOLEAN)"

function CreateMainDB() {
  db.query(CreateUsersTable, function(err, result) {
    if (err) throw err;
  });
  db.query(CreateGamesTable, function(err, result) {
    if (err) throw err;
  });
};

const CreateGridTable = "CREATE TABLE game_?__grid (orderid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, cellid MEDIUMINT NOT NULL, playerid SMALLINT NOT NULL, color VARCHAR(6) NOT NULL)";
const CreatePlayersTable = "CREATE TABLE game_?__players (playerid SMALLINT PRIMARY KEY NOT NULL, color1 VARCHAR(6) NOT NULL, color2 VARCHAR(6) NOT NULL, color3 VARCHAR(6) NOT NULL)";
const NewGame = "INSERT INTO games (`usedrows`, `usedcols`, `gridid` ,`flag`) VALUES(?, ?, ?, 0)";
const GetGameid = "SELECT gameid FROM games WHERE gridid=?";

function CreateGameDB() {
  db.query(NewGame, [rows, cols, GAMEDATE], function(err, result) {
    if (err) throw err;
    db.query(GetGameid, [GAMEDATE], function(err, res) {
      if (err) throw err;
      console.log("Game n° " + res[0].gameid + " created");
      db.query(CreateGridTable, res[0].gameid, function(err, result) {
        if (err) throw err;
        console.log("Grid table created with name game_" + res[0].gameid + "__grid");
      });
      db.query(CreatePlayersTable, res[0].gameid, function(err, result) {
        if (err) throw err;
        console.log("Players table created with name game_" + res[0].gameid + "__players");
      });
    });
  });
};

const AddCelltoGrid = "INSERT INTO game_?__grid (`cellid`, `playerid`, `color`)  VALUES(?, ?, ?)";

function SaveFill(cellid, playerid, color) {
  db.query(GetGameid, [GAMEDATE], function(err, res) {
    if (err) throw err;
    db.query(AddCelltoGrid, [res[0].gameid, cellid, playerid, color], function(err) {
      if (err) throw err;
      console.log("Player n°" + playerid + " filled cell n°" + cellid + " with color #" + color + " in game n°" + res[0].gameid);
    });
  });
};

const IsUserinUsers = "SELECT * FROM users WHERE Username=?";
const SaveUserPalette = "INSERT INTO game_?__players (`playerid`, `color1`, `color2`, `color3`) VALUES(?, ?, ?, ?)";

function SavePlayer(playerid, col) {
  db.query(GetGameid, [GAMEDATE], function(err, res1) {
    if (err) throw err;
    db.query(IsUserinPlayers, [res1[0].gameid, playerid], function(err, res2, fields) {
      if (err) throw err;
      if (!res2.length) {
        db.query(SaveUserPalette, [res1[0].gameid, playerid, col[0].split('#')[1], col[1].split('#')[1], col[2].split('#')[1]], function(err, result) {
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

function LogPlayer(user, pass, socket, MNIO) {

  db.query(IsUserinUsers, [user], function(err, res1, fields) {

    if (!res1.length) { // If user is not in database
      db.query(AddUsertoUsers, [user, pass], function(err, result) {
        if (!!err) throw err;
        GAME.InitPlayer([result.insertId, user, socket], MNIO); // req.session.userID = result.insertId; req.session.save();
      });
      return;
    }

    if (pass !== res1[0].Password) { // If wrong password
      GAME.WrongPass(socket);
      return;
    }

    let playerids = [res1[0].playerid, user, socket];  // If user is in database and right pass
    db.query(GetGameid, [GAMEDATE], function(err, res2) {
      if (err) throw err;
      let gameid = res2[0].gameid;

      db.query(IsUserinPlayers, [gameid, playerids[0]], function(err, res4, fields) {
        if (err) throw err;
        if (!res4.length) { // If user never draw
          console.log("New user n°" + playerids[0] + " on game n°" + gameid);
          GAME.InitPlayer(playerids, MNIO);
          return
        }

        let owncells = [];
        let colors = ["#" + res4[0].color1,"#" + res4[0].color2, "#" + res4[0].color3];
        db.query(IsUserinGrid, [gameid, playerids[0]], function(err, res3, fields) {
          if (err) throw err;
          res3.forEach(function(cell) {
            owncells.push(cell.cellid);
          });
          GAME.InitPlayer(playerids, MNIO, colors, owncells);
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
  LogPlayer,
  SaveFill,
  SavePlayer
}
