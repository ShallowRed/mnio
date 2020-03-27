const setparams = require(__dirname + '/params');
const setup = setparams();
const rows = setup.rows;
const cols = setup.cols;

function coordtopos(coordx, coordy) {
  let position = "" + coordx + "_" + coordy + "";
  return position;
}

function postocoord(position) {
  let coordx = parseInt(position.split('_')[0]);
  let coordy = parseInt(position.split('_')[1]);
  return [coordx, coordy];
}

function postoindex(position) {
  let xpos = postocoord(position)[0];
  let ypos = postocoord(position)[1];
  let index = rows * xpos + ypos;
  return index;
}

function indextopos(index) {
  let position = (index - (index % rows)) / cols + "_" + (index % rows);
  return position;
}

function coordtoindex(xpos, ypos) {
  let index = rows * xpos + ypos;
  return index;
}

module.exports = {
  coordtopos,
  postocoord,
  postoindex,
  indextopos,
  coordtoindex
}
