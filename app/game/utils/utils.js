const indextocoord = (index, { cols, rows }) => {
  const x = index % cols;
  const y = (index - x) / rows;
  return [x, y];
}

const coordtoindex = ([x, y], { cols }) => {
  return cols * y + x;
}

const check = (position, Game) => {
  const coord = getPosInView(position, Game);
  if (isInMap(coord, Game.Map))
    return coord;
}

const isInMap = ([x, y], Map) => {
  return x >= 0 &&
    y >= 0 &&
    x <= Map.cols + 1 &&
    y <= Map.rows + 1
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

export {
  check,
  indextocoord,
  coordtoindex
}
