const { query, sQuery } = require('../mysql');
const Pokedex = require('../../../datadev/pokedex/pokedex.min');

module.exports = {

  isUserNameInDb: async function(userName, gameid) {
    const userInDb = await sQuery("isUserNameInDb", [gameid, userName]);
    const exists = !!userInDb.length;
    return { exists, creds: exists ? userInDb[0] : null }
  },

  saveCredentials: async function(user, pass, gameid) {
    const { insertId } = await sQuery("saveCredentials", [gameid, user, pass]);
    return insertId;
  },

  savePlayerPalette: async function(playerid, index, gameid) {
    query("savePlayerPalette", [gameid, playerid, index]);
    return Pokedex[index];
  },

  getPlayerPalette: async function(playerid, gameid) {
    const index = await sQuery("getPlayerPalette", [gameid, playerid]);
    return Pokedex[index[0].paletteid]
  },

  getPlayerOwnCells: async function(playerid, gameid) {
    const ownCells = await sQuery("getPlayerOwnCells", [gameid, playerid]);
    if (!ownCells || !ownCells.length) return;
    return ownCells.map(({cellid}) => cellid);
  }
};
