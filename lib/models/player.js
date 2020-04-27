// const rdmcolor = require('./colors');
const rdmpalette = require('./colors2');

function randompos(list) {

  let empties = [];
  let len = list.length;
  for (let i = 0; i < len; i++)
    if (!list[i]) empties.push(i);
  return empties[Math.floor(Math.random() * empties.length)];
}

class Player {
  constructor(userindb, username, colors, owncells, ColorList) {
    this.name = username;
    this.dbid = userindb;
    this.colors = colors ? colors : rdmpalette();
    this.owncells = (!owncells || !owncells.length) ? [] : owncells;
    this.allowedcells = (!owncells || !owncells.length) ? [] : require('./checker').cells(owncells);
    this.position = (!owncells || !owncells.length) ? randompos(ColorList) : owncells[0];
  }
}

module.exports = Player;
