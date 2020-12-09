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

    this.listenWindowEvents();
    listenClickEvents(this);
    listenKeyboardEvents(this)
    listenTouchEvents(this);
    listenServerEvents(this);
  }

  ////////////////////////////////////////////////////

  listenWindowEvents() {
    const render = () => this.render();
    window.addEventListener('resize', render);
    window.addEventListener("orientationchange", () =>
      setTimeout(render, 500)
    );
  }

  moveAttempt(direction) {
    if (!this.flag.moveCallback || this.flag.translate) return;
    this.socket.emit('move', direction);
    const nextpos = checkMove(direction, this.Player.position, this);
    if (nextpos) {
      this.flag.moveCallback = false;
      this.flag.translate = true;
      this.movePlayer(nextpos, direction);
    }
  }


  render() {
    this.Map.setView();
    this.Ui.render();

    this.Player.updatePosition();
    this.Map.updateCanvas();
    this.Player.updatePosInView();
    this.Map.updateCanvasOrigin();

    this.Map.setCanvasSize();
    this.Map.setCanvasPos();
    this.Map.render();
    this.Player.setSpritePosition({ duration: 0 });
    this.Player.setSpriteSize();
  }

  ////////////////////////////////////////////////////

  movePlayer(position, direction) {
    const { duration } = this;

    this.Player.updatePosition(position, direction);
    this.Player.updatePosInView();
    this.Map.updateCanvasOrigin();

    this.Map.updateTranslateCoef();

    this.Map.translateCanvas({ duration });
    this.Player.setSpritePosition({ duration });
    translationTimeout(this, () => this.Map.render());
  }

  zoom(direction) {
    if (!this.flag.ok()) return;
    if (this.flag.isZooming) return;
    this.Ui.focusZoomBtn(direction);

    const isZoomable = this.Map.incrementMainDimension(direction);
    if (!isZoomable) return;
    this.flag.isZooming = true;

    this.Player.updatePosition();
    this.Map.updateCanvas();
    this.Player.updatePosInView();
    this.Map.updateCanvasOrigin();

    this.Map.updateScaleVector(direction);

    this.Map.zoom();
    this.Player.setSpritePosition({ duration: 0.2 });
    this.Player.setSpriteSize();

    setTimeout(() => {
      this.Map.setCanvasSize();
      this.Map.setCanvasPos();
      this.Map.render();
      setTimeout(() => {
        this.flag.isZooming = false;
      }, 20);
    }, 200);
  }

  ////////////////////////////////////////////////////

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
