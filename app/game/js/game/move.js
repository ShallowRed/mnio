import { indextocoord, coordtoindex } from '../utils/utils';
import Translate from './translate';

const move = (direction, context, socket) => {
  const { GAME, PLAYER } = context;
  const { flag } = GAME;

  if (!flag.moveCallback) return;
  socket.emit('move', direction);
  flag.moveCallback = false;

  const nextpos = checkMove(direction, GAME, PLAYER.position);
  if (!nextpos) return;
  PLAYER.lastdir = direction;
  PLAYER.position = nextpos;

  Translate(context);
}

const checkMove = (dir, GAME, position) => {
  const { rows, cols, owned, allowed, colors, positions } = GAME;

  let [x, y] = indextocoord(position, {rows, cols});

  if (dir == "up" && x !== 0)
    x--;
  else if (dir == "down" && x !== cols - 1)
    x++;
  else if (dir == "left" && y !== 0)
    y--;
  else if (dir == "right" && y !== rows - 1)
    y++;
  else return;

  let nextpos = coordtoindex([x, y], { rows });

  if (
    owned.includes(nextpos) ||
    (
      allowed.includes(nextpos) &&
      !positions.includes(nextpos) &&
      !colors[nextpos]
    )
  ) return nextpos;
};

export default move;
