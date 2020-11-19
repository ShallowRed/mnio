const convert = require('./converters');

module.exports = function checkMove(dir) {
  const { player, Map } = this;
  const { rows, cols } = Map;
  const coord = convert.indextocoord.call({ rows, cols }, player.position);

  if (dir == "up" && coord[0] !== 0) coord[0]--;
  else if (dir == "down" && coord[0] !== cols - 1) coord[0]++;
  else if (dir == "left" && coord[1] !== 0) coord[1]--;
  else if (dir == "right" && coord[1] !== rows - 1) coord[1]++;
  else return;

  const nextpos = convert.coordtoindex.call({ rows, cols }, coord);
  if (isAvailable(nextpos, player, Map)) return nextpos;
};

const isAvailable = (nextpos, { ownCells, allowedcells }, {
  playersPositions,
  gridState
}) => {
  return ownCells.includes(nextpos) ||
    (allowedcells.includes(nextpos) &&
      !playersPositions.includes(nextpos) &&
      !gridState[nextpos])
};
