const checkMove = require('../utils/checkMove');

module.exports = function spawnPlayer(socket, player, Game) {
  const { Map } = Game;
  socket.emit('initGame', getInitData(player, Map));
  socket.broadcast.emit("newPosition", [null, player.position]);
  Map.newPosition([null, player.position]);
  listenGameEvents(socket, player, Game);
}

const getInitData = (player, Map) => {
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

const listenGameEvents = (socket, player, { Database, Map }) => {

  socket.on('move', direction =>
    movePlayer(direction, socket, player, Map)
  );

  socket.on('fill', cell =>
    saveFill(cell, socket, player, Database, Map)
  );

  socket.on('disconnect', () =>
    disconnect(socket, player, Map)
  );
}

const movePlayer = (direction, socket, player, Map) => {
  socket.emit("moveCallback");
  const newPos = checkMove(direction, player, Map);
  if (!newPos) return;
  socket.emit("newPlayerPos", newPos);
  socket.broadcast.emit("newPosition", [player.position, newPos]);
  Map.newPosition([player.position, newPos])
  player.position = newPos;
};

const saveFill = (cell, socket, player, Database, Map) => {
  Database.saveFill(player.dbid, cell);
  Map.saveFill(cell)
  socket.emit("fillCallback");
  socket.broadcast.emit('newFill', cell);
  player.updateOwnings(cell.position, Map, allowedCells => {
    socket.emit('allowedCells', allowedCells);
  })
};

const disconnect = (socket, { dbid, position }, Map) => {
  console.log(`Player left : ${dbid}`);
  if (!position) return;
  Map.newPosition([position, null]);
  socket.broadcast.emit("newPosition", [position, null]);
};
