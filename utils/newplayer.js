const randomcolor = require(__dirname + '/randomcolor');
const randompos = require(__dirname + '/randompos');

class Player {
  constructor(colorlist) {
    this.position = randompos(colorlist);
    this.color1 = randomcolor();
    this.color2 = randomcolor();
    this.color3 = randomcolor();
    this.owncells = [];
    this.allowedcells = [];
  }
}

module.exports = Player;
