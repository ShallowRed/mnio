const rdmcolor = require('./randomcolor');

class Player {
  constructor(position) {
    this.name = null;
    this.dbid = null;
    this.position = position;
    this.colors = [rdmcolor(), rdmcolor(), rdmcolor()];
    this.owncells = [];
    this.allowedcells = [];
  }
}

module.exports = Player;
