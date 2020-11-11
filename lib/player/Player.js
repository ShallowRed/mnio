const checkMove = require('./checkMove');
const allowCells = require('./allowCells');

module.exports = class Player {

  constructor({playerid, userName, palette, ownCells}) {
    const isNew = (!ownCells || !ownCells.length);
    this.isNew = isNew;
    this.name = userName;
    this.dbid = playerid;
    this.ownCells = isNew ? new Array() : ownCells;
    this.allowedcells = isNew ? new Array() : allowCells(ownCells);
    this.position = isNew ? null : ownCells[0];
    this.palette = isNew ? null : palette;
  }

  checkMove(dir, Game) {
    return checkMove.call(this, dir, Game);
  }

  alreadyOwns(position) {
    return this.ownCells.includes(position);
  }

  updateOwnings(position) {
    this.ownCells.push(position);
    this.allowedcells = allowCells(this.ownCells);
  }
}
