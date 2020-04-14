const rdmcolor = require('./colors');

function randompos(list) {
  let empties = [];
  let len = list.length;
  for (let i = 0; i < len; i++)
    if (!list[i]) empties.push(i);
  // if (!empties.length) resetall(list);
  return empties[Math.floor(Math.random() * empties.length)];
}

class Player {
  constructor(userindb, username, colors, owncells, ColorList) {
    this.name = username;
    this.dbid = userindb;
    if (!colors) this.colors = [rdmcolor(), rdmcolor(), rdmcolor()];
    else this.colors = colors;
    if (!owncells || !owncells.length) {
      this.owncells = [];
      this.allowedcells = [];
      this.position = randompos(ColorList);
      return;
    }
    this.owncells = owncells;
    this.allowedcells = require('./check').cells(owncells);
    this.position = owncells[0];
  }
}

module.exports = Player;
