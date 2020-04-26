function posinview(position, PLAYER, GAME, MAP) {
  let cell = indextocoord(position, GAME);
  if (PLAYER.coefx == 2) cell[0] -= GAME.cols - MAP.cols;
  else if (PLAYER.coefx == 1) cell[0] -= PLAYER.x - MAP.hcols;
  if (PLAYER.coefy == 2) cell[1] -= GAME.rows - MAP.rows;
  else if (PLAYER.coefy == 1) cell[1] -= PLAYER.y - MAP.hrows;
  return [cell[0], cell[1]];
}

function check(position, PLAYER, GAME, MAP) {
  let cell = posinview(position, PLAYER, GAME, MAP);
  if (cell[0] >= 0 && cell[0] <= MAP.cols && cell[1] >= 0 && cell[1] <= MAP.rows) return [cell[0], cell[1]];
}

function indextocoord(index, GAME) {
  let coordx = (index - (index % GAME.rows)) / GAME.cols;
  let coordy = (index % GAME.cols);
  return [coordx, coordy];
}

function coordtoindex(coord, GAME) {
  let index = GAME.rows * coord[0] + coord[1];
  return index;
}

function roundRect(ctx, x, y, width, height, radius, MAP) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = MAP.shift;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.stroke();
}

function zoom(dir, GAME, MAP) {
  if (!flagOk(GAME)) return;
  if (dir == "in") {
    MAP.rows -= 2;
    MAP.cols -= 2;
  } else {
      MAP.rows += 2;
      MAP.cols += 2;
  }
  GAME.render();
}

function select(selectedColor, PLAYER, UI) {
  selectedColor.style.setProperty('border-width', "2px");
  selectedColor.style.setProperty('transform', "scale(1)");
  PLAYER.selectedcolor = PLAYER.colors[UI.cs.indexOf(selectedColor)];
  PLAYER.canvas.style.background = PLAYER.selectedcolor;
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
  coordtoindex,
  roundRect
}
