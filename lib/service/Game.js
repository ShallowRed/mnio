module.exports = class Game {

  constructor(gameData){
    this.playersPositions = [];
    Object.assign(this, gameData);
  }

  newPosition([lastPos, newPos]) {
    const positions = this.playersPositions;
    lastPos && positions.splice(positions.indexOf(lastPos), 1);
    newPos && positions.push(newPos);
  }

  saveFill({position, color}) {
    this.gridState[position] = color;
  }
}
