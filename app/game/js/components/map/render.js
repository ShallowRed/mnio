import { check } from '../../utils/utils';
import fillCell from './fill';

const Render = {

  clear: (position, context) => {
    const { ctx, cellSize } = context.MAP;
    const cell = check(position, context);
    if (cell)
      ctx[2].clearRect(cellSize * cell[1], cellSize * cell[0], cellSize,
        cellSize);
  },

  color: (position, context) => {
    const { GAME: { colors }, MAP: { ctx, cellSize } } = context;

    const cell = check(position, context);
    if (!cell) return;

    ctx[1].clearRect(cellSize * cell[1], cellSize * cell[0], cellSize,
      cellSize);
    ctx[1].fillStyle = `#${colors[position]}`;
    ctx[1].fillRect(cellSize * cell[1], cellSize * cell[0], cellSize,
      cellSize);
  },

  allowed: (position, context) => {

    const cell = check(position, context);
    if (!cell) return;
    const { ctx, cellSize } = context.MAP;
    const [x, y] = cell;
    ctx[0].clearRect(cellSize * y, cellSize * x, cellSize, cellSize);
    ctx[0].fillStyle = '#e9e9e9';
    ctx[0].fillRect(cellSize * y, cellSize * x, cellSize, cellSize);
  },

  position: (position, context) => {
    const { ctx, cellSize, shift } = context.MAP;
    const cell = check(position, context);

    if (cell)
      roundRect(ctx[2], cellSize * cell[1] + shift * 1.5, cellSize * cell[
          0] + shift * 1.5, cellSize - shift * 3,
        cellSize - shift * 3, shift);
  },

  fill: (position, color, context, socket) => {
    const { GAME: { flag, owned, colors }, MAP } = context;

    console.log(color);

    if (!flag.fillCallback || flag.fill) return;

    if (!owned.includes(position))
      owned.push(position);

    const drawData = {
      lw: MAP.lw,
      cellSize: MAP.cellSize,
      ctx: MAP.ctx[1]
    };

    fillCell(check(position, context), color, flag,
      drawData);

    color = color.split('#')[1];

    colors[position] = color;

    socket.emit("fill", {
      position: position,
      color: color
    });

    flag.fillCallback = false;
  }
};

const roundRect = (ctx, x, y, width, height, radius, MAP) => {
  ctx.strokeStyle = "black";
  ctx.lineWidth = MAP.shift;
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
