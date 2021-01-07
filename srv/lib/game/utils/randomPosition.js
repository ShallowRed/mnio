module.exports = function randomPosition(list) {
  const emptyCells = list.map(indexIfEmptyCell)
    .filter(isNull);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const indexIfEmptyCell = (e, i) =>
  !e ? i : null;

const isNull = e =>
  e !== null;
