const SQL = require('./sql');

const save = {

  fill: (cellid, name, playerid, color) =>
    SQL.getGameId(gameid =>
      SQL.query("saveFill", [gameid, cellid, playerid, color], () =>
        console.log("Player fill : " + name + " | " + playerid + " | " + cellid + " | " + color + " | " + gameid))
    ),

  player: (playerid, color) =>
    SQL.getGameId(gameid =>
      SQL.query("isUserinPlayers", [gameid, playerid], res => {
        const palette = color.map(e => e.split('#')[1]);
        if (!res.length) SQL.query("savePalette", [gameid, playerid, ...palette]);
      })),

  flag: flag =>
    SQL.query("getLastGame", res =>
      SQL.query("updateFlag", [flag, res[0].gameid])
    )
}

module.exports = save;
