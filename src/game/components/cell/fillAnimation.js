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

  const initCoord = {
    divx: 0,
    divy: 0,
    lastdivx: 0,
    lastdivy: 0,
    x: Math.round(cellSize * x),
    y: Math.round(cellSize * (y + 1))
  };

  const lineWidth = Math.floor(cellSize / N_STRIPES);
  const numSmallStripes = N_STRIPES - cellSize % N_STRIPES;

  fillFrame(flag, initCoord, {
    ctx,
    cellSize,
    sColor,
    lineWidth,
    numSmallStripes
  });
};

const fillFrame = (flag, { x, y, divx, divy, lastdivx, lastdivy }, props,
  start = Date.now()) => {

  lastdivx = divx;
  lastdivy = divy;

  const delay = Date.now() - start;
  const progress = delay * N_STRIPES / TIME_LIMIT;

  divy = Math.trunc(progress);
  divx = Math.round((progress - divy) * props.cellSize);

  if (divy !== lastdivy) {
    drawLine({ x, y }, { divy: lastdivy, from: lastdivx, to: props.cellSize },
      props);
    for (let i = lastdivy + 1; i < divy; i++) {
      drawLine({ x, y }, { divy: i, from: 0, to: props.cellSize }, props);
    }
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
  cellSize,
  lineWidth,
  numSmallStripes
}) => {

  if (divy >= N_STRIPES) {
    return;
  } else if (divy >= numSmallStripes) {
    ++lineWidth;
  }

  const posy = divy < numSmallStripes ?
    ((divy + 0.5) * lineWidth) :
    cellSize - ((N_STRIPES - divy - 0.5) * lineWidth);

  ctx.lineWidth = lineWidth;

  ctx.strokeStyle = sColor;
  ctx.beginPath();
  ctx.moveTo(x + from, y - posy);
  ctx.lineTo(x + to, y - posy);
  ctx.stroke();
};
