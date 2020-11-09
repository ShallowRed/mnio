const allowCells = require('./allowCells');

module.exports = class Player {
  constructor(userId, userName, colors, owncells, ColorList) {
    const isNew = (!owncells || !owncells.length);
    this.name = userName;
    this.dbid = userId;
    this.colors = isNew ? null : colors;
    this.owncells = isNew ? new Array() : owncells;
    this.allowedcells = isNew ? new Array() : allowCells(owncells);
    this.position = isNew ? null : owncells[0];
  }
}
