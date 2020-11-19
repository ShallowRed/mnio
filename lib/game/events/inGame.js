module.exports = function spawnPlayer(socket, player, Game) {
  const { Map } = Game;
  socket.emit('initGame', getInitData(player, Map));
  socket.broadcast.emit("newPosition", [null, player.position]);
  Map.newPosition([null, player.position]);
  listenGameEvents(socket, player, Game);
}

function getInitData(player, Map) {
  return {
    GAME: {
      colors: Map.gridState,
      positions: Map.playersPositions,
      rows: Map.rows,
      cols: Map.cols,
      owned: player.ownCells,
      allowed: player.allowedcells
    },
    PLAYER: {
      position: player.position,
      palette: player.palette,
      admin: player.name == "a"
    }
  }
}

function listenGameEvents(socket, player, Game) {

  socket.on('move', direction =>
    movePlayer(direction, socket, player, Game)
  );

  socket.on('fill', cell =>
    saveFill(cell, socket, player, Game)
  );

  socket.on('disconnect', () =>
    disconnect(socket, player, Game)
  );
}

function movePlayer(direction, socket, player, Game) {
  const { Map } = Game;
  socket.emit("moveCallback");
  const newPos = player.checkMove.call({ player, Map }, direction);
  if (!newPos) return;
  socket.emit("newPlayerPos", newPos);
  socket.broadcast.emit("newPosition", [player.position, newPos]);
  Map.newPosition([player.position, newPos])
  player.position = newPos;
};

function saveFill(cell, socket, player, Game) {
  const { Map, Database } = Game;
  Database.saveFill(player.dbid, cell);
  Map.saveFill(cell)
  socket.emit("fillCallback");
  socket.broadcast.emit('NewCell', cell);
  if (player.alreadyOwns(cell.position)) return;
  player.updateOwnings.call({ player, Map }, cell.position)
  socket.emit('AllowedCells', player.allowedcells);
};

function disconnect(socket, player, Game) {
  const { Map, Database } = Game;
  const { dbid, position, palette } = player;
  console.log(`Player left : ${dbid}`);
  if (position) {
    Map.newPosition([position, null]);
    socket.broadcast.emit("newPosition", [position, null]);
  };
};
