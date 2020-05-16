import {
  indextocoord,
  coordtoindex
} from '../utils';

const Move = (direction, GAME, PLAYER, MAP, socket) => {
  if (!GAME.flag.moveCallback) return;
  socket.emit('MovePlayer', direction);
  GAME.flag.moveCallback = false;
  let nextpos = checkMove(direction, GAME, PLAYER);
  if (!nextpos) return;
  PLAYER.lastdir = direction;
  PLAYER.position = nextpos;
  window.Translate.init(GAME, MAP, PLAYER);
}

const checkMove = (direction, GAME, PLAYER) => {
  let coord = indextocoord(PLAYER.position, GAME);
  if (direction == "up" && coord[0] !== 0) coord[0]--;
  else if (direction == "down" && coord[0] !== GAME.RowCol[0] - 1) coord[0]++;
  else if (direction == "left" && coord[1] !== 0) coord[1]--;
  else if (direction == "right" && coord[1] !== GAME.RowCol[1] - 1) coord[1]++;
  else return;
  let nextpos = coordtoindex(coord, GAME);
  if (GAME.owned.includes(nextpos) || (GAME.allowed.includes(nextpos) && !GAME.positions.includes(nextpos) & !GAME.colors[nextpos])) return nextpos;
}

export default Move
