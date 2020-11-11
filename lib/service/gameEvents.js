module.exports = {

  movePlayer(direction) {
    const { socket, player, network: { Game } } = this;
    socket.emit("moveCallback");
    const newPos = player.checkMove.call({ player, Game }, direction);
    if (!newPos) return;
    socket.emit("newPlayerPos", newPos);
    socket.broadcast.emit("newPosition", [player.position, newPos]);
    Game.newPosition([player.position, newPos])
    player.position = newPos;
  },

  saveFill(cell) {
    const { socket, player, network: { Game, Database } } = this;
    Database.saveFill(player.dbid, cell);
    Game.saveFill(cell)
    socket.emit("fillCallback");
    socket.broadcast.emit('NewCell', cell);
    if (player.alreadyOwns(cell.position)) return;
    player.updateOwnings.call({ player, Game }, cell.position)
    socket.emit('AllowedCells', player.allowedcells);
  },

  disconnect() {
    const {
      socket,
      player: { dbid, position, colors },
      network: { Game, Database }
    } = this;
    console.log(`Player left : ${dbid}`);
    if (position) {
      Game.newPosition([position, null]);
      socket.broadcast.emit("newPosition", [position, null]);
    };
    if (colors)
      Database.savePlayer(dbid, colors);
  }
};
