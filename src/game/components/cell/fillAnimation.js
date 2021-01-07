import { getCoordInView } from './checkPosInView';

const TIME_LIMIT = 400;
const N_STRIPES = 8;

export const fillAnimation = (position, Game) => {
  const [x, y] = getCoordInView(position, Game);

  const {
    flag,
    Player: { sColor },
    Map: { cellSize, ctx: [, ctx] }
  } = Game;

  const lineWidth = Math.round(cellSize / N_STRIPES);

  flag.fill = true;
  ctx.lineWidth = lineWidth;

  const initCoord = {
    divx: 0,
    divy: 0,
    lastdivx: 0,
    lastdivy: 0,
    x: Math.round(cellSize * x),
    y: Math.round(cellSize * (y + 1))
  };

  fillFrame(flag, initCoord, { ctx, lineWidth, cellSize, sColor });
};

const fillFrame = (flag, { x, y, divx, divy, lastdivx, lastdivy }, props,
  start = Date.now()) => {

  lastdivx = divx;
  lastdivy = divy;

  const delay = Date.now() - start;
  const progress = delay * N_STRIPES / TIME_LIMIT;
  divy = Math.trunc(progress);
  divx = Math.round((progress - divy) * props.cellSize);

  if (lastdivy !== divy) {
    drawLine({ x, y }, { divy: lastdivy, from: lastdivx, to: props.cellSize },
      props);
    drawLine({ x, y }, { divy, from: 0, to: divx }, props);
  } else {
    drawLine({ x, y }, { divy, from: lastdivx, to: divx }, props);
  }

  if (delay > TIME_LIMIT) {
    flag.fill = false;
  } else {
    window.requestAnimationFrame(() =>
      fillFrame(flag, { x, y, divx, divy, lastdivx, lastdivy }, props,
        start)
    );
  }
};

const drawLine = ({ x, y }, { divy, from, to }, {
  ctx,
  sColor,
  lineWidth,
  cellSize
}) => {

  let posy = y - ((divy + 0.5) * lineWidth);

  if (divy == N_STRIPES - 1) {
    lineWidth = cellSize - (N_STRIPES - 1) * lineWidth;
    ctx.lineWidth = lineWidth;
    posy = y - cellSize + (0.5 * lineWidth);
  } else if (divy == N_STRIPES) {
    return;
  }

  ctx.strokeStyle = sColor;
  ctx.beginPath();
  ctx.moveTo(x + from, posy);
  ctx.lineTo(x + to, posy);
  ctx.stroke();
};
