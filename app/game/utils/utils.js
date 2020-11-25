const indextocoord = (index, { cols }) => {
  const x = index % cols;
  const y = (index - x) / cols;
  return [x, y];
}

const coordtoindex = ([x, y], { cols }) => {
  return cols * y + x;
}

const check = (position, Game) => {
  const { Player, Map } = Game;
  const [x, y] = posInView(position, Player, Game);
  if (
    x >= 0 &&
    x <= Map.cols + 1 &&
    y >= 0 &&
    y <= Map.rows + 1
  ) return [x, y];
}

const posInView = (position, Player, { cols }) => {
  const [pX, pY] = Player.coord; // player absolute pos
  const [aX, aY] = indextocoord(position, { cols }); // this absolute pos
  return [
    aX - pX + Player.posInView.x + 1,
    aY - pY + Player.posInView.y + 1
  ];
}

// console.log(indextocoord(13, {cols: 5})); // return [3, 2]
// console.log(coordtoindex([3, 2], {cols: 5})); // return 13

export {
  check,
  indextocoord,
  coordtoindex
}
