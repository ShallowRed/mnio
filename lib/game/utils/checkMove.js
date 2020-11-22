const convert = require('./converters');

module.exports = function checkMove(dir, player, Map) {
  const { rows, cols } = Map;
  let [x, y] = convert.indextocoord(player.position, { rows, cols });

  if (dir == "up" && x !== 0) x--;
  else if (dir == "down" && x !== cols - 1) x++;
  else if (dir == "left" && y !== 0) y--;
  else if (dir == "right" && y !== rows - 1) y++;
  else return;

  const nextpos = convert.coordtoindex([x, y], { rows });
  if (isAvailable(nextpos, player, Map)) return nextpos;
};

const isAvailable = (nextpos, { ownCells, allowedCells }, { playersPositions,
  gridState }) => {
  return ownCells.includes(nextpos) ||
    (
      allowedCells.includes(nextpos) &&
      !playersPositions.includes(nextpos) &&
      !gridState[nextpos]
    )
};
