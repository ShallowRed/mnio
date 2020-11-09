const Conf = require('../config');
const convert = require('../converters');
const events = require('../events');

module.exports = (player, dir, MNIO) => {
  const coord = convert.indextocoord(player.position);
  setNextCoord(coord, dir)
  if (isNotInMap(coord, dir)) return;
  const nextpos = convert.coordtoindex(coord);
  if (isAvailable(nextpos, player, MNIO)) return nextpos;
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
    coord[0] == Conf.cols ||
    coord[1] < 0 ||
    coord[1] == Conf.rows)
    return true
};

const isAvailable = (nextpos, player, MNIO) => {
  return player.owncells.includes(nextpos) ||
    (player.allowedcells.includes(nextpos) &&
      !MNIO.PositionList.includes(nextpos) &&
      !MNIO.ColorList[nextpos])
};
