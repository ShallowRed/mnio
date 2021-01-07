import { getCoordInView } from './checkPosInView';

export const fillAnimation = (position, Game) => {
  const [x, y] = getCoordInView(position, Game);

  const {
    flag,
    Player: { sColor },
    Map: { cellSize, ctx: [, ctx] }
  } = Game;

  const lineWidth = Math.round(cellSize / 6);

  flag.fill = true;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = sColor;

  const initCoord = {
    divx: 0,
    divy: 0,
    x: Math.round(cellSize * x),
    y: Math.round(cellSize * (y + 1))
  };

  // TESTING
  const start = Date.now();
  const steps = [];
  //

  fillFrame(flag, initCoord, { ctx, lineWidth, cellSize, sColor }, start,
    steps);
};

const fillFrame = (flag, { x, y, divx, divy }, {
  ctx,
  lineWidth,
  cellSize,
  sColor
}, start, steps) => {

  const isAtEndOfWidth = divx == cellSize;
  const isNearEndOfWidth = divx >= cellSize * 0.65;
  const isNearEndOfHeight = divy > cellSize * 4.5 / 6;

  if (isAtEndOfWidth) { // go to beginning of upper line
    divy += lineWidth;
    divx = 0;
  } else if (isNearEndOfWidth) { // go to the end of current line
    divx = cellSize;
  } else {
    divx += Math.round(cellSize / 8);
  }


  if (isNearEndOfHeight) { // fill what's left
    lineWidth = cellSize - divy;
    ctx.lineWidth = lineWidth;
  }

  fillDiv({ divx, divy, x, y }, { ctx, lineWidth, sColor }, start, steps);

  if (isNearEndOfHeight && isAtEndOfWidth) {
    flag.fill = false;

    // TESTING
    const output = steps.map((e, i) => {
      return steps[i - 1] ? e - steps[i - 1] : 0;
    });
    console.log({end: steps[steps.length - 1], steps: output});

  } else {
    window.requestAnimationFrame(() =>
      fillFrame(flag, { x, y, divx, divy }, {
        ctx,
        lineWidth,
        cellSize,
        sColor
      }, start, steps)
    );
  }
};

const fillDiv = ({ x, y, divx, divy }, { ctx, lineWidth, sColor }, start,
  steps) => {
  ctx.strokeStyle = sColor;
  ctx.beginPath();
  ctx.moveTo(x, y - divy - lineWidth / 2);
  ctx.lineTo(x + divx, y - divy - lineWidth / 2);
  ctx.stroke();
  console.log(Date.now() - start);
  const nextStep = Date.now() - start;
  steps.push(Math.round(nextStep * 100) / 100)
};
