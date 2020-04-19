const convert = require('./converters');
const Config = require('../controlers/config');
var limit = 200;

function move(player, direction, MNIO) {
  let coord = convert.indextocoord(player.position);
  if (direction == "up" && coord[0] !== 0) coord[0]--;
  else if (direction == "down" && coord[0] !== Config.cols - 1) coord[0]++;
  else if (direction == "left" && coord[1] !== 0) coord[1]--;
  else if (direction == "right" && coord[1] !== Config.rows - 1) coord[1]++;
  else return;

  let nextpos = convert.coordtoindex(coord);
  if (player.owncells.includes(nextpos) || (player.allowedcells.includes(nextpos) &&
    !MNIO.PositionList.includes(nextpos) && !MNIO.ColorList[nextpos])) return nextpos;
};

function cells(owncells) {
  let averagepos = average(owncells);
  let allowedcells = [...new Set([...new Set(owncells.reduce((r, cell) => {
    let pos = convert.indextocoord(cell);
    r.push([pos[0], pos[1]], [pos[0], pos[1] - 1], [pos[0], pos[1] + 1], [pos[0] - 1, pos[1]], [pos[0] + 1, pos[1]]);
    return r;
  }, []))].map(cell => {
    let index = convert.coordtoindex(cell);
    if (cell[0] >= 0 && cell[1] >= 0 && cell[0] < Config.rows && cell[1] < Config.cols &&
      Math.abs(cell[0] - averagepos[0]) < limit && Math.abs(cell[1] - averagepos[1]) < limit && index) return index;
  }))];
  return allowedcells;
}

function average(owncells) {
  let averagepos = owncells.reduce((av, cell) => {
    let pos = convert.indextocoord(cell);
    return [av[0] + pos[0], av[1] += pos[1]];
  }, [0, 0]);
  return [Math.round(averagepos[0] / owncells.length), Math.round(averagepos[1] / owncells.length)];
};

module.exports = {
  move,
  cells
}
