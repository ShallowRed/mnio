import { indextocoord } from '../../utils/utils'
export default class Player {

  constructor({ position, palette }) {
    this.position = position;
    this.palette = palette;
    this.sColor = palette[0];
    this.is = {};
    this.posInView = [0,0];
    this.canvas = [
      document.getElementById('playercanvas'),
      document.getElementById('shadow')
    ];
    this.canvas[0].getContext('2d')
      .imageSmoothingEnabled = false;
  }

  update(Game, position, direction) {
    if (position)
      this.position = position;
    if (direction)
      this.lastdir = direction;

    this.coord = indextocoord(this.position, Game);

    const [pX, pY] = this.coord;
    const [gX, gY] = [Game.cols, Game.rows];
    const [mX, mY] = [Game.Map.cols, Game.Map.rows];
    const [hmX, hmY] = Game.Map.half;

    this.is.left = pX < Math.ceil(hmX);
    this.is.right = pX > gX - hmX - 1 ;
    this.is.up = pY < Math.ceil(hmY);
    this.is.down = pY > gY - hmY - 1;

    this.posInView[0] = this.is.left ?
      pX :
      this.is.right ?
      pX + mX - gX :
      hmX;

    this.posInView[1] =
      this.is.up ?
      pY :
      this.is.down ?
      pY + mY - gY :
      hmY;

      // console.log("---------------------------");
      // console.log("Player :", this.is);
      // console.log("[pX, pY]   :", [pX, pY]);
      // console.log("[gX, gY]   :", [gX, gY]);
      // console.log("[mX, mY]   :", [mX, mY]);
      // console.log("[hmX, hmY] :", [hmX, hmY]);
  }

  render(Game, animated) {
    const { Map, duration } = Game;
    this.setPositioninView(Map, duration, animated);
    if (!animated)
      this.setSizeInView(Map)
  }

  setPositioninView({ cellSize, shift }, duration, animated) {
    this.canvas.forEach(canvas => {
      canvas.style.transitionDuration = `${animated ? duration : 0}s`;
      canvas.style.left = this.posInView[0] * cellSize + shift + 'px';
      canvas.style.top = this.posInView[1] * cellSize + shift + 'px';
    });
  }

  setSizeInView({ cellSize, shift }) {
    const { canvas } = this;
    canvas[0].width = canvas[0].height = cellSize - shift * 4;
    canvas[1].style.width = canvas[1].style.height =
      `${cellSize - shift * 2 - 2}px`
    canvas.forEach(c =>
      c.style.borderRadius = `${shift}px`
    );
    canvas[0].style.borderWidth = `${shift}px`;
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
