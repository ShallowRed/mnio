import Player from './components/Player';
import Map from './components/Map';
import Ui from './components/Ui';
import Cell from './components/cell/Cell';

import listenServerEvents from './events/server';
import listenClickEvents from './events/click';
import listenKeyboardEvents from './events/keyboard';
import listenTouchEvents from './events/touchScreen';

import Flag from './utils/Flag';
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
    this.selectColor(0);
    this.render({ isZoom: false });

    listenClickEvents(this);
    listenKeyboardEvents(this)
    listenTouchEvents(this);
    listenServerEvents(this);

    const render = () => this.render({ isZoom: false });
    window.addEventListener('resize', render);
    window.addEventListener("orientationchange", () =>
      setTimeout(render, 500)
    );
  }

  render({ isZoom }) {
    !isZoom && (
      this.Map.setView(),
      this.Ui.render()
    );
    this.Player.updatePosition();
    this.Map.updateCanvas();
    this.Player.updatePosInView();
    this.Map.setCanvasSize();
    this.Map.setCanvasPos();
    this.Map.render();
    this.Player.setSpritePosition({ duration: 0 });
    this.Player.setSpriteSize();
  }

  moveAttempt(direction) {
    if (!this.flag.moveCallback || this.flag.translate) return;
    // console.log("-----------------------------------------"); console.log("sent moveAttempt");
    this.socket.emit('move', direction);
    const nextpos = checkMove(direction, this.Player.position, this);
    if (nextpos) {
      this.flag.moveCallback = false;
      this.newPlayerPos(nextpos, direction);
      // console.log("client nextPos :", nextpos);console.log("move allowed: ", false)
    }
  }

  newPlayerPos(position, direction) {
    const { duration } = this;
    this.flag.translate = true;
    this.Player.updatePosition(position, direction);
    this.Player.updatePosInView();
    this.Map.translateAnimation();
    this.Player.setSpritePosition({ duration });
    translationTimeout(this, () => this.Map.render());
  }

  zoom(direction) {
    if (!this.flag.ok()) return;
    this.Ui.focusZoomBtn(direction);
    const isZoomable = this.Map.incrementMainDimension(direction);
    if (isZoomable)
      this.render({ isZoom: true });
  }

  getCoords(dimension) {
    const pX = this.Player.coord[dimension];
    const gX = [this.cols, this.rows][dimension];
    const mX = this.Map.numCells[dimension];
    const hX = (mX - 1) / 2;
    return { pX, gX, mX, hX };
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
}
