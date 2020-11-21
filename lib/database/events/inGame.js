const { query, sQuery } = require('../mysql');
// const debug = require('debug')('mnio');
const debug = console.log;

module.exports = async function saveFill(playerid, { position, color },
gameid) {
  debug('Player fill :', playerid);
  query("saveFill", [gameid, playerid, position, color]);
  return;
};
