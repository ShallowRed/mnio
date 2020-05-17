const posinview = (position, PLAYER, GAME, MAP) => {
  let cell = indextocoord(position, GAME);
  if (PLAYER.is.down) cell[0] -= GAME.RowCol[0] - MAP.RowCol[0];
  else if (!PLAYER.is.up) cell[0] -= PLAYER.coord[0] - MAP.half[0];
  if (PLAYER.is.right) cell[1] -= GAME.RowCol[1] - MAP.RowCol[1];
  else if (!PLAYER.is.left) cell[1] -= PLAYER.coord[1] - MAP.half[1];
  return [cell[0], cell[1]];
}

const check = (position, PLAYER, GAME, MAP) => {
  let cell = posinview(position, PLAYER, GAME, MAP);
  if (cell[0] >= 0 && cell[0] <= MAP.RowCol[0] && cell[1] >= 0 && cell[1] <= MAP.RowCol[1]) return cell;
}

const indextocoord = (index, GAME) => {
  let coordx = (index - (index % GAME.RowCol[1])) / GAME.RowCol[0];
  let coordy = (index % GAME.RowCol[0]);
  return [coordx, coordy];
}

const coordtoindex = (coord, GAME) => {
  let index = GAME.RowCol[1] * coord[0] + coord[1];
  return index;
}

const selectColor = (i, PLAYER, UI) => {
  PLAYER.Scolor = PLAYER.colors[i];
  PLAYER.canvas[0].style.background = PLAYER.Scolor;
  UI.colorBtns.forEach((btn, j) => {
    btn.style.setProperty('border-width', (j == i) ? "2px" : "1px");
    btn.style.setProperty('transform', (j == i) ? "scale(0.9)" : "scale(0.7)");
  });
}

export {
  selectColor,
  check,
  indextocoord,
  coordtoindex
}
