import { fillCell, roundSquare } from './drawCanvas';
import { check } from './checkPosInView';
import { fillAnimation } from './fillAnimation';

export default class Cell {
  constructor(Game) {
    this.render = {};

    for (const [key, fn] of renderCell) {
      this.render[key] = (position) => {
        fn(position, Game);
      }
    }

    this.fillAnimation = (position) =>
      fillAnimation(position, Game);
  }
}

const renderCell = Object.entries({

  clear: (position, Game) => {
    const coord = check(position, Game);
    if (!coord) return;
    const { ctx, cellSize } = Game.Map;
    fillCell(coord, cellSize, ctx[2], null);
  },

  color: (position, Game) => {
    const coord = check(position, Game);
    if (!coord) return;
    const { colors, Map: { ctx, cellSize } } = Game;
    fillCell(coord, cellSize, ctx[1], `#${colors[position]}`);
  },

  allowed: (position, Game) => {
    const coord = check(position, Game);
    if (!coord) return;
    const { ctx, cellSize } = Game.Map;
    fillCell(coord, cellSize, ctx[0], '#e9e9e9');
  },

  position: (position, Game) => {
    const coord = check(position, Game);
    if (!coord) return;
    const { ctx, cellSize } = Game.Map;
    const shift = Math.round(cellSize / 8);
    roundSquare(coord, cellSize, ctx[2], shift);
  }
});
