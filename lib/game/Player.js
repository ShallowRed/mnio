const checkMove = require('./utils/checkMove');
const allowCells = require('./utils/allowCells');

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

  constructor({ playerid, userName, palette, ownCells }, Map) {
    const { gridState, rows, cols } = Map;
    console.log(!ownCells ? "New player :" : "Player back :", playerid);

    this.name = userName;
    this.dbid = playerid;
    this.palette = palette;
    this.ownCells = ownCells || [];
    this.position = this.ownCells[0] || randomPosition(gridState)
    this.allowedcells = allowCells.call({ rows, cols }, ownCells);
  }

  checkMove(dir) {
    return checkMove.call(this, dir);
  }

  alreadyOwns(position) {
    return this.ownCells.includes(position);
  }

  updateOwnings(position) {
    const { player, Map: { rows, cols } } = this;
    player.ownCells.push(position);
    player.allowedcells = allowCells.call({ rows, cols }, player.ownCells);
  }
}

const randomPosition = list => {
  const emptyCells = list.map(indexOfNull)
    .filter(isNull);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const indexOfNull = (e, i) =>
  !e ? i : null;

const isNull = e =>
  e !== null;
