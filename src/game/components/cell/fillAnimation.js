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
    divx: 0,
    divy: 0,
    lastdivx: 0,
    lastdivy: 0
  });
};

const fillFrame = (props, { divx, divy, lastdivx, lastdivy },
  start = Date.now()) => {

  const { flag, cellSize } = props;

  lastdivx = divx;
  lastdivy = divy;

  const delay = Date.now() - start;
  const progress = delay * N_STRIPES / TIME_LIMIT;

  divy = Math.trunc(progress);
  divx = Math.round((progress - divy) * cellSize);

  if (divy !== lastdivy) {

    drawLine(props, { divy: lastdivy, fromX: lastdivx, toX: cellSize });

    for (let i = lastdivy + 1; i < divy; i++) {
      drawLine(props, { divy: i, fromX: 0, toX: cellSize });
    }

    drawLine(props, { divy, fromX: 0, toX: divx });

  } else {
    drawLine(props, { divy, fromX: lastdivx, toX: divx });
  }

  if (delay < TIME_LIMIT) {
    window.requestAnimationFrame(() => {
      fillFrame(props, { divx, divy, lastdivx, lastdivy }, start);
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
}, { divy, fromX, toX }, posy) => {

  if (divy < numSmallStripes) {
    posy = ((divy + 0.5) * lineWidth);
  } else if (divy < N_STRIPES) {
    ++lineWidth;
    posy = cellSize - ((N_STRIPES - divy - 0.5) * lineWidth);
  } else return;

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = sColor;
  ctx.beginPath();
  ctx.moveTo(x + fromX, y - posy);
  ctx.lineTo(x + toX, y - posy);
  ctx.stroke();
};
