const check = (position, Game) => {
  const { Player, Map, rows, cols } = Game;
  const [x, y] = posInView(position, Player, { rows, cols }, Map);

  if (
    x >= 0 &&
    x <= Map.cols + 1 &&
    y >= 0 &&
    y <= Map.rows + 1
  ) return [x, y];
}

const posInView = (position, Player, { cols }) => {
  const [x, y] = Player.coord; // player absolute pos
  let [ax, ay] = indextocoord(position, { cols }); // absolute pos
  return [
    ax - x + Player.posInView.x + 1,
    ay - y + Player.posInView.y + 1
  ];
}

const indextocoord = (index, { cols }) => {
  const x = index % cols;
  const y = (index - x) / cols;
  return [x, y];
}

const coordtoindex = ([x, y], { cols }) => {
  return cols * y + x;
}

// console.log(indextocoord(13, {cols: 5})); // return [3, 2]
// console.log(coordtoindex([3, 2], {cols: 5})); // return 13

export {
  check,
  indextocoord,
  coordtoindex
}
