import { getCoordInView } from './checkPosInView';

const ANIMATION_DURATION = 600;
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
    y: Math.round(cellSize * y),
    lineWidth: Math.floor(cellSize / N_STRIPES),
    numSmallStripes: N_STRIPES - cellSize % N_STRIPES,
    flag,
    ctx,
    cellSize,
    sColor
  });
};

const fillFrame = (props,
  lastStripeIndex = 0,
  lastStripePortion = 0,
  startDate = Date.now()) => {

  const { flag, cellSize } = props;

  const delay = Date.now() - startDate;
  const progress = delay * N_STRIPES / ANIMATION_DURATION;

  const stripeIndex = Math.trunc(progress);
  const stripePortion = Math.round((progress - stripeIndex) * cellSize);

  drawFrameStripes(props, stripeIndex, lastStripeIndex, stripePortion,
    lastStripePortion, cellSize);

  if (delay < ANIMATION_DURATION) {

    window.requestAnimationFrame(() => {
      fillFrame(props, stripeIndex, stripePortion, startDate);
    });

  } else {
    flag.fill = false;
  }
};

const drawFrameStripes = (props, stripeIndex, lastStripeIndex, stripePortion,
  lastStripePortion, cellSize) => {

  if (stripeIndex === lastStripeIndex) {

    drawStripe(stripeIndex, [lastStripePortion, stripePortion], props);

  } else {

    drawStripe(lastStripeIndex, [lastStripePortion, cellSize], props);

    for (let i = lastStripeIndex + 1; i < stripeIndex; i++) {
      drawStripe(i, [0, cellSize], props);
    }

    drawStripe(stripeIndex, [0, stripePortion], props);
  }
}

const drawStripe = (stripeIndex, [startX, endX], {
  x,
  y,
  ctx,
  sColor,
  cellSize,
  lineWidth,
  numSmallStripes
}) => {

  let posY;

  if (stripeIndex < numSmallStripes) {
    posY = cellSize - lineWidth * (stripeIndex + 0.5);
  } else if (stripeIndex < N_STRIPES) {
    ++lineWidth;
    posY = lineWidth * (N_STRIPES - stripeIndex - 0.5);
  } else return;

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = sColor;
  ctx.beginPath();
  ctx.moveTo(x + startX, y + posY);
  ctx.lineTo(x + endX, y + posY);
  ctx.stroke();
};
