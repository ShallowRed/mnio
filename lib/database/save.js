const { query, sQuery } = require('./sql');

const save = {

  fill: async (cellid, name, playerid, color, gameid) => {
    console.log(
      `Player fill : ${name} | ${playerid} | ${cellid} | ${color} | ${gameid}`
    )
    query("saveFill", [gameid, cellid, playerid, color]);
  },

  player: async (playerid, palette, gameid) => {
    const isUserInPlayers = await sQuery("isUserinPlayers", [gameid, playerid]);
    if (isUserInPlayers.length) return;
    const colors = palette.map(c => c.substring(1));
    query("savePalette", [gameid, playerid, ...colors]);
  }
}

module.exports = save;
