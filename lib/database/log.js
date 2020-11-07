const { connect, query, sQuery } =
require('./sql');

const Player = require('../player/log');

const log = {

  user: async (user, socket) => {
    const userExists = await sQuery("isUserinUsers", [user]);
    Player.askPass(socket, !userExists.length);
  },

  pass: async (user, pass, socket, MNIO) => {
    const userInDb = await sQuery("isUserinUsers", [user]);
    console.log(userInDb[0]);
    !userInDb.length ?
      newPlayer(user, pass, socket, MNIO) :
      pass !== userInDb[0].Password ?
      Player.wrongPass(socket) :
      returningPlayer(userInDb[0].playerid, user, socket, MNIO);
  }
}

const newPlayer = async (user, pass, socket, MNIO) => {
  const { insertId } = await sQuery("saveUser", [user, pass]);
  Player.log(insertId, user, socket, MNIO);
  console.log("New player  : " + user + " | " + insertId);
};

const returningPlayer = async (playerid, user, socket, MNIO) => {
  console.log("MNIO.gameid", MNIO.gameid);
  const player = await sQuery("isUserinPlayers", [MNIO.gameid, playerid]);

  if (!player.length) {
    // TODO: weird thing here when reconnecting a player that never drawn
    Player.log(playerid, user, socket, MNIO); // If user never draw
    return;
  }

  const colors = Object.values(player[0])
    .map(e => `#${e}`);
  colors.shift();

  const ownCells = await sQuery("isUserinGrid", [MNIO.gameid, playerid]);
  const ownCellsIds = ownCells.map(e => e.cellid);
  Player.log(playerid, user, socket, MNIO, colors, ownCellsIds);
  console.log("Player back : " + user + " | " + playerid);
}

module.exports = log;
