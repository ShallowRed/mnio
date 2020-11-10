// const { query, sQuery } = require('./mysql');

module.exports = {

  fill: async (cellid, name, playerid, color, gameid) => {
    console.log(
      `Player fill : ${name} | ${playerid} | ${cellid} | ${color} | ${gameid}`
    )
    this.query("saveFill", [gameid, cellid, playerid, color]);
  },

  player: async (playerid, palette, gameid) => {
    const isUserInPlayers = await this.sQuery("isUserinPlayers", [gameid, playerid]);
    if (isUserInPlayers.length) return;
    const colors = palette.map(c => c.substring(1));
    this.query("savePalette", [gameid, playerid, ...colors]);
  }
};
