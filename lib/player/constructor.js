const allowCells = require('./allowCells');

module.exports = class Player {
  constructor({playerid, userName, palette, ownCells, gridState}) {
    const isNew = (!ownCells || !ownCells.length);
    this.isNew = isNew;
    this.name = userName;
    this.dbid = playerid;
    this.palette = isNew ? null : palette;
    this.ownCells = isNew ? new Array() : ownCells;
    this.allowedcells = isNew ? new Array() : allowCells(ownCells);
    this.position = isNew ? null : ownCells[0];
  }
}
