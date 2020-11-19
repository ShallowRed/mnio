import Player from './components/player/Player';
import Map from './components/map/Map';
import Ui from './components/ui/Ui';
import Cell from './components/Cell';

import listenServerEvents from './events/server';
import listenClickEvents from './events/click';
import listenKeyboardEvents from './events/keyboard';
import listenTouchEvents from './events/touchScreen';

import translationTimeout from './utils/translationTimeout';
import checkMove from './utils/checkMove';
import './utils/polyfill';

export default class Game {

  constructor(data, socket) {
    this.duration = 0.2;
    this.socket = socket;
    Object.assign(this, data.GAME);
    this.flag = new Flag();
    this.MAP = new Map();
    this.PLAYER = new Player(data.PLAYER);
    this.UI = new Ui();
    this.Cell = Cell;

    this.selectColor(0);
    this.renderAll();

    listenClickEvents(this);
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
    this.MAP.setSize();
    this.PLAYER.update(this);
    this.UI.render(this.MAP);
  }

  render(animated) {
    this.MAP.translate(this, animated);
    this.PLAYER.render(this, animated);
    !animated && this.MAP.render(this);
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
    this.PLAYER.update(this, position, direction);
    this.flag.translate = true;
    this.render(true);
    translationTimeout(this);
  }

  selectColor(index) {
    const { sColor, palette } = this.PLAYER;
    
    const next =
      index == "next" ? 1 :
      index == "prev" ? palette.length - 1 :
      null;

    index = (palette.indexOf(sColor) + next) % palette.length;

    this.PLAYER.setColor(index);
    this.UI.focusColorBtn(index);
  }

  fill() {
    const { socket, flag, owned, colors, Cell } = this;
    const { position, sColor } = this.PLAYER;
    if (!flag.fillCallback || flag.fill) return;

    if (!owned.includes(position))
      owned.push(position);

    Cell.fillAnimation(position, this);
    const color = sColor.substring(1);
    colors[position] = color;
    socket.emit("fill", { position, color });
    flag.fillCallback = false;
    this.PLAYER.stamp();
  }

  zoom(dir) {
    const { flag, UI, MAP } = this;
    if (!flag.ok()) return;

    UI.focusZoomBtn(dir, true);

    setTimeout(() =>
      UI.focusZoomBtn(dir, false), 100);

    if (dir == "in") {
      MAP.rows -= 2;
      MAP.cols -= 2;
    } else {
      MAP.rows += 2;
      MAP.cols += 2;
    }

    this.renderAll();
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
