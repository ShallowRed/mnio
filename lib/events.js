const EventEmitter = require('Events');

class MyEmitter extends EventEmitter {

  setMnio(MNIO) {
    this.MNIO = MNIO;
  }

  getMnio() {
    return this.MNIO;
  }

  setPLayer(socket, player) {
    this.MNIO[socket.id] = player;
  }

  getPlayer(socket) {
    return this.MNIO[socket.id];
  }

  getGameId() {
    return this.MNIO.gameid;
  }

  getCols() {
    return this.MNIO.cols;
  }

  getRows() {
    return this.MNIO.rows;
  }

  getColorList() {
    return this.MNIO.ColorList;
  }

  getPositionList() {
    return this.MNIO.PositionList;
  }
}

module.exports = new MyEmitter();
