const Fill = window.Fill = window.Fill || {};

Fill.init = (cell, color, GAME, MAP) => {
  GAME.flag = false;
  Fill.divx = 0;
  Fill.divy = 0;
  Fill.posx = MAP.cellSize * cell[1];
  Fill.posy = MAP.cellSize * (cell[0] + 1);
  Fill.lw = MAP.lw;
  MAP.ctx[1].strokeStyle = color;
  MAP.ctx[1].lineWidth = MAP.lw;
  Fill.frame(GAME, MAP);
};

Fill.frame = (GAME, MAP) => {
  if (Fill.divx == MAP.cellSize) {
    Fill.divy += Fill.lw;
    Fill.divx = 0;
  }
  Fill.divx += Math.round(MAP.cellSize / 8);
  if (Fill.divx >= MAP.cellSize * 0.65) {
    Fill.divx = MAP.cellSize;
  }
  if (Fill.divy > MAP.cellSize * 4.5 / 6) {
    Fill.lw = MAP.cellSize - Fill.divy;
    MAP.ctx[1].lineWidth = Fill.lw;
    Fill.divy = MAP.cellSize - Fill.lw;
  }
  MAP.ctx[1].strokeStyle = Fill.color;
  MAP.ctx[1].beginPath();
  MAP.ctx[1].moveTo(Fill.posx, Fill.posy - Fill.divy - Fill.lw / 2);
  MAP.ctx[1].lineTo(Fill.posx + Fill.divx, Fill.posy - Fill.divy - Fill.lw / 2);
  MAP.ctx[1].stroke();
  if (Fill.divy > MAP.cellSize * 4.5 / 6 && Fill.divx == MAP.cellSize) GAME.flag = true;
  else Fill.animationFrame = window.requestAnimationFrame(() =>
    Fill.frame(GAME, MAP));
};
