import { indextocoord, coordtoindex } from './converters';

export default (dir, position, Game) => {
  const { rows, cols, owned, allowed, colors, positions } = Game;

  let [x, y] = indextocoord(position, { cols, rows });

  if (dir == "left" && x !== 0) x--;
  else if (dir == "right" && x !== cols - 1) x++;
  else if (dir == "up" && y !== 0) y--;
  else if (dir == "down" && y !== rows - 1) y++;
  else return;

  let nextpos = coordtoindex([x, y], { cols });

  if (
    owned.includes(nextpos) ||
    (
      allowed.includes(nextpos) &&
      !positions.includes(nextpos) &&
      !colors[nextpos]
    )
  ) return nextpos;
};
