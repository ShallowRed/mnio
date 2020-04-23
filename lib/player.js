const rdmcolor = require('./colors');
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
    if (!colors) {
      if (rdmpalette) this.colors = rdmpalette();
      else this.colors = [rdmcolor(), rdmcolor(), rdmcolor()];
  } else this.colors = colors;
    if (!owncells || !owncells.length) {
      this.owncells = [];
      this.allowedcells = [];
      this.position = randompos(ColorList);
      return;
    }
    this.owncells = owncells;
    this.allowedcells = require('./checker').cells(owncells);
    this.position = owncells[0];
  }
}

module.exports = Player;
