const Database = require('../database/inGame/');
const logPlayer = require('./logPlayer')
const { movePlayer, saveFill, disconnect } = require('./gameEvents')

module.exports = class Network {

  constructor(Game, io) {
    console.log(this);
    this.Game = Game;
    this.Database = Database.bindGameId(Game.gameid)
    this.io = io;
    this.listenGameEvents = function() {
      this.socket.on('move', movePlayer.bind(this));
      this.socket.on('fill', saveFill.bind(this));
      this.socket.on('disconnect', disconnect.bind(this));
    };
  }

  openSocketConnection() {
    this.io.on('connection', socket => {
      // TODO: maybe have less data passed as context
      // might not be good as it may copy our data lots of time
      const context = Object.assign({}, this, { socket });
      logPlayer.call(context);
    });
  }
}
