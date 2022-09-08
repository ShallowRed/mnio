import Player from './components/Player';
import Map from './components/Map';
import Ui from './components/Ui';
import Cell from './components/cell/Cell';
import { Help } from './components/help';
import ScreenRatio from './utils/styleAccordingToRatio'

import listenServerEvents from './events/server';
import listenClickEvents from './events/click';
import listenKeyboardEvents from './events/keyboard';
import listenTouchEvents from './events/touchScreen';

import animationTimeout from './utils/animationTimeout';
import checkMove from './utils/checkMove';
import './utils/polyfill';

export default class Game {

  constructor(data, socket) {
    this.duration = 0.2;
    this.socket = socket;
	
    Object.assign(this, data.Game);
    this.Map = new Map(this);
    this.Player = new Player(data.Player, this);
    this.Ui = new Ui();
    this.Cell = new Cell(this);
    this.flag = {};

    this.selectColor(0);
    this.Ui.focusColorBtn(0);

    Help.init();
    this.render();

    this.listenWindowEvents();
    listenClickEvents(this);
    listenKeyboardEvents(this)
    listenTouchEvents(this);
    listenServerEvents(this);	

	console.log(this);
	
  }

  listenWindowEvents() {
    const render = () => this.render();
    window.addEventListener('resize', render);
    window.addEventListener("orientationchange", () =>
      setTimeout(render, 500)
    );
  }

  render() {
    ScreenRatio.update();
    Help.render();
    this.Ui.render();
    this.Map.setView();
    this.updateState();
    this.Map.render();
    this.Player.render();
  }

  updateState(position, direction) {
    this.Player.updatePosition(position, direction);
    if (!this.flag.isTranslating)
      this.Map.updateCanvasGrid();
    this.Player.updatePosInView();
    this.Map.updateCanvasOrigin();
  }

  moveAttempt(direction) {
    if (
      this.flag.waitingServerConfirmMove ||
      this.flag.isTranslating ||
      this.flag.isZooming
    ) return;
    this.socket.emit('MOVE', direction);
    const nextpos = checkMove(direction, this.Player.position, this);
    nextpos ?
      this.movePlayer(nextpos, direction) :
      this.Player.bump(direction);
  }

  movePlayer(position, direction) {
    this.flag.waitingServerConfirmMove = true;
    this.flag.isTranslating = true;

    this.updateState(position, direction);

    this.Map.translateCanvas({ duration: this.duration * 0.9 });
    animationTimeout(this, () => {
      this.Map.render();
      this.flag.isTranslating = false;
    });

    this.Player.render();
  }

  zoom(direction) {
    if (this.flag.isZooming || this.flag.isTranslating) return;
    const isZoomable = this.Map.incrementMainNumCells(direction);
    if (!isZoomable) return;
    this.flag.isZooming = true;

    this.updateState();

    this.Map.zoom();
    animationTimeout(this, () => {
      this.Map.render();
      this.flag.isZooming = false;
    });

    this.Player.render();
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
    if (flag.waitingServerConfirmFill || flag.fill) return;

    if (!owned.includes(position))
      owned.push(position);

    Cell.fillAnimation(position, this);
    const color = sColor.substring(1);
    colors[position] = color;
    socket.emit("FILL", { position, color });
    flag.waitingServerConfirmFill = true;
    this.Player.stamp();
  }
}
