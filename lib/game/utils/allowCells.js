const convert = require('./converters');

module.exports = function allowCells(ownCells, { cols, rows }) {
  if (!ownCells || !ownCells.length) return [];

  // return [...Array(rows * cols).keys()];

  const getNeighbours = (acc, position) => {
    const coord = convert.indexToCoord(position, { cols, rows });
    acc.push(...neighboursCoord(coord));
    return acc;
  }

  const isValidPosition = ([x, y]) => {
    const position = convert.coordToIndex([x, y], { cols });
    const isInMap = (x >= 0 && y >= 0 && x < cols && y < rows);
    if (position && isInMap) return position;
  };

  const neighbours = ownCells.reduce(getNeighbours, []);
  const allowedCells = [...new Set(neighbours)].map(isValidPosition);
  return [...new Set(allowedCells)];
}

const neighboursCoord = ([x, y]) => ([
  [x, y],
  [x - 1, y],
  [x + 1, y],
  [x, y - 1],
  [x, y + 1]
]);
