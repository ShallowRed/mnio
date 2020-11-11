const Database = require('../database/events/');
const logPlayer = require('./logPlayer');
const { movePlayer, saveFill, disconnect } = require('./gameEvents');

module.exports = class Network {

  constructor(Game, io) {
    this.Game = Game;
    this.Database = Database.bindGameId(Game.gameid)
    this.io = io;
  }

  listenConnection() {
    this.io.on('connection', logPlayer.bind(this));
  }

  listenGameEvents() {
    this.socket.on('move', movePlayer.bind(this));
    this.socket.on('fill', saveFill.bind(this));
    this.socket.on('disconnect', disconnect.bind(this));
  }
}
