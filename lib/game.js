const Config = require('./config');

class MnioGame {
  constructor(){
    this.Colorlist = new Array(Config.rows * Config.cols).fill(null);
    this.PositionList = [];
    this.PLAYERS = {};
  }
}

module.exports = MnioGame;
