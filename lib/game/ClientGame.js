const checkMove = require('./utils/checkMove');

module.exports = class ClientGameConnector {

  constructor(Database, Map) {
    this.Map = Map;
    this.Database = Database;
  }

  init(socket, player) {
    new ClientGame(socket, player, this.Map, this.Database);
  }
}

class ClientGame {

  constructor(socket, player, Map, Database) {
    this.socket = socket;
    this.player = player;
    this.Map = Map;
    this.Database = Database;
    this.spawnPlayer();
    this.listenGameEvents();
  }

  spawnPlayer() {
    this.socket.emit('initGame', this.getInitData());
    this.socket.broadcast.emit("newPosition", [null, this.player.position]);
    this.Map.newPosition([null, this.player.position]);
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
    this.socket.emit("moveCallback");
    const newPos = checkMove(direction, this.player, this.Map);
    newPos && (
      this.socket.emit("newPlayerPos", newPos),
      this.socket.broadcast.emit("newPosition", [this.player.position, newPos]),
      this.Map.newPosition([this.player.position, newPos]),
      this.player.position = newPos
    )
  }

  saveFill(cell) {
    this.Database.saveFill(this.player.playerid, cell);
    this.Map.saveFill(cell);
    this.socket.emit("fillCallback");
    this.socket.broadcast.emit('newFill', cell);
    this.player.updateOwnedCells(cell.position) && (
      this.player.updateAllowedCells(),
      this.socket.emit('allowedCells', this.player.allowedCells)
    );
  }

  disconnect(socket) {
    console.log('Player left :', this.player.playerid);
    this.player.position && (
      this.Map.newPosition([this.player.position, null]),
      this.socket.broadcast.emit("newPosition", [this.player.position, null])
    )
  }

  getInitData() {
    return {
      Game: {
        colors: this.Map.gridState,
        positions: this.Map.playersPositions,
        rows: this.Map.rows,
        cols: this.Map.cols,
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
