const Conf = require('../../config/mnio.config');
const convert = require('./converters');

const move = (player, dir, MNIO) => {

  const coord = convert.indextocoord(player.position);

  if (dir == "up" && coord[0] !== 0) coord[0]--;
  else if (dir == "down" && coord[0] !== Conf.cols - 1) coord[0]++;
  else if (dir == "left" && coord[1] !== 0) coord[1]--;
  else if (dir == "right" && coord[1] !== Conf.rows - 1) coord[1]++;
  else return;

  const nextpos = convert.coordtoindex(coord);

  if (player.owncells.includes(nextpos) ||
    (player.allowedcells.includes(nextpos) &&
      !MNIO.PositionList.includes(nextpos) &&
      !MNIO.ColorList[nextpos]))
    return nextpos;
};

module.exports = move;
