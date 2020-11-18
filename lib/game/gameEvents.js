module.exports = function listenGameEvents(socket, player, network) {

  socket.on('move', direction =>
    movePlayer(direction, socket, player, network)
  );

  socket.on('fill', cell =>
    saveFill(cell, socket, player, network)
  );

  socket.on('disconnect', () =>
    disconnect(socket, player, network)
  );
}

function movePlayer(direction, socket, player, network) {
  const { Game } = network;
  socket.emit("moveCallback");
  const newPos = player.checkMove.call({ player, Game }, direction);
  if (!newPos) return;
  socket.emit("newPlayerPos", newPos);
  socket.broadcast.emit("newPosition", [player.position, newPos]);
  Game.newPosition([player.position, newPos])
  player.position = newPos;
};

function saveFill(cell, socket, player, network) {
  const { Game, Database } = network;
  Database.saveFill(player.dbid, cell);
  Game.saveFill(cell)
  socket.emit("fillCallback");
  socket.broadcast.emit('NewCell', cell);
  if (player.alreadyOwns(cell.position)) return;
  player.updateOwnings.call({ player, Game }, cell.position)
  socket.emit('AllowedCells', player.allowedcells);
};

function disconnect(socket, player, network) {
  const { Game, Database } = network;
  const { dbid, position, palette } = player;
  console.log(`Player left : ${dbid}`);
  if (position) {
    Game.newPosition([position, null]);
    socket.broadcast.emit("newPosition", [position, null]);
  };
};
