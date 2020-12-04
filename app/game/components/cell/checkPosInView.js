import { indexToCoord } from '../../utils/converters';

export const check = (position, Game) => {
  const coord = getPosInView(position, Game);
  if (isInMap(coord, Game.Map))
    return coord;
}

const getPosInView = (position, { Map, Player, cols, rows }) => {
  return indexToCoord(position, { cols, rows })
    .map((coord, i) =>
      coord - Player.coord[i] + Player.posInView[i] + Map.numOffscreen
    )
}

const isInMap = ([x, y], Map) => {
  const oS = Map.numOffscreen;
  return x > -oS &&
    y > -oS &&
    x <= Map.numCells[0] + 1 + oS &&
    y <= Map.numCells[1] + 1 + oS
};
