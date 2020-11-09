const { connect, sQuery } = require('./mysql');
const Events = require('../events');

let gameid;

module.exports = {

  isUserNameInDb: async (userName) => {
    const userInDb = await sQuery("isUserinUsers", [userName]);
    const exists = !!userInDb.length;
    return { exists, creds: exists ? userInDb[0] : null }
  },

  saveNewPlayer: async (user, pass) => {
    const { insertId } = await sQuery("saveUser", [user, pass]);
    console.log(`New player  : ${user} | ${insertId}`);
    return insertId;
  },

  getPlayerDeeds: async (playerid) => {
    if (!gameid)
      gameid = Events.getGameId();
    const player = await sQuery("isUserinPlayers", [gameid, playerid]);
    console.log(`Player back : ${playerid}`);
    return {
      palette: player.length ? await getPlayerPalette(player) : null,
      ownCells: player.length ? await getPlayerOwned(player, playerid, gameid) :
        null
    }
  }
};

const getPlayerOwned = async (player, playerid, gameid) => {
  const ownCells = await sQuery("isUserinGrid", [gameid, playerid]);
  return ownCells.map(e => e.cellid);
};

const getPlayerPalette = async (player) => {
  const palette = Object.values(player[0])
    .map(e => `#${e}`);
  palette.shift();
  return palette
};
