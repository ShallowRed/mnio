const {query, getGameId} = require('./sql');

const save = {

  fill: (cellid, name, playerid, color) =>
    getGameId(gameid =>
      query("saveFill", [gameid, cellid, playerid, color], () =>
        console.log(
          `Player fill : ${name} | ${playerid} | ${cellid} | ${color} | ${gameid}`
        )
      )
    ),

  player: (playerid, color) =>
    getGameId(gameid =>
      query("isUserinPlayers", [gameid, playerid], res => {
        const palette = color.map(e => e.split('#')[1]);
        if (!res.length) query("savePalette", [gameid, playerid, ...
          palette
        ]);
      })),

  flag: flag =>
    query("getLastGame", res =>
      query("updateFlag", [flag, res[0].gameid])
    )
}

module.exports = save;
