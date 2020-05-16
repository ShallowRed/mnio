// const rdmcolor = require('./colors');
// const rdmpalette = require('./colors2');
// const rdmpalette = require('./colors3');

const allow = require('./checker');

const randompos = list => {
  const emptyCells = list.map((e, i) => !e ? i : null).filter(e => e !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

class Player {
  constructor(userId, userName, colors, owncells, ColorList) {
    const isNew = (!owncells || !owncells.length);
    this.name = userName;
    this.dbid = userId;
    this.colors = colors ? colors : null;
    this.owncells = isNew ? new Array() : owncells;
    this.allowedcells = isNew ? new Array() : allow.cells(owncells);
    this.position = isNew ? randompos(ColorList) : owncells[0];
  }
}

module.exports = Player;
