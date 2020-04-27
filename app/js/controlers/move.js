import {
  indextocoord,
  coordtoindex
} from '../utils';

function Move(direction, GAME, PLAYER, MAP, socket) {

  socket.emit('MovePlayer', direction);

  GAME.flag = GAME.flag2 = GAME.flag3 = false;

  let coord = indextocoord(PLAYER.position, GAME);
  if (direction == "up" && coord[0] !== 0) coord[0]--;
  else if (direction == "down" && coord[0] !== GAME.rc[0] - 1) coord[0]++;
  else if (direction == "left" && coord[1] !== 0) coord[1]--;
  else if (direction == "right" && coord[1] !== GAME.rc[1] - 1) coord[1]++;
  else {
    GAME.flag = GAME.flag2 = true;
    return;
  }

  let nextpos = coordtoindex(coord, GAME);

  if (!GAME.owned.includes(nextpos) && (!GAME.allowed.includes(nextpos) || GAME.positions.includes(nextpos) || GAME.colors[nextpos])) {
    GAME.flag = GAME.flag2 = true;
    return;
  }

  PLAYER.lastdir = direction;
  PLAYER.position = nextpos;
  window.Translate.init(GAME, MAP, PLAYER);

}

export default Move
