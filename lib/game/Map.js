const randomPosition = require('./utils/randomPosition');

module.exports = class Map {

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

  hasAvailableSpace() {
    return this.gridState.filter(e => e == null).length > 0;
  }

  randomPosition() {
    return randomPosition(this.gridState);
  }


}
