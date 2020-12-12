import { indexToCoord } from '../utils/converters'
export default class Player {

  constructor({ position, palette }, Game) {
    this.Game = () => Game;
    this.Map = () => Game.Map;
    this.position = position;
    this.palette = palette;
    this.sColor = palette[0];
    this.is = {};
    this.posInView = [0, 0];
    this.posInViewCoef = [0, 0];
    this.lastCoord = [0, 0];

    this.sprite = [
      document.getElementById('player'),
      document.getElementById('shadow')
    ];
  }

  ////////////////////////////////////////////////////

  updatePosition(position, direction) {
    if (this.coord)
      this.lastCoord = [...this.coord];
    if (position)
      this.position = position;
    if (direction)
      this.lastdir = direction;
    this.coord = indexToCoord(this.position, this.Game());
  }

  updatePosInView(Game = this.Game()) {
    this.lastPosInView = [...this.posInView];

    [0, 1].forEach((i) => {
      const pX = this.coord[i];
      const gX = [Game.cols, Game.rows][i];
      const mX = Game.Map.numCells[i];
      const hX = (mX - 1) / 2;

      this.posInView[i] = this.getPosInView(gX, mX, hX, pX);
      this.posInViewCoef[i] = this.getPosInViewCoef(gX, mX, hX, pX);
    });
  }

  getPosInView(gX, mX, hX, pX) {
    return pX < Math.ceil(hX) ?
      pX :
      pX > gX - hX - 1 ?
      pX + mX - gX :
      hX;
  }

  getPosInViewCoef(gX, mX, hX, pX) {
    return pX <= hX ?
      0 :
      pX >= gX - hX - 1 ?
      1 :
      1 / 2;
  }

  ////////////////////////////////////////////////////

  render(Game = this.Game()) {
    const { isZooming, isTranslating } = Game.flag;
    const duration = (isTranslating || isZooming) ? Game.duration : 0;
    this.setSpritePosition({ duration });
    !isTranslating && this.setSpriteSize();
  }

  setSpritePosition({ duration }) {
    this.sprite.forEach(sprite => {
      sprite.style.transitionDuration = `${duration}s`;
      sprite.style.transform = `translate(${this.getTranslateValue()})`;
    });
  }

  getTranslateValue(Map = this.Map()) {
    const shift = Math.round(Map.cellSize / 8);
    return this.posInView.map((posInView, i) =>
        `${posInView * Map.cellSize + Map.canvasOrigin[i] + shift}px`
      )
      .join(', ');

  }

  setSpriteSize() {
    const { sprite } = this;
    const { cellSize } = this.Map();
    const shift = Math.round(cellSize / 8);

    sprite[0].style.width =
      sprite[0].style.height =
      `${cellSize - shift * 4 }px`;

    sprite[1].style.width =
      sprite[1].style.height =
      `${cellSize - shift * 2 - 2}px`;

    sprite.forEach(c =>
      c.style.borderRadius = `${shift}px`
    );

    sprite[0].style.borderWidth = `${shift}px`;
  }

  setColor(i) {
    const { palette, sprite: [sprite] } = this;
    this.sColor = palette[i];
    sprite.style.background = this.sColor;
  }

  stamp() {
    return;
    const { sprite: [player, shadow] } = this;
    player.style.transitionDuration = 0.1;
    shadow.style.transitionDuration = 0.1;
    shadow.style.boxShadow = "0px 0px 0px 0px #777";

    setTimeout(() => {
      shadow.style.boxShadow = "3px 3px 5px 0px #777";
      player.style.transitionDuration = 0.2;
      shadow.style.transitionDuration = 0.2;
    }, 100)
  }
}
