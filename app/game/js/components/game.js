import PLAYER from './player';
import MAP from './map';
import UI from './ui';
import Render from '../utils/render';
import '../utils/polyfill';
import '../utils/fill';
import '../utils/translate';

const GAME = {
  duration: 0.2,
  flag: {
    fill: false,
    translate: false,
    input: false,
    zoom: false,
    ok: () => (
      !GAME.flag.translate &&
      !GAME.flag.fill &&
      !GAME.flag.input &&
      !GAME.flag.zoom &&
      !GAME.flag.tuto
    ),
    fillCallback: true,
    moveCallback: true,
    tuto: false
  }
};

GAME.init = (data, socket, admin) => {
  Object.keys(GAME.events).forEach(prop => socket.on('' + prop, data => GAME.events[prop](data)));
  Object.keys(data.GAME).forEach(prop => GAME[prop] = data.GAME[prop]);
  PLAYER.init(data);
  MAP.init();
  UI.init(GAME, PLAYER, MAP, socket);
  if (admin) {
    PLAYER.position = (150 * 75);
    MAP.maxcells = 150;
    MAP.startcells = 150;
  }
  GAME.render();
};

GAME.render = (animated) => {
  MAP.update();
  PLAYER.update(GAME, MAP);
  if (!animated) UI.update(MAP);
  MAP.render(animated, PLAYER, GAME);
  PLAYER.render(animated, MAP, GAME);
  MAP.draw(PLAYER, GAME);
};

GAME.events = {

  NewPlayerPos: position => {
    if (position == PLAYER.position) return;
    PLAYER.position = position;
    window.Translate.init(GAME, MAP, PLAYER);
  },

  NewPosition: position => {
    if (position[0]) {
      GAME.positions.splice(GAME.positions.indexOf(position[0]), 1);
      Render.clear(position[0], MAP.ctx[2], PLAYER, GAME, MAP);
    }
    if (position[1]) {
      GAME.positions.push(position[1]);
      Render.position(position[1], PLAYER, GAME, MAP);
    }
  },

  NewCell: cell => {
    GAME.colors[cell.position] = cell.color;
    Render.color(cell.position, PLAYER, GAME, MAP);
  },

  AllowedCells: cells => {
    cells.forEach(position => {
      if (GAME.allowed.includes(position)) return;
      GAME.allowed.push(position);
      Render.allowed(position, PLAYER, GAME, MAP);
    });
  },

  moveCallback: () => GAME.flag.moveCallback = true,

  fillCallback: () => GAME.flag.fillCallback = true,

  error: () => window.location.reload(true),

  reconnect_attempt: () => window.location.reload(true)

}


export default GAME
