import {indextocoord, coordtoindex} from '../utils';

function Move(direction, GAME, PLAYER, MAP, socket) {

  let coord = indextocoord(PLAYER.position, GAME);
  if (direction == "up" && coord[0] !== 0) coord[0]--;
  else if (direction == "down" && coord[0] !== GAME.cols - 1) coord[0]++;
  else if (direction == "left" && coord[1] !== 0) coord[1]--;
  else if (direction == "right" && coord[1] !== GAME.rows - 1) coord[1]++;
  else return;

  let nextpos = coordtoindex(coord, GAME);

  if (!GAME.allowed.includes(nextpos) || GAME.positions.includes(nextpos)
  // ||
  // GAME.colors[nextpos]
) return;
    // player.owncells.includes(nextpos) ||

    PLAYER.lastdir = direction;
  PLAYER.position = nextpos;
  window.Translate.init(GAME, MAP, PLAYER);

  socket.emit('MovePlayer', direction);
}

// function Move(direction, GAME, PLAYER, MAP, socket) {
//   PLAYER.lastdir = direction;
//   socket.emit('MovePlayer', direction);
// }

export default Move
