const convert = require('./converters');
const Config = require('../controlers/config');
const rows = Config.rows;
const cols = Config.cols;

function isallowed(player, direction, ColorList, PositionList) {

  let coord = convert.indextocoord(player.position);
  if (direction == "up" && coord[0] !== 0) coord[0]--;
  else if (direction == "down" && coord[0] !== cols - 1) coord[0]++;
  else if (direction == "left" && coord[1] !== 0) coord[1]--;
  else if (direction == "right" && coord[1] !== rows - 1) coord[1]++;
  else return;

  let nextpos = convert.coordtoindex(coord);
  if (player.owncells.includes(nextpos) ||
      (player.allowedcells.includes(nextpos) &&
      !PositionList.includes(nextpos) &&
      !ColorList[nextpos])) return nextpos;
};

module.exports = isallowed;
