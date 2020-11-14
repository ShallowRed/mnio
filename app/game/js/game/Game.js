export default class Game {

  constructor(data, PLAYER, MAP, UI) {

    this.flag = new Flag();
    this.duration = 0.2,

    Object.assign(this, data);

    this.MAP = MAP;
    this.PLAYER = PLAYER;
    this.UI = UI;
    console.log(this);
  }

  render(context, UI, animated) {
    const { PLAYER, MAP } = context;
    const { rows, cols, duration } = this;
    const gameInfo = { rows, cols, duration };

    MAP.update();
    PLAYER.update(this);
    if (!animated)
      UI.update(MAP);

    MAP.render(animated, PLAYER, gameInfo);
    PLAYER.render(MAP, gameInfo, animated);
    MAP.draw(PLAYER, this);
  }
}

class Flag {
  constructor() {
    this.fill = false;
    this.translate = false;
    this.input = false;
    this.zoom = false;
    this.ok = () => (
      !this.translate &&
      !this.fill &&
      !this.input &&
      !this.zoom &&
      !this.tuto
    );
    this.fillCallback = true;
    this.moveCallback = true;
    this.tuto = false;
  }
}
