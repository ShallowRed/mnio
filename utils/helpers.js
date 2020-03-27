const setparams = require(__dirname + '/params');
const setup = setparams();
const rows = setup.rows;
const cols = setup.cols;

function indextocoord(index) {
  let coordx = (index - (index % rows)) / cols;
  let coordy = (index % rows);
  return [coordx, coordy];
}

function coordtoindex(xpos, ypos) {
  let index = rows * xpos + ypos;
  return index;
}

module.exports = {
  indextocoord,
  coordtoindex
}
