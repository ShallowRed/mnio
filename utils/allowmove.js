const setparams = require(__dirname + '/params');
const convert = require(__dirname + '/helpers');

const setup = setparams(),
  rows = setup.rows,
  cols = setup.cols;

function isallowed(player, direction, colorlist) {
  let playerx = convert.indextocoord(player.position)[0];
  let playery = convert.indextocoord(player.position)[1];
  //Evaluate which cell is wanted, cancel if outside the grid
  switch (direction) {
    case "up":
      if (playerx == 0)
      return false;
      playerx--;
      break;
    case "down":
      if (playerx == cols - 1) return false;
      playerx++;
      break;
    case "left":
      if (playery == 0) return false;
      playery--;
      break;
    case "right":
      if (playery == rows - 1) return false;
      playery++;
      break;
  }
  let nextpos = convert.coordtoindex([playerx, playery]);
  if (!player.allowedcells.includes(nextpos)) {
    return false;
  } else if (!player.owncells.includes(nextpos) && colorlist[nextpos] !== null) {
    return false;
  } else {
    return nextpos;
  };
};

module.exports = isallowed;
