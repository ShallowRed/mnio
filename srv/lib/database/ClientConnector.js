const { query, sQuery } = require('./mysql');
const Pokedex = require('../../data/pokedex/pokedex-2.min.json');
const debug = console.log;

module.exports = class DatabaseConnector {
  constructor(gameid) {
    queries.forEach(([key, fn]) => {
        this[key] = async (...args) =>
          await fn(...args, gameid) 
      });
  }
}

const queries = Object.entries({

  isUserNameInDb: async function(userName, gameid) {
    const userInDb = await sQuery("isUserNameInDb", [gameid, userName]);
    const exists = !!userInDb.length;
    return { exists, creds: exists ? userInDb[0] : null }
  },

  saveCredentials: async function({ userName, password }, gameid) {
    const { insertId } = await sQuery("saveCredentials", [gameid, userName,
      password
    ]);
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
    return ownCells.map(({ cellid }) => cellid);
  },

  saveFill: async function(playerid, { position, color }, gameid) {
    debug('Player fill :', playerid);
    query("saveFill", [gameid, playerid, position, color]);
    return;
  }
});
