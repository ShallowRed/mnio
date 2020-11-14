import { indextocoord, coordtoindex } from '../utils/utils';
import Translate from './translate';

const move = (direction, context, socket) => {
  const { GAME, PLAYER, MAP } = context;
  const { flag } = GAME;
  if (!flag.moveCallback) return;
  socket.emit('move', direction);
  flag.moveCallback = false;
  const nextpos = checkMove(direction, GAME, PLAYER);
  if (!nextpos) return;
  PLAYER.lastdir = direction;
  PLAYER.position = nextpos;
  Translate(context);
}

const checkMove = (direction, GAME, PLAYER) => {
  let coord = indextocoord(PLAYER.position, GAME);

  if (direction == "up" && coord[0] !== 0) coord[0]--;
  else if (direction == "down" && coord[0] !== GAME.cols - 1) coord[0]++;
  else if (direction == "left" && coord[1] !== 0) coord[1]--;
  else if (direction == "right" && coord[1] !== GAME.rows - 1) coord[1]++;
  else return;

  let nextpos = coordtoindex(coord, GAME);

  if (
    GAME.owned.includes(nextpos) ||
    (
      GAME.allowed.includes(nextpos) &&
      !GAME.positions.includes(nextpos) &&
      !GAME.colors[nextpos]
    )
  ) return nextpos;
}

export default move;
