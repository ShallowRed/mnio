import { check } from '../utils/utils';
import { fillCell, roundSquare } from '../utils/canvas';

const Cell = {

  render: {

    clear: (position, Game) => {
      const coord = check(position, Game);
      if (!coord) return;
      const { ctx, cellSize } = Game.Map;
      fillCell(coord, cellSize, ctx[2], null);
    },

    color: (position, Game) => {
      const coord = check(position, Game);
      if (!coord) return;
      const { colors, Map: { ctx, cellSize } } = Game;
      fillCell(coord, cellSize, ctx[1], `#${colors[position]}`);
    },

    allowed: (position, Game) => {
      const coord = check(position, Game);
      if (!coord) return;
      const { ctx, cellSize } = Game.Map;
      fillCell(coord, cellSize, ctx[0], '#e9e9e9');
    },

    position: (position, Game) => {
      const coord = check(position, Game);
      if (!coord) return;
      const { ctx, cellSize, shift } = Game.Map;
      roundSquare(coord, cellSize, ctx[2], shift);
    }
  },

  fillAnimation(position, Game) {
    const [x, y] = check(position, Game);
    const {
      flag,
      Player: { sColor },
      Map: { lw, cellSize, ctx: [, ctx] }
    } = Game;

    flag.fill = true;
    ctx.lineWidth = lw;
    ctx.strokeStyle = sColor;

    const initCoord = {
      divx: 0,
      divy: 0,
      x: cellSize * x,
      y: cellSize * (y + 1)
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
