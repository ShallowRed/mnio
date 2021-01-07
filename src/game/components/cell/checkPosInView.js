import { indexToCoord } from '../../utils/converters';

export function getCoordInView(position, Game) {
  const { rows, cols, Map: { numCellsInView, offScreenCells }, Player } = Game;

  const absoluteCoord = indexToCoord(position, { rows, cols });

  const relativeCoord = absoluteCoord.map((coord, i) => {
    return coord - Player.coord[i] + Player.posInView[i] + offScreenCells;
  });

  if (isCoordInView(relativeCoord, numCellsInView, offScreenCells)) {
    return relativeCoord;
  }
}

const isCoordInView = ([x, y], numCellsInView, offScreenCells) => {
  return x > -offScreenCells &&
    y > -offScreenCells &&
    x - 1 <= numCellsInView[0] + offScreenCells &&
    y - 1 <= numCellsInView[1] + offScreenCells
};
