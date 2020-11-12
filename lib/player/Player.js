const checkMove = require('./checkMove');
const allowCells = require('./allowCells');

module.exports = class Player {

  constructor({ playerid, userName, palette, ownCells }, Game) {
    const { gridState, rows, cols } = Game;
    this.name = userName;
    this.dbid = playerid;
    this.palette = palette;
    this.ownCells = ownCells || [];
    this.position =  this.ownCells[0] || randomPosition(gridState)
    this.allowedcells = allowCells.call({ rows, cols }, ownCells);
  }

  checkMove(dir) {
    return checkMove.call(this, dir);
  }

  alreadyOwns(position) {
    return this.ownCells.includes(position);
  }

  updateOwnings(position) {
    const { player, Game: { rows, cols } } = this;
    player.ownCells.push(position);
    player.allowedcells = allowCells.call({ rows, cols }, player.ownCells);
  }
}

const randomPosition = list => {
  const emptyCells = list.map(indexOfNull)
    .filter(isNull);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const indexOfNull = (e, i) =>
  !e ? i : null;

const isNull = e =>
  e !== null;
