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

  update(GAME) {
    const { rows, cols, MAP: { half } } = GAME;
    this.coord = indextocoord(this.position, { rows, cols });
    this.is = {
      up: this.coord[0] < half[0],
      down: this.coord[0] > cols - half[0],
      left: this.coord[1] < half[1],
      right: this.coord[1] > rows - half[1]
    }
  }

  render(MAP, { rows, cols, duration }, animated) {
    const { coord, canvas } = this;
    const { half, cellSize, shift } = MAP;

    canvas.forEach(canvas => {
      canvas.style.transitionDuration = animated ?
        `${duration}s` : '0s';

      canvas.style.top = (
        this.is.up ? coord[0] :
        this.is.down ? coord[0] + MAP.cols - cols - 2 :
        half[0] - 1
      ) * cellSize + shift + 'px';

      canvas.style.left = (
        this.is.left ? coord[1] :
        this.is.right ? coord[1] + MAP.rows - rows - 2 :
        half[1] - 1
      ) * cellSize + shift + 'px';
    });

    if (animated) return;

    canvas[0].width = canvas[0].height = cellSize - shift * 4;
    canvas[1].style.width = canvas[1].style.height = cellSize - shift * 2 -
      2 + 'px';

    canvas.forEach(canvas =>
      canvas.style.borderRadius = shift + 'px'
    );

    canvas[0].style.borderWidth = shift + 'px';
  }
}
