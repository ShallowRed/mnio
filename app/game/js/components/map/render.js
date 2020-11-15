import { check } from '../../utils/utils';
import fillAnimation from './fillAnimation';

const Render2 = {

  clear: (coord, context) => {
    const { ctx, cellSize } = context.MAP;
    fillCell(coord, cellSize, ctx[2], null);
  },

  color: (position, coord, context) => {
    const { GAME: { colors }, MAP: { ctx, cellSize } } = context;
    fillCell(coord, cellSize, ctx[1], `#${colors[position]}`);
  },

  allowed: (coord, context) => {
    const { ctx, cellSize } = context.MAP;
    fillCell(coord, cellSize, ctx[0], '#e9e9e9');
  },

  position: (coord, context) => {
    const { ctx, cellSize, shift } = context.MAP;
    roundSquare(coord, ctx[2], cellSize, shift);
  },

  fill: (position, color, context, socket) => {
    const { GAME: { flag, owned, colors }, MAP } = context;

    if (!flag.fillCallback || flag.fill) return;

    if (!owned.includes(position))
      owned.push(position);

    const coord = check(position, context);
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

const renderCell = (position, context, method) => {
  const cell = check(position, context);
  if (!cell) return;
  method(cell, context);
};

const Render = {};

for (const [key, fn] of Object.entries(Render2)) {
  Render[key] = (...args) =>
    renderCell(...args, fn);
}

console.log(Render);

const fillCell = ([x, y], cellSize, ctx, color) => {
  ctx.clearRect(cellSize * y, cellSize * x, cellSize, cellSize);
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(cellSize * y, cellSize * x, cellSize, cellSize);
};

const roundSquare = ([x, y], ctx, cellSize, shift) =>
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

export default Render
