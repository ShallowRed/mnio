import {check} from './cell'

function askformove(direction, GAME, PLAYER, socket) {
  if (!GAME.flag) return;
  PLAYER.lastdir = direction;
  socket.emit('MovePlayer', direction);
}

function drawcell(position, color, GAME, PLAYER, MAP, socket) {
  GAME.colors[position] = color;
  window.Fill.init(check(position, PLAYER, GAME, MAP), color, GAME, MAP);
  socket.emit("DrawCell", [position, color]);
}

export {askformove, drawcell}
