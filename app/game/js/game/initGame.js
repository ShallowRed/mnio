import listenGameEvents from './listenGameEvents';
import Game from './Game';

import Player from '../components/Player';
import Map from '../components/Map';
import Ui from '../components/Ui';

import '../utils/polyfill';
import '../utils/fill';
import '../utils/translate';

export default (data, socket) => {
  const GAME = new Game(data.GAME, Player, Map, Ui);
  const { PLAYER, MAP, UI } = GAME;
  const context = { GAME, PLAYER, MAP };
  PLAYER.init(data.PLAYER);
  MAP.init();
  UI.init.call(context, socket);
  GAME.render();
  listenGameEvents.call(context, socket);
};
