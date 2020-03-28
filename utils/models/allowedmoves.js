const convert = require('../models/converters');
const setparams = require('../params');

const setup = setparams(),
  rows = setup.rows,
  cols = setup.cols;

function isallowed(player, direction, colorlist) {
  let playerx = convert.indextocoord(player.position)[0];
  let playery = convert.indextocoord(player.position)[1];
  //Evaluate which cell is wanted, cancel if outside the grid
  switch (direction) {
    case "up":
      if (playerx == 0) return;
      playerx--;
      break;
    case "down":
      if (playerx == cols - 1) return;
      playerx++;
      break;
    case "left":
      if (playery == 0) return;
      playery--;
      break;
    case "right":
      if (playery == rows - 1) return;
      playery++;
      break;
  }
  let nextpos = convert.coordtoindex([playerx, playery]);
  if (!player.allowedcells.includes(nextpos) ||
    (!player.owncells.includes(nextpos) && colorlist[nextpos] !== null)) return;
  else return nextpos;
};

module.exports = isallowed;
