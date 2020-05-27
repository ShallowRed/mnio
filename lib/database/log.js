const SQL = require('./sql');
const Player = require('../player/init');
// const Player = require('../controlers/networking');

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

module.exports = log;
