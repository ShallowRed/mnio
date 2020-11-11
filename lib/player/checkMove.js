const { rows, cols } = require('../config');

const convert = require('./converters');

// here this refers to a Player instance

module.exports = function checkMove(dir, Game) {

  const coord = convert.indextocoord(this.position);

  if (dir == "up" && coord[0] !== 0) coord[0]--;
  else if (dir == "down" && coord[0] !== cols - 1) coord[0]++;
  else if (dir == "left" && coord[1] !== 0) coord[1]--;
  else if (dir == "right" && coord[1] !== rows - 1) coord[1]++;
  else return;

  const nextpos = convert.coordtoindex(coord);
  if (isAvailable(nextpos, this, Game)) return nextpos;
};

const isAvailable = (nextpos, { ownCells, allowedcells }, { playersPositions,
  gridState }) => {
  return ownCells.includes(nextpos) ||
    (allowedcells.includes(nextpos) &&
      !playersPositions.includes(nextpos) &&
      !gridState[nextpos])
};
