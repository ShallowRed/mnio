import Player from '../components/Player';
import Map from '../components/map/Map';
import Ui from '../components/Ui';

import listenServerEvents from './onServerEvents';
import listenKeyboardEvents from '../controls/keyboard';
import listenTouchEvents from '../controls/mobile';

import translationTimeout from '../utils/translationTimeout';
import checkMove from '../utils/checkMove';
import fillAnimation from '../components/map/fillAnimation';
import { check } from '../utils/utils';

import '../utils/polyfill';

export default class Game {

  constructor(data, socket) {
    this.duration = 0.2;
    this.socket = socket;
    Object.assign(this, data.GAME);
    this.flag = new Flag();
    this.MAP = new Map();
    this.PLAYER = new Player(data.PLAYER);
    this.UI = new Ui(this);

    this.selectColor(0);
    this.renderAll();

    this.UI.listenEvents(this);
    listenKeyboardEvents(this)
    listenTouchEvents(this);
    listenServerEvents(this);

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

  moveAttempt(direction) {
    const { socket, flag, PLAYER: { position } } = this;

    if (!flag.moveCallback || flag.translate) return;
    socket.emit('move', direction);
    flag.moveCallback = false;

    const nextpos = checkMove(direction, position, this);
    if (nextpos)
      this.newPlayerPos(nextpos, direction);
  }

  newPlayerPos(position, direction) {
    this.PLAYER.updatePosition(this, position, direction);
    this.flag.translate = true;
    this.render(true);
    translationTimeout(this);
  }

  selectColor(index) {
    const { sColor, palette } = this.PLAYER;

    if (index == "next")
      index = (palette.indexOf(sColor) + 1) % palette.length;

    else if (index == "prev")
      index = (palette.indexOf(sColor) + palette.length - 1) % palette.length;

    this.PLAYER.selectColor(index);
    this.UI.selectColor(index);
  }

  fill() {
    const { socket, flag, owned, colors, MAP } = this;
    const { position, sColor } = this.PLAYER;

    if (!flag.fillCallback || flag.fill) return;

    if (!owned.includes(position))
      owned.push(position);

    const coord = check(position, this);
    fillAnimation(coord, sColor, flag, MAP);

    const color = sColor.substring(1);
    colors[position] = color;
    socket.emit("fill", { position, color });
    flag.fillCallback = false;
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
