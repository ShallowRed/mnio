const { query, sQuery } = require('../mysql');

module.exports = {

  saveFill: async function(playerid, {position, color}) {
    console.log(
      `Player fill :  ${playerid} | ${position} | ${color} | ${this.gameid}`
    )
    query("saveFill", [this.gameid, playerid, position, color]);
    return;
  },

  savePlayer: async function(playerid, palette) {
    const isUserInPlayers = await sQuery("isUserinPlayers", [this.gameid,
      playerid
    ]);
    if (isUserInPlayers.length) return;
    const colors = palette.map(c => c.substring(1));
    query("savePalette", [this.gameid, playerid, ...colors]);
    return;
  }

};
