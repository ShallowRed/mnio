const Conf = require('../../config/mnio.config');
const convert = require('../converters');
const limit = 200;

const allow = owncells => {

  const averagepos = average(owncells);

  const neighbours = owncells.reduce((r, i) => {
    const p = convert.indextocoord(i);
    r.push(
      [p[0], p[1]],
      [p[0], p[1] - 1],
      [p[0], p[1] + 1],
      [p[0] - 1, p[1]],
      [p[0] + 1, p[1]]);
    return r;
  }, []);

  const allowedCells = [...new Set(neighbours)].map(e => {
    const i = convert.coordtoindex(e);
    const isInMap = (e[0] >= 0 && e[1] >= 0 && e[0] < Conf.rows && e[1] < Conf.cols);
    const isBeforeLimit = Math.abs(e[0] - averagepos[0]) < limit && Math.abs(e[1] - averagepos[1]) < limit;
    if (isInMap && isBeforeLimit && i) return i;
  });

  return [...new Set(allowedCells)];
}

const average = list => {
  const avPos = list.reduce((e, i) => {
    const pos = convert.indextocoord(i);
    return [
      e[0] + pos[0],
      e[1] + pos[1]
    ];
  }, [0, 0]);
  return [Math.round(avPos[0] / list.length), Math.round(avPos[1] / list.length)];
};

module.exports = allow;
