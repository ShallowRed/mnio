import { indextocoord } from '../utils/utils'
export default class Player {

  constructor({ position, palette }) {
    this.position = position;
    this.palette = palette;
    this.sColor = palette[0];
    this.canvas = [
      document.getElementById('playercanvas'),
      document.getElementById('shadow')
    ];
    this.canvas[0].getContext('2d')
      .imageSmoothingEnabled = false;
  }

  updatePosition(GAME, position, direction) {
    const { rows, cols, MAP } = GAME;
    const { half: [halfWidth, halfHeight] } = MAP;

    if (position)
      this.position = position;
    if (direction)
      this.lastdir = direction;

    this.coord = indextocoord(this.position, { rows, cols });
    const [x, y] = this.coord;

    this.is = {
      up: x < halfWidth,
      down: x > cols - halfWidth,
      left: y < halfHeight,
      right: y > rows - halfHeight
    };

    this.posInView = {
      x: this.is.up ?
        x : this.is.down ?
        x + MAP.cols - cols - 2 : halfWidth - 1,
      y: this.is.left ?
        y : this.is.right ?
        y + MAP.rows - rows - 2 : halfHeight - 1
    }
  }

  render({ cellSize, shift }, { duration }, animated) {
    const { canvas, posInView } = this;
    setPositioninView(canvas, posInView, cellSize, shift, animated, duration);
    if (!animated)
      setSizeInView(canvas, cellSize, shift)
  }
}

const setPositioninView = (canvas, posInView, cellSize, shift, animated, duration) => {
  canvas.forEach(canvas => {
    canvas.style.transitionDuration = `${animated ? duration : 0}s`;
    canvas.style.top = posInView.x * cellSize + shift + 'px';
    canvas.style.left = posInView.y * cellSize + shift + 'px';
  });
};

const setSizeInView = (canvas,  cellSize,shift) => {
  canvas[0].width = canvas[0].height =
    cellSize - shift * 4;

  canvas[1].style.width = canvas[1].style.height =
    `${cellSize - shift * 2 - 2}px`

  canvas.forEach(c =>
    c.style.borderRadius = `${shift}px`
  );

  canvas[0].style.borderWidth = `${shift}px`;
};
