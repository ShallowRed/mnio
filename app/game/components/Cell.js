import { check } from '../utils/utils';
import { fillCell, roundSquare } from '../utils/canvas';

const Cell = {

  render: {

    clear: (position, GAME) => {
      const coord = check(position, GAME);
      if (!coord) return;
      const { ctx, cellSize } = GAME.MAP;
      fillCell(coord, cellSize, ctx[2], null);
    },

    color: (position, GAME) => {
      const coord = check(position, GAME);
      if (!coord) return;
      const { colors, MAP: { ctx, cellSize } } = GAME;
      fillCell(coord, cellSize, ctx[1], `#${colors[position]}`);
    },

    allowed: (position, GAME) => {
      const coord = check(position, GAME);
      if (!coord) return;
      const { ctx, cellSize } = GAME.MAP;
      fillCell(coord, cellSize, ctx[0], '#e9e9e9');
    },

    position: (position, GAME) => {
      const coord = check(position, GAME);
      if (!coord) return;
      const { ctx, cellSize, shift } = GAME.MAP;
      roundSquare(coord, cellSize, ctx[2], shift);
    }
  },

  fillAnimation(position, GAME) {
    const [x, y] = check(position, GAME);
    const {
      flag,
      PLAYER: { sColor },
      MAP: { lw, cellSize, ctx: [, ctx] }
    } = GAME;

    flag.fill = true;
    ctx.lineWidth = lw;
    ctx.strokeStyle = sColor;

    const initCoord = {
      divx: 0,
      divy: 0,
      x: cellSize * y,
      y: cellSize * (x + 1)
    };

    fillFrame(flag, initCoord, { ctx, lw, cellSize, sColor });
  }
};

const fillFrame = (flag, { x, y, divx, divy }, {
  ctx,
  lw,
  cellSize,
  sColor
}) => {

  if (endWidth(divx, cellSize)) { // go to beginning of upper line
    divy += lw;
    divx = 0;
  }

  divx += Math.round(cellSize / 8);

  if (nearEndWidth(divx, cellSize)) { // go to the end of current line
    divx = cellSize;
  }

  if (nearEndHeight(divy, cellSize)) { // fill what's left
    lw = cellSize - divy;
    ctx.lineWidth = lw;
    divy = cellSize - lw;
  }

  fillDiv({ divx, divy, x, y }, { ctx, lw, sColor });

  if (
    nearEndHeight(divy, cellSize) &&
    endWidth(divx, cellSize)
  )
    flag.fill = false;
  else
    window.requestAnimationFrame(() =>
      fillFrame(flag, { x, y, divx, divy }, { ctx, lw, cellSize, sColor })
    );
};

const endWidth = (divx, cellSize) =>
  divx == cellSize;

const nearEndWidth = (divx, cellSize) =>
  divx >= cellSize * 0.65;

const nearEndHeight = (divy, cellSize) =>
  divy > cellSize * 4.5 / 6;

const fillDiv = ({ x, y, divx, divy }, { ctx, lw, sColor }) => {
  ctx.strokeStyle = sColor;
  ctx.beginPath();
  ctx.moveTo(x, y - divy - lw / 2);
  ctx.lineTo(x + divx, y - divy - lw / 2);
  ctx.stroke();
};

export default Cell;
