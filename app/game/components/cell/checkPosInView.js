import { indextocoord } from '../../utils/converters';

export const check = (position, Game) => {
  const coord = getPosInView(position, Game);
  if (isInMap(coord, Game.Map))
    return coord;
}

const isInMap = ([x, y], Map) => {
  return x >= -1 &&
    y >= -1 &&
    x <= Map.cols + 2 &&
    y <= Map.rows + 2
};

const getPosInView = (position, { Player, cols, rows }) => {
  const [pX, pY] = Player.coord; // player abs pos
  const [pvX, pvY] = Player.posInView; // player rel pos
  const [aX, aY] = indextocoord(position, { cols, rows }); // this abs pos
  return [
    aX - pX + pvX + 1,
    aY - pY + pvY + 1
  ];
}
