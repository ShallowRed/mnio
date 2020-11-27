import Player from './components/player/Player';
import Map from './components/map/Map';
import Ui from './components/ui/Ui';
import Cell from './components/cell/Cell';

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
    Object.assign(this, data.Game);
    this.flag = new Flag();
    this.Map = new Map(this);
    this.Player = new Player(data.Player, this);
    this.Ui = new Ui(this.Map);
    this.Cell = new Cell(this);
    console.log(this.Cell);
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

  update(isZoom) {
    this.Map.update();
    this.Player.update();
    !isZoom && this.Map.setSize();
    this.Ui.render();
  }

  render(isAnimated) {
    this.Map.translate(isAnimated);
    this.Player.render(isAnimated);
    !isAnimated && this.Map.render();
  }

  moveAttempt(direction) {
    const { socket, flag, Player: { position } } = this;

    if (!flag.moveCallback || flag.translate) return;
    socket.emit('move', direction);
    flag.moveCallback = false;

    const nextpos = checkMove(direction, position, this);
    if (nextpos)
      this.newPlayerPos(nextpos, direction);
  }

  newPlayerPos(position, direction) {
    this.Player.update(position, direction);
    this.flag.translate = true;
    this.render(true);
    translationTimeout(this);
  }

  selectColor(index) {
    const { sColor, palette } = this.Player;
    const next =
      index == "next" ? 1 :
      index == "prev" ? palette.length - 1 :
      null;

    if (next)
      index = (palette.indexOf(sColor) + next) % palette.length;

    this.Player.setColor(index);
    this.Ui.focusColorBtn(index);
  }

  fill() {
    const { socket, flag, owned, colors, Cell } = this;
    const { position, sColor } = this.Player;
    if (!flag.fillCallback || flag.fill) return;

    if (!owned.includes(position))
      owned.push(position);

    Cell.fillAnimation(position, this);
    const color = sColor.substring(1);
    colors[position] = color;
    socket.emit("fill", { position, color });
    flag.fillCallback = false;
    this.Player.stamp();
  }

  zoom(dir) {
    const { flag, Ui, Map } = this;
    if (!flag.ok()) return;

    Ui.focusZoomBtn(dir, true);
    setTimeout(() =>
      Ui.focusZoomBtn(dir, false), 200);

    if (dir == "in") {
      Map.rows -= 1;
      Map.cols -= 1;
    } else {
      Map.rows += 1;
      Map.cols += 1;
    }
    this.renderAll();
    // Map.zoom();
  }
}

class Flag {
  constructor() {
    this.fill = false;
    this.translate = false;
    this.touch = false;
    this.zoom = false;
    this.ok = () => (
      !this.translate &&
      !this.fill &&
      !this.touch &&
      !this.zoom &&
      !this.tuto
    );
    this.fillCallback = true;
    this.moveCallback = true;
    this.tuto = false;
  }
}
