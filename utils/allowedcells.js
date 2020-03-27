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
    let xpos = convert.postocoord(cell)[0];
    let ypos = convert.postocoord(cell)[1];

    xcount = xcount + xpos;
    ycount = ycount + ypos;
    ++length;

    let upcell = ypos + 1;
    let downcell = ypos - 1;
    let leftcell = xpos + 1;
    let rightcell = xpos - 1;

    let sidecells = [
      convert.coordtopos(xpos, downcell),
      convert.coordtopos(xpos, upcell),
      convert.coordtopos(rightcell, ypos),
      convert.coordtopos(leftcell, ypos)
    ];

    sidecells.forEach(function(cell) {
      if (!neighbors.includes(cell)) {
        neighbors.push(cell);
      };
    });
  });

  let averagepos = [Math.round(xcount / length), Math.round(ycount / length)];

  neighbors.forEach(function(cell) {
    let distfromavx = Math.abs(convert.postocoord(cell)[0] - averagepos[0]);
    let distfromavy = Math.abs(convert.postocoord(cell)[1] - averagepos[1]);
    if (distfromavx >= limit || distfromavy >= limit || allowedcells.includes(cell)) {
      return;
    } else {
      allowedcells.push(cell);
    }
  });
  return allowedcells;
};

module.exports = setallowedcells;
