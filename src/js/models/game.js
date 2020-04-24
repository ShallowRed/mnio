import PLAYER from './player';
import MAP from './map';
import UI from './ui';
import Render from '../controlers/render';
// import Render from '../controlers/render';
import '../animation/polyfill';
import '../animation/fill';
import '../animation/translate';

const GAME = {
  duration: 0.2,
  flag: true,

  init: (data, socket) => {
    GAME.colors = data.ColorList;
    GAME.positions = data.PositionList;
    GAME.allowed = data.allowedlist;
    GAME.rows = data.uiparams[0];
    GAME.cols = data.uiparams[1];

    PLAYER.init(data);
    MAP.init();
    GAME.render();
    UI.init(GAME, PLAYER, MAP, socket);
  },

  update: (animated) => {
    PLAYER.update(animated, GAME, MAP);
    MAP.update(animated, PLAYER, GAME);
  },

  render: () => {
    MAP.setup();
    GAME.update();
    MAP.render(PLAYER, GAME);
  },

  NewPlayerPos: position => {
    console.log(position);
    PLAYER.position = position;
    window.Translate.init(GAME, MAP, PLAYER);
  },

  NewPosition: position => {
    GAME.positions.push(position[1]);
    Render.position(position[1], PLAYER, GAME, MAP);
    if (!position[0]) return;
    GAME.positions.splice(GAME.positions.indexOf(position[0]), 1);
    Render.clear(position[0], MAP.ctx3, PLAYER, GAME, MAP);
  },

  NewCell: cell => {
    GAME.colors[cell.position] = cell.color;
    Render.color(cell.position, cell.color, PLAYER, GAME, MAP);
  },

  AllowCells: cells => {
    cells.forEach(function(position) {
      if (!GAME.allowed.includes(position)) {
        GAME.allowed.push(position);
        Render.allowed(position, PLAYER, GAME, MAP);
      }
    });
  }

};

export default GAME
