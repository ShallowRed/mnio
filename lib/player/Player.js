const checkMove = require('./checkMove');
const allowCells = require('./allowCells');

module.exports = class Player {

  constructor({ playerid, userName }, { palette, ownCells, position }, { rows,
    cols }) {
    this.name = userName;
    this.dbid = playerid;
    this.palette = palette;
    this.ownCells = ownCells || [];
    this.position = position || ownCells[0];
    this.allowedcells = allowCells.call({ rows, cols }, ownCells);
  }

  checkMove(dir) {
    return checkMove.call(this, dir);
  }

  alreadyOwns(position) {
    return this.ownCells.includes(position);
  }

  updateOwnings(position) {
    const { player, Game: { rows, cols } } = this;
    player.ownCells.push(position);
    player.allowedcells = allowCells.call({ rows, cols }, player.ownCells);
  }
}
