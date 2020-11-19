module.exports = function randomPosition(list) {
  const emptyCells = list.map(indexOfNull)
    .filter(isNull);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const indexOfNull = (e, i) =>
  !e ? i : null;

const isNull = e =>
  e !== null;
