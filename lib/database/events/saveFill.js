const { query, sQuery } = require('../mysql');

module.exports = async function saveFill(playerid, { position, color }) {
  console.log(
    `Player fill :  ${playerid} | ${position} | ${color} | ${this.gameid}`
  )
  query("saveFill", [this.gameid, playerid, position, color]);
  return;
};
