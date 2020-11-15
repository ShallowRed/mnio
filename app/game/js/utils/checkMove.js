import { indextocoord, coordtoindex } from './utils';

export default (dir, position, GAME) => {
  const { rows, cols, owned, allowed, colors, positions } = GAME;

  let [x, y] = indextocoord(position, { rows, cols });

  if (dir == "up" && x !== 0) x--;
  else if (dir == "down" && x !== cols - 1) x++;
  else if (dir == "left" && y !== 0) y--;
  else if (dir == "right" && y !== rows - 1) y++;
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
