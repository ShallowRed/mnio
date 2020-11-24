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

const posInView = (position, Player, { rows, cols }, Map) => {
  const [x, y] = Player.coord; // player absolute pos
  const { is } = Player;
  let [ax, ay] = indextocoord(position, { cols }); // absolute pos
  const shift = {
    top: is.up ? 0 : is.down ? 2 : 1,
    left: is.left ? 0 : is.right ? 2 : 1
  }
  return [
    ax - x + Player.posInView.x + shift.left,
    ay - y + Player.posInView.y + shift.top
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
