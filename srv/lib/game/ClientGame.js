const checkMove = require('./utils/checkMove');

module.exports = class ClientGameConnector {

  constructor(database, map) {
    this.map = map;
    this.database = database;
  }

  init(socket, player) {
    new ClientGame(socket, player, this.map, this.database);
  }
}

class ClientGame {

  constructor(socket, player, map, database) {
    this.socket = socket;
    this.player = player;
    this.map = map;
    this.database = database;
    this.spawnPlayer();
    this.listenGameEvents();
  }

  spawnPlayer() {
    this.socket.emit('initGame', this.getInitData());
    this.socket.broadcast.emit("newPosition", [null, this.player.position]);
    this.map.newPosition([null, this.player.position]);
  }

  listenGameEvents() {

    this.socket.on('move', direction =>
      this.movePlayer(direction)
    );

    this.socket.on('fill', cell =>
      this.saveFill(cell)
    );

    this.socket.on('disconnect', () =>
      this.disconnect()
    );
  }

  movePlayer(direction) {
    const newPos = checkMove(direction, this.player, this.map);
    newPos && (
      this.socket.emit("newPlayerPos", newPos),
      this.socket.broadcast.emit("newPosition", [this.player.position, newPos]),
      this.map.newPosition([this.player.position, newPos]),
      this.player.position = newPos
    )
  }

  saveFill(cell) {
    this.database.saveFill(this.player.playerid, cell);
    this.map.saveFill(cell);
    this.socket.broadcast.emit('newFill', cell);
    this.player.updateOwnedCells(cell.position) && (
      this.player.updateAllowedCells(),
      this.socket.emit('allowedCells', this.player.allowedCells)
    );
    this.socket.emit('confirmFill');
  }

  disconnect(socket) {
    console.log('Player left :', this.player.playerid);
    this.player.position && (
      this.map.newPosition([this.player.position, null]),
      this.socket.broadcast.emit("newPosition", [this.player.position, null])
    )
  }

  getInitData() {
    return {
      Game: {
        colors: this.map.gridState,
        positions: this.map.playersPositions,
        rows: this.map.rows,
        cols: this.map.cols,
        owned: this.player.ownCells,
        allowed: this.player.allowedCells
      },
      Player: {
        position: this.player.position,
        palette: this.player.palette,
        admin: this.player.name == "a"
      }
    }
  }
}
