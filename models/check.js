const convert = require('./converters');
const Config = require('../controlers/config');
var limit = 200;

function move(player, direction, ColorList, PositionList) {
  let coord = convert.indextocoord(player.position);
  if (direction == "up" && coord[0] !== 0) coord[0]--;
  else if (direction == "down" && coord[0] !== Config.cols - 1) coord[0]++;
  else if (direction == "left" && coord[1] !== 0) coord[1]--;
  else if (direction == "right" && coord[1] !== Config.rows - 1) coord[1]++;
  else return;

  let nextpos = convert.coordtoindex(coord);
  if (player.owncells.includes(nextpos) ||
      (player.allowedcells.includes(nextpos) &&
      !PositionList.includes(nextpos) &&
      !ColorList[nextpos])) return nextpos;
};

function cells(owncells) {

  let allowedcells = [];
  let neighbors = [];
  let xcount = 0;
  let ycount = 0;
  let length = 0;

  owncells.forEach(function(cell) {
    let pos = convert.indextocoord(cell);
    xcount += pos[0];
    ycount += pos[1];
    ++length;

    let nearby = [
      [pos[0], pos[1]],
      [pos[0], pos[1] - 1],
      [pos[0], pos[1] + 1],
      [pos[0] - 1, pos[1]],
      [pos[0] + 1, pos[1]]
    ];
    nearby.forEach(function(cell) {
      if (!neighbors.includes(cell)) neighbors.push(cell);
    });
  });

  let averagepos = [Math.round(xcount / length), Math.round(ycount / length)];
  // if (owncells.length>10) limit = Math.sqrt(owncells.length);
  // limit = Math.round(Math.pow(Math.sqrt(owncells.length) + 2), 2);
  //console.log(limit);

  neighbors.forEach(function(cell) {
    let index = convert.coordtoindex(cell);
    if (cell[0] >= 0 && cell[1] >= 0 &&  cell[0] < Config.rows && cell[1] <Config.cols &&
      Math.abs(cell[0] - averagepos[0]) < limit && Math.abs(cell[1] - averagepos[1]) < limit &&
      !allowedcells.includes(index)) allowedcells.push(index);
  });
  return allowedcells;
};

module.exports = {
  move,
  cells
}
