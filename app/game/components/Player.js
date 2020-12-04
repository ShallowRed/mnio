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

    this.sprite = [
      document.getElementById('player'),
      document.getElementById('shadow')
    ];
  }

  updatePosition(position, direction) {
    if (position)
      this.position = position;
    if (direction)
      this.lastdir = direction;
    this.coord = indexToCoord(this.position, this.Game());
  }

  updatePosInView(Game = this.Game()) {
    this.posInView = this.coord.map((pX, dimension) => {
      const { gX, mX, hX } = Game.getCoords(dimension);
      return pX < Math.ceil(hX) ?
        pX :
        pX > gX - hX - 1 ?
        pX + mX - gX :
        hX;
    });

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
        `${posInView * Map.cellSize + Map.delta[i] + shift}px`
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
