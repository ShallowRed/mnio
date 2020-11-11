const checkMove = require('./checkMove');
const allowCells = require('./allowCells');

module.exports = class Player {

  constructor({ playerid, userName, palette, ownCells }, { rows, cols }) {
    const isNew = (!ownCells || !ownCells.length);
    this.isNew = isNew;
    this.name = userName;
    this.dbid = playerid;
    this.ownCells = isNew ? new Array() : ownCells;
    this.allowedcells = isNew ? new Array() : allowCells.call({
      rows,
      cols
    }, ownCells); //// PB HERE
    this.position = isNew ? null : ownCells[0];
    this.palette = isNew ? null : palette;
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
