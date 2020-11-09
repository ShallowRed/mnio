const { connect, sQuery } = require('./mysql');

module.exports = {

  isUserNameInDb: async (userName, socket, MNIO) => {
    const userInDb = await sQuery("isUserinUsers", [userName]);
    const exists = !!userInDb.length;
    return { exists, creds: exists ? userInDb[0] : null }
  },

  saveNewPlayer: async (user, pass, socket, MNIO) => {
    const { insertId } = await sQuery("saveUser", [user, pass]);
    console.log(`New player  : ${user} | ${insertId}`);
    return insertId;
  },

  getReturningPlayer: async (playerid, user, socket, MNIO) => {
    const player = await sQuery("isUserinPlayers", [MNIO.gameid, playerid]);
    console.log("Player back : " + user + " | " + playerid);
    return getPlayerInfo(player, playerid, MNIO.gameid);
  }
};

const getPlayerInfo = async (player, playerid, gameid) => {
  if (!player.length) return {colors: null, ownCellsIds : null};
  const colors = Object.values(player[0])
    .map(e => `#${e}`);
  colors.shift();
  const ownCells = await sQuery("isUserinGrid", [gameid, playerid]);
  const ownCellsIds = ownCells.map(e => e.cellid);
  return { colors, ownCellsIds }
}
