const Database = require('../database/events/');
const logPlayer = require('./login');
const spawnPlayer = require('./spawnPlayer');

module.exports = class Network {

  constructor(Game, io) {
    this.Game = Game;
    this.Database = Database.bindGameId(Game.gameid)
    this.io = io;
    this.gameio = io.of('/gamedev');
    this.players = {};
    this.listenConnection();
  }

  listenConnection() {

    this.io.on('connection', socket => {
      console.log("login: sessionId :", socket.request.sessionId);
      logPlayer(socket, this);

      if (!!this.players[socket.request.sessionId]) {
        const player = this.players[socket.request.sessionId];
        spawnPlayer(socket, player, this.Game);
        this.listenGameEvents(socket, player);
      }

    });

    this.gameio.on('connection', socket => {
      console.log("game: sessionId :", socket.request.sessionId);

      const player = this.players[socket.request.sessionId];

      spawnPlayer(socket, player, this.Game);
      this.listenGameEvents(socket, player);
    });

  }

  listenGameEvents(socket, player) {

    socket.on('move', direction =>
      this.movePlayer(direction, socket, player)
    );

    socket.on('fill', cell =>
      this.saveFill(cell, socket, player)
    );

    socket.on('disconnect', () =>
      this.disconnect(socket, player)
    );
  }

  movePlayer(direction, socket, player) {
    const { Game } = this;
    socket.emit("moveCallback");
    const newPos = player.checkMove.call({ player, Game }, direction);
    if (!newPos) return;
    socket.emit("newPlayerPos", newPos);
    socket.broadcast.emit("newPosition", [player.position, newPos]);
    Game.newPosition([player.position, newPos])
    player.position = newPos;
  }

  saveFill(cell, socket, player) {
    const { Game, Database } = this;
    Database.saveFill(player.dbid, cell);
    Game.saveFill(cell)
    socket.emit("fillCallback");
    socket.broadcast.emit('NewCell', cell);
    if (player.alreadyOwns(cell.position)) return;
    player.updateOwnings.call({ player, Game }, cell.position)
    socket.emit('AllowedCells', player.allowedcells);
  }

  disconnect(socket, player) {
    const { Game, Database } = this;
    const { dbid, position, palette } = player;
    console.log(`Player left : ${dbid}`);
    if (position) {
      Game.newPosition([position, null]);
      socket.broadcast.emit("newPosition", [position, null]);
    };
  }
}
