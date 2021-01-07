const { indexToCoord, coordToIndex } = require('./converters');

module.exports = function allowCells(ownCells, { cols, rows }) {
  if (!ownCells || !ownCells.length) return [];
  return ownCells.reduce((acc, pos) =>
    getNeighbours(acc, pos, { cols, rows }), []);
}

const getNeighbours = (acc, pos, { cols, rows }) => {
  const coord = indexToCoord(pos, { cols, rows });
  getNeighboursCoord(coord)
    .forEach(neighbourCoord =>
      checkNPushNeighbour(neighbourCoord, acc, { cols, rows })
    );
  return acc;
}

const checkNPushNeighbour = (neighbourCoord, acc, { cols, rows }) => {
  if (!isInMap(neighbourCoord, { cols, rows })) return;
  const neighBourPos = coordToIndex(neighbourCoord, { cols });
  if (!acc.includes(neighBourPos))
    acc.push(neighBourPos)
}

const isInMap = ([x, y], { cols, rows }) => {
  return (x >= 0 && y >= 0 && x < cols && y < rows);
};

const getNeighboursCoord = ([x, y]) => ([
  [x, y],
  [x - 1, y],
  [x + 1, y],
  [x, y - 1],
  [x, y + 1]
]);
