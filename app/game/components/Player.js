import { indextocoord } from '../utils/converters'
export default class Player {

  constructor({ position, palette }, Game) {
    this.Game = () => Game;
    this.Map = () => Game.Map;
    this.position = position;
    this.palette = palette;
    this.sColor = palette[0];
    this.is = {};
    this.posInView = [0, 0];

    this.sprite = [
      document.getElementById('player'),
      document.getElementById('shadow')
    ];

    this.Directions = [
      ["left", "right"],
      ["up", "down"]
    ];
  }

  update(position, direction) {
    this.updatePosition(position, direction);
    this.updatePlayerZone();
    this.updatePosInView();
  }

  updatePosition(position, direction) {
    if (position)
      this.position = position;
    if (direction)
      this.lastdir = direction;
    this.coord = indextocoord(this.position, this.Game());
  }

  updatePlayerZone() {
    this.Directions.forEach((dimension, i) =>
      dimension.forEach((directionName, j) =>
        this.is[directionName] = this.isPlayerInZone(i, j)
      ));
  }

  isPlayerInZone(dimension, sense) {
    const { pX, gX, hX } = this.getCoords(dimension);
    return sense == 0 ?
      pX < Math.ceil(hX) :
      pX > gX - hX - 1;
  }

  updatePosInView() {
    this.posInView = this.Directions.map((dimension, i) =>
      this.getPosInView(dimension, i)
    );
  }

  getPosInView([negativeDir, positiveDir], dimension) {
    const { pX, gX, mX, hX } = this.getCoords(dimension);
    // console.log({ pX, gX, mX, hX });
    return this.is[negativeDir] ?
      pX :
      !this.is[positiveDir] ?
      hX :
      pX + mX - gX;
  }

  getCoords(dimension, Game = this.Game(), Map = this.Map()) {
    const pX = this.coord[dimension];
    const gX = [Game.cols, Game.rows][dimension];
    const mX = Map.numCells[dimension];
    const hX = (mX - 1) / 2;
    return { pX, gX, mX, hX };
  }

  render(isAnimated) {
    this.setSpritePosition(isAnimated);
    if (!isAnimated)
      this.setSpriteSize();
  }

  setSpritePosition(isAnimated) {
    const { cellSize, delta } = this.Map();
    const { duration } = this.Game();
    const shift = Math.round(cellSize / 8);
    this.sprite.forEach(sprite => {
      sprite.style.transitionDuration = `${isAnimated ? duration : 0}s`;
      sprite.style.left = `${this.posInView[0] * cellSize + shift + (delta[0] || 0)}px`;
      sprite.style.top = `${this.posInView[1] * cellSize + shift + (delta[1] || 0)}px`;
    });

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
    const { sprite: [player, shadow] } = this;
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
