import { check } from '../utils/utils';

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
  }
};

const fillCell = ([x, y], cellSize, ctx, color) => {
  ctx.clearRect(cellSize * y, cellSize * x, cellSize, cellSize);
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(cellSize * y, cellSize * x, cellSize, cellSize);
};

const roundSquare = ([x, y], cellSize, ctx, shift) => {
  roundRect(ctx, {
    x: cellSize * y + shift * 1.5,
    y: cellSize * x + shift * 1.5,
    width: cellSize - shift * 3,
    height: cellSize - shift * 3,
    radius: shift
  });
};

const roundRect = (ctx, { x, y, width, height, radius }) => {
  ctx.strokeStyle = "black";
  ctx.lineWidth = radius;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.stroke();
};

Cell.fillAnimation = ([x, y], GAME) => {
  const { PLAYER: {sColor}, flag, MAP: { lw, cellSize, ctx: [, ctx] } } = GAME;

  flag.fill = true;
  ctx.lineWidth = lw;
  ctx.strokeStyle = sColor;

  const divx = 0;
  const divy = 0;
  const posx = cellSize * y;
  const posy = cellSize * (x + 1);

  fillFrame(flag, { divx, divy, posx, posy, sColor }, { ctx, lw, cellSize });
};

const fillFrame = (flag, { divx, divy, posx, posy, sColor }, {
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
  ctx.strokeStyle = sColor;
  ctx.beginPath();
  ctx.moveTo(posx, posy - divy - lw / 2);
  ctx.lineTo(posx + divx, posy - divy - lw / 2);
  ctx.stroke();

  if (divy > cellSize * 4.5 / 6 && divx == cellSize) {
    flag.fill = false;
    return;
  }

  window.requestAnimationFrame(() =>
    fillFrame(flag, { divx, divy, posx, posy, sColor }, {
      ctx,
      lw,
      cellSize
    })
  );
};

export default Cell;
