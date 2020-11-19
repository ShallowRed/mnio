const { query, sQuery } = require('../mysql');

module.exports = async function saveFill(playerid, { position, color }, gameid) {
  console.log(
    `Player fill :  ${playerid} | ${position} | ${color} | ${gameid}`
  )
  query("saveFill", [gameid, playerid, position, color]);
  return;
};
