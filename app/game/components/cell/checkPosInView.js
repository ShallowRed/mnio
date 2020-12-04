import { indexToCoord } from '../../utils/converters';

export const check = (position, Game) => {
  const coord = getPosInView(position, Game);
  if (isInMap(coord, Game.Map))
    return coord;
}

const getPosInView = (position, { Player, cols, rows }) => {
  return indexToCoord(position, { cols, rows })
    .map((coord, i) =>
      coord - Player.coord[i] + Player.posInView[i] + 2
    )
}

const isInMap = ([x, y], Map) => {
  return x > 0 &&
    y > 0 &&
    x <= Map.numCells[0] + 3 &&
    y <= Map.numCells[1] + 3
};
