const { query, sQuery } = require('./mysql');
const Events = require('../events');

let gameid;

module.exports = {

  fill: async (cellid, name, playerid, color) => {
    if (!gameid)
      gameid = Events.getGameId();
    console.log(
      `Player fill : ${name} | ${playerid} | ${cellid} | ${color} | ${gameid}`
    )
    query("saveFill", [gameid, cellid, playerid, color]);
  },

  player: async (playerid, palette) => {
    if (!gameid)
      gameid = Events.getGameId();
    const isUserInPlayers = await sQuery("isUserinPlayers", [gameid, playerid]);
    if (isUserInPlayers.length) return;
    const colors = palette.map(c => c.substring(1));
    query("savePalette", [gameid, playerid, ...colors]);
  }
};
