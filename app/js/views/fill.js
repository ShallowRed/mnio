const Fill = window.Fill = window.Fill || {};

Fill.init = (cell, color, GAME, MAP) => {
  GAME.flag = false;
  Fill.divx = 0;
  Fill.divy = 0;
  Fill.posx = MAP.CellSize * cell[1];
  Fill.posy = MAP.CellSize * (cell[0] + 1);
  Fill.lw = MAP.lw;
  MAP.ctx[1].strokeStyle = color;
  MAP.ctx[1].lineWidth = MAP.lw;
  Fill.frame(GAME, MAP);
};

Fill.frame = (GAME, MAP) => {
  if (Fill.divx == MAP.CellSize) {
    Fill.divy += Fill.lw;
    Fill.divx = 0;
  }
  Fill.divx += Math.round(MAP.CellSize / 8);
  if (Fill.divx >= MAP.CellSize * 0.65) {
    Fill.divx = MAP.CellSize;
  }
  if (Fill.divy > MAP.CellSize * 4.5 / 6) {
    Fill.lw = MAP.CellSize - Fill.divy;
    MAP.ctx[1].lineWidth = Fill.lw;
    Fill.divy = MAP.CellSize - Fill.lw;
  }
  MAP.ctx[1].strokeStyle = Fill.color;
  MAP.ctx[1].beginPath();
  MAP.ctx[1].moveTo(Fill.posx, Fill.posy - Fill.divy - Fill.lw / 2);
  MAP.ctx[1].lineTo(Fill.posx + Fill.divx, Fill.posy - Fill.divy - Fill.lw / 2);
  MAP.ctx[1].stroke();
  if (Fill.divy > MAP.CellSize * 4.5 / 6 && Fill.divx == MAP.CellSize) GAME.flag = true;
  else Fill.animationFrame = window.requestAnimationFrame(() =>
    Fill.frame(GAME, MAP));
};
