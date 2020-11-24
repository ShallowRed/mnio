import { indextocoord } from '../../utils/utils'
export default class Player {

  constructor({ position, palette }) {
    this.position = position;
    this.palette = palette;
    this.sColor = palette[0];
    this.is = {};
    this.posInView = {};

    this.canvas = [
      document.getElementById('playercanvas'),
      document.getElementById('shadow')
    ];

    this.canvas[0].getContext('2d')
      .imageSmoothingEnabled = false;
  }

  update(Game, position, direction) {
    console.log("-----------------------------------------");
    const { rows, cols, Map } = Game;
    const { half: [halfWidth, halfHeight] } = Map;

    if (position)
      this.position = position;
    if (direction)
      this.lastdir = direction;

    this.coord = indextocoord(this.position, { rows, cols });
    const [x, y] = this.coord;

    this.is.up = y < halfHeight;
    this.is.down = y > rows - halfHeight;
    this.is.centerUp = y < rows / 2;
    this.is.centerDown = y >= rows / 2;
    this.is.left = x < halfWidth;
    this.is.right = x > cols - halfWidth;
    this.is.centerLeft = x < cols / 2;
    this.is.centerRight = x >= cols / 2;

    this.posInView.x = this.is.left ?
      x :
      this.is.right ?
      x + Map.cols - cols :
      this.is.centerLeft ?
      halfWidth - 1 :
      halfWidth;

    this.posInView.y =
      this.is.up ?
      y :
      this.is.down ?
      y + Map.rows - rows :
      this.is.centerUp ?
      halfHeight - 1 : // map rowcol even
      halfHeight; // map rowcol even
    // Math.floor(halfHeight) ; // map rowcol uneven
    // Math.floor(halfHeight) + 1; // map rowcol uneven
    console.log("Player pos  :", this.coord[1]);
    console.log("Pos in view :", this.posInView.y);
    console.log("Player is   :", this.is);
  }

  render(Game, animated) {
    const { Map: { cellSize, shift }, duration } = Game;
    const { canvas, posInView } = this;

    setPositioninView(canvas, posInView, cellSize, shift, animated, duration);
    if (!animated)
      setSizeInView(canvas, cellSize, shift)
  }

  setColor(i) {
    const { palette, canvas: [canvas] } = this;
    this.sColor = palette[i];
    canvas.style.background = this.sColor;
  }

  stamp() {
    const { canvas: [player, shadow] } = this;
    player.style.transitionDuration = 0.1;
    shadow.style.transitionDuration = 0.1;
    player.style.transform = "translate(0px, 0px)";
    shadow.style.transform = "translate(0px, 0px)";
    shadow.style.boxShadow = "0px 0px 0px 0px #777";

    setTimeout(() => {
      player.style.transform = "translate(-2px, -2px)";
      shadow.style.transform = "translate(-2px, -2px)";
      shadow.style.boxShadow = "3px 3px 5px 0px #777";
      player.style.transitionDuration = 0.2;
      shadow.style.transitionDuration = 0.2;
    }, 100)
  }
}

const setPositioninView = (canvas, posInView, cellSize, shift, animated,
  duration) => {
  canvas.forEach(canvas => {
    canvas.style.transitionDuration = `${animated ? duration : 0}s`;
    canvas.style.left = posInView.x * cellSize + shift + 'px';
    canvas.style.top = posInView.y * cellSize + shift + 'px';
  });
};

const setSizeInView = (canvas, cellSize, shift) => {
  canvas[0].width = canvas[0].height = cellSize - shift * 4;

  canvas[1].style.width = canvas[1].style.height =
    `${cellSize - shift * 2 - 2}px`

  canvas.forEach(c =>
    c.style.borderRadius = `${shift}px`
  );

  canvas[0].style.borderWidth = `${shift}px`;
};
