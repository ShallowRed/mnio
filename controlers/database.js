const mysql = require('mysql');
const Config = require('./config');
const rows = Config.rows;
const cols = Config.cols;
const GAME = require('./index');
const config = Config.conf;
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
// const Testdb = "SHOW FULL TABLES FROM mniosql LIKE '%grid'"

function getgames(socket) {
  db.query(Testdb, function(err, res) {
    if (!!err) throw err;
    console.log(res);
    let games = [];
    res.forEach(function(game) {
      games.push([game.gameid, game.usedrows, game.usedcols, game.flag]);
    });
    GAME.sendgames(socket, games);
  });
}

function gettable(socket, gameid) {
  db.query(SelectGrid, [parseInt(gameid)], function(err, res) {
    if (!!err) throw err;
    let cells = [];
    res.forEach(function(cell) {
      cells.push([cell.cellid, '#'+ cell.color]);
    });
    GAME.sendtable(socket, cells);
  });
}

const GetLastGame = "SELECT * FROM games ORDER BY gameid DESC LIMIT 1"
const UpdateTime = "UPDATE games SET gridid = ? WHERE gameid = ?"

function init(ColorList) {
  CreateMainDB();
  db.query(GetLastGame, function(err, res1) {
    if (!!err) throw err;
    if (!res1.length) CreateGameDB();
    else if (!res1[0].flag) {
      ColorlistfromDB(ColorList, [res1[0].gameid]);
      db.query(UpdateTime, [GAMEDATE, res1[0].gameid], function(err, res2) {
        if (!!err) throw err;
      });
    } else CreateGameDB();
  });
}

const SelectGrid = "SELECT * FROM game_?__grid"

function ColorlistfromDB(ColorList, gameid) {
  db.query(SelectGrid, [gameid], function(err, res2) {
    if (!!err) throw err;
    res2.forEach(function(cell) {
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
    db.query(GetGameid, [GAMEDATE], function(err, rows) {
      if (err) throw err;
      let gameid = rows[0].gameid
      console.log("Game n° " + gameid + " created");
      db.query(CreateGridTable, gameid, function(err, result) {
        if (err) throw err;
        console.log("Grid table created with name game_" + gameid + "__grid");
      });
      db.query(CreatePlayersTable, gameid, function(err, result) {
        if (err) throw err;
        console.log("Players table created with name game_" + gameid + "__players");
      });
    });
  });
};

const AddCelltoGrid = "INSERT INTO game_?__grid (`cellid`, `playerid`, `color`)  VALUES(?, ?, ?)";

function SaveFill(cellid, playerid, color) {
  db.query(GetGameid, [GAMEDATE], function(err, res1) {
    if (err) throw err;
    let gameid = res1[0].gameid;
    db.query(AddCelltoGrid, [gameid, cellid, playerid, color], function(err) {
      if (err) throw err;
      console.log("Player n°" + playerid + " filled cell n°" + cellid + " with color #" + color + " in game n°" + gameid);
    });
  });
};

const IsUserinUsers = "SELECT * FROM users WHERE Username=?";
const SaveUserPalette = "INSERT INTO game_?__players (`playerid`, `color1`, `color2`, `color3`) VALUES(?, ?, ?, ?)";

function SavePlayer(playerid, col) {
  db.query(GetGameid, [GAMEDATE], function(err, res1) {
    if (err) throw err;
    let gameid = res1[0].gameid;
    db.query(IsUserinPlayers, [gameid, playerid], function(err, res2, fields) {
      let userinplayers = res2;
      if (!userinplayers.length) {
        db.query(SaveUserPalette, [gameid, playerid, col[0].split('#')[1], col[1].split('#')[1], col[2].split('#')[1]], function(err, result) {
          if (err) throw err;
          console.log("Palette of player n° " + playerid + " saved in game_" + gameid + "__players");
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
    let userinusers = res1;
    let position = null;
    let colors = [];
    let owncells = [];

    if (!userinusers.length) { // If user is not in database

      db.query(AddUsertoUsers, [user, pass], function(err, result) {
        if (!!err) throw err;
        GAME.InitPlayer(result.insertId, user, position, colors, owncells, socket, MNIO); // req.session.userID = result.insertId; req.session.save();
      });

    } else if (pass == userinusers[0].Password) { // If user is in database

      let playerid = userinusers[0].playerid;

      db.query(GetGameid, [GAMEDATE], function(err, res2) {
        if (err) throw err;
        let gameid = res2[0].gameid;

        db.query(IsUserinPlayers, [gameid, playerid], function(err, res4, fields) {
          let userinplayers = res4;

          if (userinplayers.length) { // If user already draw
            console.log("user n°" + playerid + " has already drawn in grid n°" + gameid);
            userinplayers.forEach(function(cell) {
              colors.push("#" + cell.color1);
              colors.push("#" + cell.color2);
              colors.push("#" + cell.color3);
            });

            db.query(IsUserinGrid, [gameid, playerid], function(err, res3, fields) {
              let useringrid = res3;
              if (useringrid.length) {
                console.log("user n°" + playerid + " has already drawn in grid n°" + gameid);
                useringrid.forEach(function(cell) {
                  owncells.push(cell.cellid);
                });
                GAME.InitPlayer(playerid, user, owncells[0], colors, owncells, socket, MNIO);
              };
            });
          } else GAME.InitPlayer(playerid, user, position, colors, owncells, socket, MNIO); // If player never draw
        });
      });
    } else GAME.InitPlayer(null, null, null, null, null, socket, null, null, null); // If wrong password
  });
};

module.exports = {
  getgames,
  gettable,
  connect,
  init,
  LogPlayer,
  SaveFill,
  SavePlayer
}
