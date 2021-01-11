import { getCoordInView } from './checkPosInView';

const TIME_LIMIT = 600;
const N_STRIPES = 8;

export const fillAnimation = (position, Game) => {
  const [x, y] = getCoordInView(position, Game);

  const {
    flag,
    Player: { sColor },
    Map: { cellSize, ctx: [, ctx] }
  } = Game;

  flag.fill = true;

  fillFrame({
    x: Math.round(cellSize * x),
    y: Math.round(cellSize * (y + 1)),
    lineWidth: Math.floor(cellSize / N_STRIPES),
    numSmallStripes: N_STRIPES - cellSize % N_STRIPES,
    flag,
    ctx,
    cellSize,
    sColor
  }, {
    divX: 0,
    divY: 0,
    lastDivX: 0,
    lastDivY: 0
  });
};

const fillFrame = (props, { divX, divY, lastDivX, lastDivY },
  start = Date.now()) => {

  const { flag, cellSize } = props;

  lastDivX = divX;
  lastDivY = divY;

  const delay = Date.now() - start;
  const progress = delay * N_STRIPES / TIME_LIMIT;

  divY = Math.trunc(progress);
  divX = Math.round((progress - divY) * cellSize);

  if (divY !== lastDivY) {

    drawLine(props, { divY: lastDivY, fromX: lastDivX, toX: cellSize });

    for (let i = lastDivY + 1; i < divY; i++) {
      drawLine(props, { divY: i, fromX: 0, toX: cellSize });
    }

    drawLine(props, { divY, fromX: 0, toX: divX });

  } else {
    drawLine(props, { divY, fromX: lastDivX, toX: divX });
  }

  if (delay < TIME_LIMIT) {
    window.requestAnimationFrame(() => {
      fillFrame(props, { divX, divY, lastDivX, lastDivY }, start);
    });
  } else {
    flag.fill = false;
  }
};

const drawLine = ({
  x,
  y,
  ctx,
  sColor,
  cellSize,
  lineWidth,
  numSmallStripes
}, { divY, fromX, toX }, posY) => {

  if (divY < numSmallStripes) {
    posY = (divY + 0.5) * lineWidth;
  } else if (divY < N_STRIPES) {
    ++lineWidth;
    posY = cellSize - (N_STRIPES - divY - 0.5) * lineWidth;
  } else return;

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = sColor;
  ctx.beginPath();
  ctx.moveTo(x + fromX, y - posY);
  ctx.lineTo(x + toX, y - posY);
  ctx.stroke();
};
