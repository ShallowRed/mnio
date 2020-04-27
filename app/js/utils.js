function posinview(position, PLAYER, GAME, MAP) {

  let cell = indextocoord(position, GAME);
  if (PLAYER.is.down) cell[0] -= GAME.rc[0] - MAP.RowCol[0];
  else if (!PLAYER.is.up) cell[0] -= PLAYER.coord[0] - MAP.half[0];
  if (PLAYER.is.right) cell[1] -= GAME.rc[1] - MAP.RowCol[1];
  else if (!PLAYER.is.left) cell[1] -= PLAYER.coord[1] - MAP.half[1];
  return [cell[0], cell[1]];
}

function check(position, PLAYER, GAME, MAP) {
  let cell = posinview(position, PLAYER, GAME, MAP);
  if (cell[0] >= 0 && cell[0] <= MAP.RowCol[0] && cell[1] >= 0 && cell[1] <= MAP.RowCol[1]) return [cell[0], cell[1]];
}

function indextocoord(index, GAME) {
  let coordx = (index - (index % GAME.rc[1])) / GAME.rc[0];
  let coordy = (index % GAME.rc[0]);
  return [coordx, coordy];
}

function coordtoindex(coord, GAME) {
  let index = GAME.rc[1] * coord[0] + coord[1];
  return index;
}

function zoom(dir, GAME, MAP) {
  if (!flagOk(GAME)) return;
  if (dir == "in") {
    MAP.RowCol[1] -= 2;
    MAP.RowCol[0] -= 2;
  } else {
      MAP.RowCol[1] += 2;
      MAP.RowCol[0] += 2;
  }
  GAME.render();
}

function select(selectedColor, PLAYER, UI) {
  selectedColor.style.setProperty('border-width', "2px");
  selectedColor.style.setProperty('transform', "scale(1)");
  PLAYER.selectedcolor = PLAYER.colors[UI.cs.indexOf(selectedColor)];
  PLAYER.canvas[0].style.background = PLAYER.selectedcolor;
  UI.cs.filter(color => color !== selectedColor).forEach(color => {
    color.style.setProperty('border-width', "1px");
    color.style.setProperty('transform', "scale(0.8)");
  });
}

function flagOk(GAME) {
  if (GAME.flag && GAME.flag2 && GAME.flag3) return true;
}

export {
  zoom,
  flagOk,
  select,
  check,
  indextocoord,
  coordtoindex
}
