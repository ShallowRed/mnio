module.exports = (socket, player, Game) => {
  socket.emit('initGame', getInitData(player, Game));
  socket.broadcast.emit("newPosition", [null, player.position]);
  Game.newPosition([null, player.position]);
};

function getInitData(player, Game) {

  return {
    GAME: {
      colors: Game.gridState,
      positions: Game.playersPositions,
      rows: Game.rows,
      cols: Game.cols,
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
