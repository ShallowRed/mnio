import { indexToCoord } from '../utils/converters'
export default class Player {

  constructor({ position, palette }, Game) {
    this.Game = () => Game;
    this.Map = () => Game.Map;
    this.position = position;
    this.palette = palette.map(color => `#${color}`);
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

    for (let i = 0; i <= 1; i++) {
      const pX = this.coord[i];
      const gX = [Game.cols, Game.rows][i];
      const mX = Game.Map.numCellsInView[i];
      const hX = (mX - 1) / 2;

      this.posInView[i] = this.getPosInView(gX, mX, hX, pX);
      this.posInViewCoef[i] = this.getPosInViewCoef(gX, hX, pX);
    }
  }

  getPosInView(gX, mX, hX, pX) {
    return pX < Math.ceil(hX) ?
      pX :
      pX > gX - hX - 1 ?
      pX + mX - gX :
      hX;
  }

  getPosInViewCoef(gX, hX, pX) {
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
    this.updateTranslateVector();
    this.sprite.forEach((sprite, i) => {
      sprite.style.transitionDuration = `${duration}s`;
      sprite.style.transform =
        `translate(${this.translateVector}) translate(-${i}px, -${i}px)`;
    });
  }

  updateTranslateVector(Map = this.Map()) {
    this.shift = Math.round(Map.cellSize / 8);
    this.translateVector = this.posInView.map((posInView, i) => {
        return `${posInView * Map.cellSize + Map.canvasOrigin[i] + this.shift}px`;
      })
      .join(', ');
  }

  setSpriteSize() {
    const { sprite } = this;
    const { cellSize } = this.Map();
    this.shift = Math.round(cellSize / 8);

    sprite[0].style.width =
      sprite[0].style.height =
      `${cellSize - this.shift * 2}px`;

    sprite[1].style.width =
      sprite[1].style.height =
      `${cellSize - this.shift * 2 + 2}px`;

    sprite.forEach(c =>
      c.style.borderRadius = `${this.shift}px`
    );

    sprite[0].style.borderWidth = `${this.shift}px`;
    sprite[1].style.borderWidth = `min(3px,${this.shift / 4}px)`;
  }

  setColor(i) {
    const { palette, sprite: [sprite] } = this;
    this.sColor = palette[i];
    sprite.style.background = this.sColor;
  }

  stamp() {
    const { sprite: [player, shadow] } = this;

    player.style.transitionDuration =
      shadow.style.transitionDuration = "0.1s";

    player.style.transform =
      shadow.style.transform =
      `translate(${this.translateVector}) scale(0.9)`;

    shadow.style.boxShadow = "0 0 0 #555";

    setTimeout(() => {

      player.style.transform =
        `translate(${this.translateVector}) scale(1)`;
      shadow.style.transform =
        `translate(${this.translateVector}) translate(-1px, -1px) scale(1)`;

      shadow.style.boxShadow = "3px 3px 5px #777";

      player.style.transitionDuration =
        shadow.style.transitionDuration =
        "0.2s";

    }, 100)
  }

  bump(direction, Game = this.Game()) {
    if (Game.flag.isBumping) return;
    Game.flag.isBumping = true;

    const { sprite: [player, shadow] } = this;

    const coef = direction == "up" ? [0, -1] :
      direction == "down" ? [0, 1] :
      direction == "left" ? [-1, 0] : [1, 0];

    const bumpTranslation = coef.map(e => `${e * this.shift * 1.5}px`)
      .join(", ");

    const bumpScale = coef.map(e => `${1 - 0.1 * Math.abs(e)}`)
      .join(", ");

    player.style.transitionDuration =
      shadow.style.transitionDuration =
      "0.07s";

    player.style.transform =
      `translate(${this.translateVector}) translate(${bumpTranslation}) scale(${bumpScale})`;

    shadow.style.transform =
      `translate(${this.translateVector}) translate(${bumpTranslation}) translate(-1px, -1px) scale(${bumpScale})`;

    setTimeout(() => {

      player.style.transform =
        `translate(${this.translateVector})`;
        
      shadow.style.transform =
        `translate(${this.translateVector}) translate(-1px, -1px)`;

      player.style.transitionDuration =
        shadow.style.transitionDuration =
        "0.2s";

      setTimeout(() => {
        Game.flag.isBumping = false;
      }, 250);

    }, 70)
  }
}
