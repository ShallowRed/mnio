const convert = require('./converters');

module.exports = function allowCells(ownCells, { rows, cols }) {
  if (!ownCells || !ownCells.length) return [];

  const neighbours = ownCells.reduce((r, i) => {
    const [x, y] = convert.indextocoord(i, { rows, cols });
    r.push(
      [x, y],
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y]
    );
    return r;
  }, []);

  const allowedCells = [...new Set(neighbours)].map(([x, y]) => {
    const position = convert.coordtoindex([x, y], { rows });
    const isInMap = (
      x >= 0 &&
      y >= 0 &&
      x < rows &&
      y < cols
    );
    if (position && isInMap) return position;
  });

  return [...new Set(allowedCells)];
}
