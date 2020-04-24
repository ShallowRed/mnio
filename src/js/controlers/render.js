import {check, roundRect} from '../utils';

const Render = {

  clear: (position, ctx, PLAYER, GAME, MAP) => {
    let cell = check(position, PLAYER, GAME, MAP);
    if (cell) ctx.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  },

  color: function(position, color, PLAYER, GAME, MAP) {
    let cell = check(position, PLAYER, GAME, MAP);
    if (!cell) return;
    MAP.ctx2.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
    MAP.ctx2.fillStyle = color;
    MAP.ctx2.fillRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  },

  allowed: function(position, PLAYER, GAME, MAP) {
    let cell = check(position, PLAYER, GAME, MAP);
    if (!cell) return;
    MAP.ctx1.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
    MAP.ctx1.fillStyle = '#e9e9e9';
    MAP.ctx1.fillRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  },

  position: function(position, PLAYER, GAME, MAP) {
    let cell = check(position, PLAYER, GAME, MAP);
    if (cell) roundRect(MAP.ctx3, MAP.CellSize * cell[1] + MAP.shift * 1.5, MAP.CellSize * cell[0] + MAP.shift * 1.5, MAP.CellSize - MAP.shift * 3, MAP.CellSize - MAP.shift * 3, MAP.shift, MAP);
  },

  fill: function(position, color, GAME, PLAYER, MAP, socket) {
    GAME.colors[position] = color;
    window.Fill.init(check(position, PLAYER, GAME, MAP), color, GAME, MAP);
    socket.emit("DrawCell", [position, color]);
  }
};

export default Render
