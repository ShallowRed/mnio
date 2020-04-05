const rdmcolor = require('./randomcolor');
const randompos = require('./randompos');
const setallowedcells = require('./allowedcells');

class Player {
  constructor(userindb, username, position, colors, owncells, ColorList) {
    this.name = username;
    this.dbid = userindb;
    if (!position) this.position = randompos(ColorList);
    else this.position = position;
    if (!colors.length) this.colors = [rdmcolor(), rdmcolor(), rdmcolor()];
    else this.colors = colors;
    this.owncells = owncells;
    if (!owncells.length) this.allowedcells = [];
    else this.allowedcells = setallowedcells(owncells);
  }
}

module.exports = Player;
