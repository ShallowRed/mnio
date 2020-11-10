class Game {

  constructor(gameData){
    this.playersPositions = [];
    this.PLAYERS = {};
    Object.assign(this, gameData);
  }

  newPosition([lastPos, newPos]) {
    const positions = this.playersPositions;
    lastPos && positions.splice(positions.indexOf(lastPos), 1);
    newPos && positions.push(newPos);
  }

  newFill([position, color]) {
    this.gridState[position] = color;
  }

  setPlayer(socket, player) {
    this.PLAYERS[socket.id] = player;
  }

  getPlayer(socket) {
    return this.PLAYERS[socket.id];
  }

  get(prop) {
    return this[prop];
  }
}

module.exports = Game;
