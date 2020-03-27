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
      convert.coordtoindex(xpos, ypos - 1),
      convert.coordtoindex(xpos, ypos + 1),
      convert.coordtoindex(xpos - 1, ypos),
      convert.coordtoindex(xpos + 1, ypos)
    ];

    sidecells.forEach(function(cell) {
      if (!neighbors.includes(cell)) {
        neighbors.push(cell);
      };
    });
  });

  let averagepos = [Math.round(xcount / length), Math.round(ycount / length)];

  neighbors.forEach(function(cell) {
    let coord = convert.indextocoord(cell);
    let distfromavx = Math.abs(coord[0] - averagepos[0]);
    let distfromavy = Math.abs(coord[1] - averagepos[1]);
    if (cell < 0 || cell > rows*cols || distfromavx >= limit || distfromavy >= limit || allowedcells.includes(cell)) {
      return;
    } else {
      allowedcells.push(cell);
    }
  });
  return allowedcells;
};

module.exports = setallowedcells;
