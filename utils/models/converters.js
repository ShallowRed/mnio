const setparams = require('../params');
const setup = setparams();
const rows = setup.rows;
const cols = setup.cols;

function indextocoord(index) {
  let coordx = (index - (index % rows)) / cols;
  let coordy = (index % rows);
  return [coordx, coordy];
}

function coordtoindex(coord) {
  let index = rows * coord[0] + coord[1];
  return index;
}

module.exports = {
  indextocoord,
  coordtoindex
}
