const mysql = require('mysql');
const PARAMS = require('../models/parameters');
const rows = PARAMS.rows;
const cols = PARAMS.cols;
const Action = require('./actions');
// const InitPlayer = require('./initplayer');

const config = {
  "host": "localhost",
  "user": "root",
  "password": "",
  "base": "mniosql"
};

var db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.base
});

var GAMEDATE = Math.floor(Date.now() / 1000);

const IsUserinUsers = "SELECT * FROM users WHERE Username=?";
const AddUsertoUsers = "INSERT INTO users (`Username`, `Password`) VALUES(?, ?)";
const SaveGame = "INSERT INTO games (`rows`, `cols`, `gridid`) VALUES(?, ?, ?)";
const CreateGridTable = "CREATE TABLE game_?__grid (orderid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, cellid MEDIUMINT, playerid SMALLINT, color VARCHAR(6))";
const CreatePlayersTable = "CREATE TABLE game_?__players (playerid SMALLINT PRIMARY KEY NOT NULL, color1 VARCHAR(6), color2 VARCHAR(6), color3 VARCHAR(6))";
const GetGameid = "SELECT gameid FROM games WHERE gridid=?";
const IsUserinGrid = "SELECT * FROM game_?__grid WHERE playerid=?";
const IsUserinPlayers = "SELECT * FROM game_?__players WHERE playerid=?";
const AddCelltoGrid = "INSERT INTO game_?__grid (`cellid`, `playerid`, `color`)  VALUES(?, ?, ?)";
const SaveUserPalette = "INSERT INTO game_?__players (`playerid`, `color1`, `color2`, `color3`) VALUES(?, ?, ?, ?)";

db.connect(function(error) {
  if (!!error)
    throw error;
  console.log('mysql connected to ' + config.host + ", user " + config.user + ", database " + config.base);
  CreateGame(GAMEDATE);
});

function CreateGame(GAMEDATE) {

  db.query(SaveGame, [rows, cols, GAMEDATE], function(err, result) {
    if (err) throw err;
    console.log("Game saved in Games table with name " + GAMEDATE);
  });

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
}

function SaveFill(cellid, playerid, color) {
  db.query(GetGameid, [GAMEDATE], function(err, res1) {
    if (err) throw err;
    let gameid = res1[0].gameid;
    db.query(AddCelltoGrid, [gameid, cellid, playerid, color], function(err) {
      if (err) throw err;
      console.log("cell n°" + cellid + " filled in " + color + " by player n°" + playerid + " in game n°" + gameid);
    });
  });
};

function SavePallette(playerid, col) {
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

function LogPlayer(user, pass, socket, ColorList, PositionList, PLAYERS) {

  db.query(IsUserinUsers, [user], function(err, res1, fields) {
    let userinusers = res1;
    let position = null;
    let colors = [];
    let owncells = [];

    if (!userinusers.length) {    // If user is not in database

      db.query(AddUsertoUsers, [user, pass], function(err, result) {
        if (!!err) throw err;
        Action.InitPlayer(result.insertId, user, position, colors, owncells, socket, ColorList, PositionList, PLAYERS); // req.session.userID = result.insertId; req.session.save();
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
                position = owncells[0];
                Action.InitPlayer(playerid, user, position, colors, owncells, socket, ColorList, PositionList, PLAYERS);
              };
            });
          } else Action.InitPlayer(playerid, user, position, colors, owncells, socket, ColorList, PositionList, PLAYERS); // If player never draw
        });
      });
    } else Action.InitPlayer(null, null, null, null, null, socket, null, null, null); // If wrong password
  });
};

module.exports = {
  LogPlayer,
  SaveFill,
  SavePallette
}
