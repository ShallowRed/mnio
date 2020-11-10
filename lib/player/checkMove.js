const {rows, cols} = require('../config');

const convert = require('./converters');

module.exports = (player, dir, Game) => {
  const coord = convert.indextocoord(player.position);
  setNextCoord(coord, dir)
  if (isNotInMap(coord, dir)) return;
  const nextpos = convert.coordtoindex(coord);
  if (isAvailable(nextpos, player, Game)) return nextpos;
};

const setNextCoord = (coord, dir) => {
  if (dir == "up") coord[0]--;
  else if (dir == "down") coord[0]++;
  else if (dir == "left") coord[1]--;
  else if (dir == "right") coord[1]++;
  else return true;
};

const isNotInMap = (coord, dir) => {
  if (coord[0] < 0 ||
    coord[0] == cols ||
    coord[1] < 0 ||
    coord[1] == rows)
    return true
};

const isAvailable = (nextpos, player, {playersPositions, gridState}) => {
  return player.ownCells.includes(nextpos) ||
    (player.allowedcells.includes(nextpos) &&
      !playersPositions.includes(nextpos) &&
      !gridState[nextpos])
};
