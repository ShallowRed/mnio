function posinview(position, PLAYER, GAME, MAP) {

  let cell = indextocoord(position, GAME);
  if (PLAYER.is.down) cell[0] -= GAME.RowCol[0] - MAP.RowCol[0];
  else if (!PLAYER.is.up) cell[0] -= PLAYER.coord[0] - MAP.half[0];
  if (PLAYER.is.right) cell[1] -= GAME.RowCol[1] - MAP.RowCol[1];
  else if (!PLAYER.is.left) cell[1] -= PLAYER.coord[1] - MAP.half[1];
  return [cell[0], cell[1]];
}

function check(position, PLAYER, GAME, MAP) {
  let cell = posinview(position, PLAYER, GAME, MAP);
  if (cell[0] >= 0 && cell[0] <= MAP.RowCol[0] && cell[1] >= 0 && cell[1] <= MAP.RowCol[1]) return [cell[0], cell[1]];
}

function indextocoord(index, GAME) {
  let coordx = (index - (index % GAME.RowCol[1])) / GAME.RowCol[0];
  let coordy = (index % GAME.RowCol[0]);
  return [coordx, coordy];
}

function coordtoindex(coord, GAME) {
  let index = GAME.RowCol[1] * coord[0] + coord[1];
  return index;
}

function zoom(dir, GAME, MAP) {
  if (!GAME.flag.ok()) return;
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
  PLAYER.Scolor = PLAYER.colors[UI.cs.indexOf(selectedColor)];
  PLAYER.canvas[0].style.background = PLAYER.Scolor;
  UI.cs.filter(color => color !== selectedColor).forEach(color => {
    color.style.setProperty('border-width', "1px");
    color.style.setProperty('transform', "scale(0.8)");
  });
}


export {
  zoom,
  select,
  check,
  indextocoord,
  coordtoindex
}
