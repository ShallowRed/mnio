const { query, sQuery } = require('../mysql');

module.exports = {

  isUserNameInDb: async function(userName) {
    const userInDb = await sQuery("isUserNameInDb", [userName]);
    const exists = !!userInDb.length;
    return { exists, creds: exists ? userInDb[0] : null }
  },

  saveCredentials: async function(user, pass) {
    const { insertId } = await sQuery("saveUser", [user, pass]);
    return insertId;
  },

  savePalette: async function(playerid, palette) {
    const colors = palette.map(c => c.substring(1));
    query("savePalette", [this.gameid, playerid, ...colors]);
    return palette;
  },

  getPlayerPalette: async function(playerid) {
    const palette = await sQuery("getPlayerPalette", [this.gameid, playerid]);
    return Object.values(palette[0])
      .map(e => `#${e}`);
  },

  getPlayerOwnCells: async function(playerid) {
    const ownCells = await sQuery("getPlayerOwnCells", [this.gameid, playerid]);
    if (!ownCells || !ownCells.length) return;
    return ownCells.map(({cellid}) => cellid);
  }
};
