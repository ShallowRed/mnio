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

const connect = () => {
  db.connect(err => {
    if (!!err) throw err;
    console.log('mysql connected to ' + Conf.host + ", user " + Conf.user + ", database " + Conf.base);
  });
}

const GetLastGame = "SELECT * FROM games ORDER BY gameid DESC LIMIT 1"
const UpdateFlag = "UPDATE games SET flag = ? WHERE gameid = ?"
const UpdateTime = "UPDATE games SET gridid = ? WHERE gameid = ?"
const SelectGrid = "SELECT * FROM game_?__grid"
const CreateUsersTable = "CREATE TABLE IF NOT EXISTS users (playerid MEDIUMINT PRIMARY KEY NOT NULL AUTO_INCREMENT, Username VARCHAR(15) NOT NULL, Password VARCHAR(20) NOT NULL)"
const CreateGamesTable = "CREATE TABLE IF NOT EXISTS games (gameid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, usedrows SMALLINT NOT NULL, usedcols SMALLINT NOT NULL, gridid INT NOT NULL, flag BOOLEAN)"
const CreateGridTable = "CREATE TABLE game_?__grid (orderid INT PRIMARY KEY NOT NULL AUTO_INCREMENT, cellid MEDIUMINT NOT NULL, playerid SMALLINT NOT NULL, color VARCHAR(6) NOT NULL)";
const CreatePlayersTable = "CREATE TABLE game_?__players (playerid SMALLINT PRIMARY KEY NOT NULL, color1 VARCHAR(6) NOT NULL, color2 VARCHAR(6) NOT NULL, color3 VARCHAR(6) NOT NULL, color4 VARCHAR(6) NOT NULL, color5 VARCHAR(6) NOT NULL)";
const NewGame = "INSERT INTO games (`usedrows`, `usedcols`, `gridid` ,`flag`) VALUES(?, ?, ?, 0)";
const GetGameid = "SELECT gameid FROM games WHERE gridid=?";
const AddCelltoGrid = "INSERT INTO game_?__grid (`cellid`, `playerid`, `color`)  VALUES(?, ?, ?)";
const IsUserinUsers = "SELECT * FROM users WHERE Username=?";
const SaveUserPalette = "INSERT INTO game_?__players (`playerid`, `color1`, `color2`, `color3`, `color4`, `color5`) VALUES(?, ?, ?, ?, ?, ?)";
// const SaveUserPalette = "INSERT INTO game_?__players (`playerid`, `color1`, `color2`, `color3`) VALUES(?, ?, ?, ?)";
const AddUsertoUsers = "INSERT INTO users (`Username`, `Password`) VALUES(?, ?)";
const IsUserinGrid = "SELECT * FROM game_?__grid WHERE playerid=?";
const IsUserinPlayers = "SELECT * FROM game_?__players WHERE playerid=?";

const colorlistfromDB = (ColorList, gameid) => {
  db.query(SelectGrid, [gameid], (err, res) => {
    if (!!err) throw err;
    res.forEach(cell => ColorList[cell.cellid] = '#' + cell.color);
  });
}

const init = (ColorList) => {
  connect();
  create.mainDB();
  db.query(GetLastGame, (err, res) => {
    if (!!err) throw err;
    let xx = true;
    if (xx) create.gameDB();
    // if (!res.length || res[0].flag) create.gameDB();
    else {
      colorlistfromDB(ColorList, [res[0].gameid]);
      db.query(UpdateTime, [GAMEDATE, res[0].gameid], err => {
        if (!!err) throw err;
      });
    }
  });
}

const create = {

  mainDB: () => {
    db.query(CreateUsersTable, (err, result) => {
      if (err) throw err;
    });
    db.query(CreateGamesTable, (err, result) => {
      if (err) throw err;
    });
  },

  gameDB: () => {
    db.query(NewGame, [Config.rows, Config.cols, GAMEDATE], (err, result) => {
      if (err) throw err;
      db.query(GetGameid, [GAMEDATE], (err, res) => {
        if (err) throw err;
        console.log("Game n° " + res[0].gameid + " created");
        db.query(CreateGridTable, [res[0].gameid], (err, result) => {
          if (err) throw err;
          console.log("Grid table created with name game_" + res[0].gameid + "__grid");
        });
        db.query(CreatePlayersTable, [res[0].gameid], (err, result) => {
          if (err) throw err;
          console.log("Players table created with name game_" + res[0].gameid + "__players");
        });
      });
    });
  }
}

const save = {

  fill: (cellid, playerid, color) => {
    db.query(GetGameid, [GAMEDATE], (err, res) => {
      if (err) throw err;
      db.query(AddCelltoGrid, [res[0].gameid, cellid, playerid, color], err => {
        if (err) throw err;
        console.log("Player n°" + playerid + " filled cell n°" + cellid + " with color #" + color + " in game n°" + res[0].gameid);
      });
    });
  },

  player: (playerid, color) => {
    db.query(GetGameid, [GAMEDATE], (err, res1) => {
      if (err) throw err;
      db.query(IsUserinPlayers, [res1[0].gameid, playerid], (err, res2, fields) => {
        if (err) throw err;
        if (!res2.length) {
          let player = [res1[0].gameid, playerid];
          color.forEach(c => player.push(c.split('#')[1]));
          db.query(SaveUserPalette, player, (err, result) => {
            if (err) throw err;
          });
        }
      });
    });
  },

  flag: flag => {
    db.query(GetLastGame, (err, res) => {
      if (!!err) throw err;
      db.query(UpdateFlag, [flag, [res[0].gameid]], err => {
        if (!!err) throw err;
      });
    });
  }
}

const newPlayer = (user, pass, socket, MNIO) => {
  db.query(AddUsertoUsers, [user, pass], (err, res) => {
    if (!!err) throw err;
    let playerid = res.insertId;
    Player.init(playerid, user, socket, MNIO);
  });
}

const returningPlayer = (playerid, user, socket, MNIO) => {

  db.query(GetGameid, [GAMEDATE], (err, res) => {
    if (err) throw err;
    let gameid = res[0].gameid;

    db.query(IsUserinPlayers, [gameid, playerid], (err, res2, fields) => {
      if (err) throw err;
      if (!res2.length) Player.init(playerid, user, socket, MNIO); // If user never draw
      else db.query(IsUserinGrid, [gameid, playerid], (err, res3, fields) => {
        if (err) throw err;
        const colors = Object.keys(res2[0]).filter(e => e[0] == "c").map(e => '#' + res2[0][e]);
        const owncells = res3.map(e => e.cellid)
        Player.init(playerid, user, socket, MNIO, colors, owncells);
      });
    });
  });
}

const log = {

  user: (user, socket) => {
    db.query(IsUserinUsers, [user], (err, res) => {
      if (!!err) throw err;
      const isNew = !res.length;
      Player.askPass(socket, isNew);
    });
  },

  pass: (user, pass, socket, MNIO) => {
    db.query(IsUserinUsers, [user], (err, res) => {
      if (!!err) throw err;
      // If user is not in database
      if (!res.length) newPlayer(user, pass, socket, MNIO);
      // If wrong password
      else if (pass !== res[0].Password) Player.wrongPass(socket);
      // If user is in database and right pass
      else returningPlayer(res[0].playerid, user, socket, MNIO);
    });
  },
}



module.exports = {
  connect,
  init,
  log,
  save
}
