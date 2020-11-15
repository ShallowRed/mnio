import { check } from '../../utils/utils';
import fillAnimation from './fillAnimation';

const RenderCell = {

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
  },

  fill: (position, color, GAME, socket) => {
    const { flag, owned, colors, MAP } = GAME;

    if (!flag.fillCallback || flag.fill) return;

    if (!owned.includes(position))
      owned.push(position);

    const coord = check(position, GAME);
    fillAnimation(coord, color, flag, MAP);

    color = color.split('#')[1];

    colors[position] = color;

    socket.emit("fill", {
      position: position,
      color: color
    });

    flag.fillCallback = false;
  }
};

// const renderCell = (position, context, method) => {
//   const cell = check(position, context);
//   if (!cell) return;
//   method(cell, context);
// };

// const RenderCell = {};
//
// for (const [key, fn] of Object.entries(RenderCell2)) {
//   RenderCell[key] = (...args) =>
//     renderCell(...args, fn);
// }


const fillCell = ([x, y], cellSize, ctx, color) => {
  ctx.clearRect(cellSize * y, cellSize * x, cellSize, cellSize);
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(cellSize * y, cellSize * x, cellSize, cellSize);
};

const roundSquare = ([x, y], cellSize, ctx, shift) =>
  roundRect(ctx, {
    x: cellSize * y + shift * 1.5,
    y: cellSize * x + shift * 1.5,
    width: cellSize - shift * 3,
    height: cellSize - shift * 3,
    radius: shift
  });

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
}

export default RenderCell
