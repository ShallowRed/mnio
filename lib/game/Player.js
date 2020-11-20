const allowCells = require('./utils/allowCells');
const randomPosition = require('./utils/randomPosition');

module.exports = {

  getExisting: async ({ userName, playerid }, { Database, Map }) => {
    const palette = await Database.getPlayerPalette(playerid);
    const ownCells = await Database.getPlayerOwnCells(playerid);
    const props = { playerid, userName, palette, ownCells };
    return new Player(props, Map);
  },

  createNew: async (index, { userName, password }, { Database, Map }) => {
    const playerid = await Database.saveCredentials(userName, password);
    const palette = await Database.savePlayerPalette(playerid, index);
    const props = { playerid, userName, palette };
    return new Player(props, Map);
  }
}

class Player {

  constructor(params, Map) {
    const { playerid, userName, palette, ownCells } = params;
    const { gridState, rows, cols } = Map;
    console.log(!ownCells ? "New player  :" : "Player back :", playerid);

    this.name = userName;
    this.dbid = playerid;
    this.palette = palette;
    this.ownCells = ownCells || [];
    this.position = this.ownCells[0] || randomPosition(gridState)
    this.allowedcells = allowCells(ownCells, { rows, cols });
  }

  updateOwnings(position, Map, callback) {
    if (this.ownCells.includes(position)) return;
    this.ownCells.push(position);
    this.allowedcells = allowCells(this.ownCells, Map);
    callback(this.allowedcells);
  }
}
