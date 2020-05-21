// const rdmcolor = require('./colors');
// const rdmpalette = require('./colors2');
// const rdmpalette = require('./colors3');

const allow = require('./allow');

class Player {
  constructor(userId, userName, colors, owncells, ColorList) {
    const isNew = (!owncells || !owncells.length);
    this.name = userName;
    this.dbid = userId;
    this.colors = isNew ? null : colors;
    this.owncells = isNew ? new Array() : owncells;
    this.allowedcells = isNew ? new Array() : allow(owncells);
    this.position = isNew ? null : owncells[0];
  }
}

module.exports = Player;
