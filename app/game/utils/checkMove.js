import { indexToCoord, coordToIndex } from './converters';

export default (dir, position, Game) => {
  const { rows, cols } = Game;

  let [x, y] = indexToCoord(position, { cols, rows });

  if (dir == "left" && x !== 0) x--;
  else if (dir == "right" && x !== cols - 1) x++;
  else if (dir == "up" && y !== 0) y--;
  else if (dir == "down" && y !== rows - 1) y++;
  else return;

  const nextpos = coordToIndex([x, y], { cols });
  if (isAvailable(nextpos, Game)) return nextpos;
};

const isAvailable = (nextpos, { owned, allowed, colors, positions }) => {
  return (
    owned.includes(nextpos) ||
    (
      allowed.includes(nextpos) &&
      !positions.includes(nextpos) &&
      !colors[nextpos]
    )
  );
}
