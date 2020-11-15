import Player from '../components/Player';
import Map from '../components/map/Map';
import Ui from '../components/Ui';

import listenServerEvents from './onServerEvents';
import translationFrame from '../components/map/translationAnimation';
import checkMove from '../utils/checkMove';

import '../utils/polyfill';

export default class Game {

  constructor(data, socket) {
    this.flag = new Flag();
    this.duration = 0.2;
    Object.assign(this, data.GAME);
    this.MAP = new Map();
    this.PLAYER = new Player(data.PLAYER);
    this.UI = new Ui(socket, this);

    this.renderAll();
    listenServerEvents(this, socket);

    const render = () => this.renderAll();
    window.addEventListener('resize', render);
    window.addEventListener("orientationchange", () =>
      setTimeout(render, 500)
    );
  }

  renderAll() {
    this.update();
    this.render();
  }

  update() {
    this.MAP.update();
    this.PLAYER.updatePosition(this);
    this.UI.update(this.MAP);
  }

  render(animated) {
    const { PLAYER, MAP, rows, cols, duration } = this;
    const gameInfo = { rows, cols, duration };

    MAP.render(PLAYER, gameInfo, animated);
    PLAYER.render(MAP, gameInfo, animated);
    !animated && MAP.draw(this);
  }

  moveAttempt(direction, socket) {
    const { flag, PLAYER: { position } } = this;

    if (!flag.moveCallback || flag.translate) return;
    socket.emit('move', direction);
    flag.moveCallback = false;

    const nextpos = checkMove(direction, position, this);
    if (nextpos)
      this.newPosition(nextpos, direction);
  }

  newPosition(position, direction) {
    this.PLAYER.updatePosition(this, position, direction);
    this.flag.translate = true;
    this.render(true);
    translationFrame(this, Date.now());
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
