const posinview = (position, PLAYER, { rows, cols }, MAP) => {
  let [x, y] = indextocoord(position, { rows, cols });
  if (PLAYER.is.down)
    x -= cols - MAP.cols;
  else if (!PLAYER.is.up)
    x -= PLAYER.coord[0] - MAP.half[0];
  if (PLAYER.is.right)
    y -= rows - MAP.rows;
  else if (!PLAYER.is.left)
    y -= PLAYER.coord[1] - MAP.half[1];
  return [x, y];
}

const check = (position, GAME) => {
  const { PLAYER, MAP, rows, cols } = GAME;
  let [x, y] = posinview(position, PLAYER, { rows, cols }, MAP);

  if (
    x >= 0 &&
    x <= MAP.cols &&
    y >= 0 &&
    y <= MAP.rows
  ) return [x, y];
}

const indextocoord = (index, { rows, cols }) => {
  const coordx = (index - (index % rows)) / cols;
  const coordy = (index % cols);
  return [coordx, coordy];
}

const coordtoindex = (coord, { rows }) => {
  let index = rows * coord[0] + coord[1];
  return index;
}

export {
  check,
  indextocoord,
  coordtoindex
}
