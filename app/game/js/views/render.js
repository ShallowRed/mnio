import {
  check
} from '../utils';

const Render = {

  clear: (position, ctx, PLAYER, GAME, MAP) => {
    let cell = check(position, PLAYER, GAME, MAP);
    if (cell) ctx.clearRect(MAP.cellSize * cell[1], MAP.cellSize * cell[0], MAP.cellSize, MAP.cellSize);
  },

  color: (position, PLAYER, GAME, MAP) => {
    let cell = check(position, PLAYER, GAME, MAP);
    if (!cell) return;
    MAP.ctx[1].clearRect(MAP.cellSize * cell[1], MAP.cellSize * cell[0], MAP.cellSize, MAP.cellSize);
    MAP.ctx[1].fillStyle = GAME.colors[position];
    MAP.ctx[1].fillRect(MAP.cellSize * cell[1], MAP.cellSize * cell[0], MAP.cellSize, MAP.cellSize);
  },

  allowed: (position, PLAYER, GAME, MAP) => {
    let cell = check(position, PLAYER, GAME, MAP);
    if (!cell) return;
    MAP.ctx[0].clearRect(MAP.cellSize * cell[1], MAP.cellSize * cell[0], MAP.cellSize, MAP.cellSize);
    MAP.ctx[0].fillStyle = '#e9e9e9';
    MAP.ctx[0].fillRect(MAP.cellSize * cell[1], MAP.cellSize * cell[0], MAP.cellSize, MAP.cellSize);
  },

  position: (position, PLAYER, GAME, MAP) => {
    let cell = check(position, PLAYER, GAME, MAP);
    if (cell) roundRect(MAP.ctx[2], MAP.cellSize * cell[1] + MAP.shift * 1.5, MAP.cellSize * cell[0] + MAP.shift * 1.5, MAP.cellSize - MAP.shift * 3, MAP.cellSize - MAP.shift * 3, MAP.shift, MAP);
  },

  fill: (position, color, GAME, PLAYER, MAP, socket) => {
    if (!GAME.flag.fillCallback) return;
    if (GAME.flag.fill) return;
    if (!GAME.owned.includes(position)) GAME.owned.push(position);
    GAME.colors[position] = color;
    window.Fill.init(check(position, PLAYER, GAME, MAP), color, GAME, MAP);
    socket.emit("DrawCell", [position, color]);
    GAME.flag.fillCallback = false;
  }
};

function roundRect(ctx, x, y, width, height, radius, MAP) {
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
