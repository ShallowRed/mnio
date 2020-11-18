const { query, sQuery } = require('../mysql');
const Pokedex = require('../../../datadev/pokedex/pokedex.min');

module.exports = {

  isUserNameInDb: async function(userName) {
    const userInDb = await sQuery("isUserNameInDb", [this.gameid, userName]);
    const exists = !!userInDb.length;
    return { exists, creds: exists ? userInDb[0] : null }
  },

  saveCredentials: async function(user, pass) {
    const { insertId } = await sQuery("saveCredentials", [this.gameid, user, pass]);
    return insertId;
  },

  savePlayerPalette: async function(playerid, index) {
    query("savePlayerPalette", [this.gameid, playerid, index]);
    return Pokedex[index];
  },

  getPlayerPalette: async function(playerid) {
    const index = await sQuery("getPlayerPalette", [this.gameid, playerid]);
    return Pokedex[index[0].paletteid]
  },

  getPlayerOwnCells: async function(playerid) {
    const ownCells = await sQuery("getPlayerOwnCells", [this.gameid, playerid]);
    if (!ownCells || !ownCells.length) return;
    return ownCells.map(({cellid}) => cellid);
  }
};
