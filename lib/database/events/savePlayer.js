const { query, sQuery } = require('../mysql');

module.exports = async function savePlayer(playerid, palette) {
  const isUserInPlayers = await sQuery("isUserinPlayers", [this.gameid,
    playerid
  ]);
  if (isUserInPlayers.length) return;
  const colors = palette.map(c => c.substring(1));
  query("savePalette", [this.gameid, playerid, ...colors]);
  return;
};
