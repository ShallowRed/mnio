export default ([x, y], color, flag, MAP) => {
  const { lw, cellSize, ctx: [, ctx] } = MAP;

  flag.fill = true;

  ctx.lineWidth = lw;
  ctx.strokeStyle = color;

  const divx = 0;
  const divy = 0;
  const posx = cellSize * y;
  const posy = cellSize * (x + 1);

  fillFrame(flag, { divx, divy, posx, posy, color }, { ctx, lw, cellSize });
};

const fillFrame = (flag, { divx, divy, posx, posy, color }, {
  ctx,
  lw,
  cellSize
}) => {

  if (divx == cellSize) {
    divy += lw;
    divx = 0;
  }

  divx += Math.round(cellSize / 8);

  if (divx >= cellSize * 0.65) {
    divx = cellSize;
  }

  if (divy > cellSize * 4.5 / 6) {
    lw = cellSize - divy;
    ctx.lineWidth = lw;
    divy = cellSize - lw;
  }

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(posx, posy - divy - lw / 2);
  ctx.lineTo(posx + divx, posy - divy - lw / 2);
  ctx.stroke();

  if (divy > cellSize * 4.5 / 6 && divx == cellSize) {
    flag.fill = false;
    return;
  }

  window.requestAnimationFrame(() =>
    fillFrame(flag, { divx, divy, posx, posy, color }, {
      ctx,
      lw,
      cellSize
    })
  );
};
