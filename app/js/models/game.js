import PLAYER from './player';
import MAP from './map';
import UI from './ui';
import Render from '../views/render';
import '../views/polyfill';
import '../views/fill';
import '../views/translate';

const GAME = {
  duration: 0.2,
  flag: {
    fill: false,
    translate: false,
    server: false,
    input: false,
    ok: () => (!GAME.flag.translate && !GAME.flag.fill && !GAME.flag.server && !GAME.flag.input),
    fillCallback: true,
    moveCallback: true,
    connection: true,
  }
};


GAME.init = (data, socket) => {
  Object.keys(data.GAME).forEach(prop => GAME[prop] = data.GAME[prop]);
  PLAYER.init(data);
  MAP.init();
  UI.init(GAME, PLAYER, MAP, socket);
  GAME.render();
}

GAME.render = (animated) => {
  MAP.update();
  PLAYER.update(GAME, MAP);
  if (!animated) UI.update(MAP);
  MAP.render(animated, PLAYER, GAME);
  PLAYER.render(animated, MAP, GAME);
  MAP.draw(PLAYER, GAME);
}

GAME.NewPlayerPos = position => {
  GAME.flag.server = false;
  if (position == PLAYER.position) return;
  PLAYER.position = position;
  window.Translate.init(GAME, MAP, PLAYER);
};

GAME.NewPosition = position => {
  if (position[0]) {
    GAME.positions.splice(GAME.positions.indexOf(position[0]), 1);
    Render.clear(position[0], MAP.ctx[2], PLAYER, GAME, MAP);
  }
  if (position[1]) {
    GAME.positions.push(position[1]);
    Render.position(position[1], PLAYER, GAME, MAP);
  }
};

GAME.NewCell = cell => {
  GAME.colors[cell.position] = cell.color;
  Render.color(cell.position, PLAYER, GAME, MAP);
};

GAME.AllowCells = cells => {
  cells.forEach(position => {
    if (GAME.allowed.includes(position)) return;
    GAME.allowed.push(position);
    Render.allowed(position, PLAYER, GAME, MAP);
  });
}

export default GAME
