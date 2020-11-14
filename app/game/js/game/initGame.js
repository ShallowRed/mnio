import listenServerEvents from './listenServerEvents';
import Game from './Game';

import Player from '../components/Player';
import Map from '../components/map/Map';
import Ui from '../components/Ui';

import '../utils/polyfill';

export default (data, socket) => {
  const PLAYER = new Player(data.PLAYER);
  const MAP = new Map();
  const UI = new Ui()

  const GAME = new Game(data.GAME, PLAYER, MAP, UI);
  const context = { GAME, PLAYER, MAP };

  UI.initListeners(socket, context);

  GAME.render(context, UI);

  window.addEventListener('resize', () =>
    GAME.render(context, UI)
  );

  window.addEventListener("orientationchange", () =>
    setTimeout(() =>
      GAME.render(context, UI), 500)
  );


  listenServerEvents.call(context, socket);
};
