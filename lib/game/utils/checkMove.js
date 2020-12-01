const { indextocoord, coordtoindex } = require('./converters');

module.exports = function checkMove(dir, player, Map) {
  const { cols, rows } = Map;
  let [x, y] = indextocoord(player.position, { cols, rows });

  if (dir == "left" && x !== 0) x--;
  else if (dir == "right" && x !== cols - 1) x++;
  else if (dir == "up" && y !== 0) y--;
  else if (dir == "down" && y !== rows - 1) y++;
  else return;

  const nextpos = coordtoindex([x, y], { cols });
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
