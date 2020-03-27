const convert = require(__dirname + '/helpers');
const setparams = require(__dirname + '/params');

const setup = setparams(),
  rows = setup.rows,
  cols = setup.cols,
  limit = setup.limit;

function setallowedcells(owncells) {
  //set increasing limit
  //limit = function(owncells.length);

  let allowedcells = [];
  let neighbors = [];
  let xcount = 0;
  let ycount = 0;
  let length = 0;

  owncells.forEach(function(cell) {
    let xpos = convert.indextocoord(cell)[0];
    let ypos = convert.indextocoord(cell)[1];

    xcount = xcount + xpos;
    ycount = ycount + ypos;
    ++length;

    let sidecells = [
      [xpos, ypos - 1],
      [xpos, ypos + 1],
      [xpos - 1, ypos],
      [xpos + 1, ypos]
    ];
    sidecells.forEach(function(cell) {
      if (!neighbors.includes(cell)) {
        neighbors.push(cell);
      };
    });
  });

  let averagepos = [Math.round(xcount / length), Math.round(ycount / length)];

  neighbors.forEach(function(cell) {
    let distfromavx = Math.abs(cell[0] - averagepos[0]);
    let distfromavy = Math.abs(cell[1] - averagepos[1]);
    let index = convert.coordtoindex(cell);
    if (cell[0] < 0 || cell[1] < 0 || cell[0] >= rows || cell[1] >= cols ||
       distfromavx >= limit || distfromavy >= limit ||
       allowedcells.includes(index)) {
      return;
    } else {
      allowedcells.push(index);
    }
  });
  return allowedcells;
};

module.exports = setallowedcells;
