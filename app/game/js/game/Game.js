export default class Game {

  constructor(data, PLAYER, MAP, UI) {
    this.STATE = {
      duration: 0.2,
      flag: {
        fill: false,
        translate: false,
        input: false,
        zoom: false,
        ok: () => (
          !this.flag.translate &&
          !this.flag.fill &&
          !this.flag.input &&
          !this.flag.zoom &&
          !this.flag.tuto
        ),
        fillCallback: true,
        moveCallback: true,
        tuto: false
      }
    };
    Object.assign(this, data);
    this.MAP = MAP;
    this.PLAYER = PLAYER;
    this.UI = UI;
    console.log(this);
  }

  render(animated) {
    const { GAME, PLAYER, MAP, UI } = this;
    MAP.update();
    PLAYER.update.call({ GAME, MAP });
    if (!animated) UI.update(MAP);
    MAP.render(animated, PLAYER, GAME);
    PLAYER.render.call({ MAP, GAME }, animated);
    MAP.draw(PLAYER, GAME);
  }

}

// import PLAYER from './player';
// import MAP from './map';
// import UI from './ui';
// import '../utils/polyfill';
// import '../utils/fill';
// import '../utils/translate';
//
// const GAME = {
//   duration: 0.2,
//   flag: {
//     fill: false,
//     translate: false,
//     input: false,
//     zoom: false,
//     ok: () => (
//       !GAME.flag.translate &&
//       !GAME.flag.fill &&
//       !GAME.flag.input &&
//       !GAME.flag.zoom &&
//       !GAME.flag.tuto
//     ),
//     fillCallback: true,
//     moveCallback: true,
//     tuto: false
//   }
// };
//
// import listenGameEvents from './events';
//
// GAME.init = (data, socket) => {
//   const context = { GAME, PLAYER, MAP };
//
//   Object.assign(GAME, data.GAME)
//
//   PLAYER.init(data.PLAYER);
//   MAP.init();
//   UI.init.call(context, socket);
//
//   GAME.render();
//
//   listenGameEvents.call(context, socket);
// };
//
// class Game {
//
//   constructor(data, PLAYER, MAP, UI) {
//     Object.assign(this, data)
//     this.duration = 0.2;
//     this.flag = {
//       fill: false,
//       translate: false,
//       input: false,
//       zoom: false,
//       ok: () => (
//         !GAME.flag.translate &&
//         !GAME.flag.fill &&
//         !GAME.flag.input &&
//         !GAME.flag.zoom &&
//         !GAME.flag.tuto
//       ),
//       fillCallback: true,
//       moveCallback: true,
//       tuto: false
//     };
//     this.MAP = MAP;
//     this.PLAYER = PLAYER;
//     this.UI = UI;
//     this.render();
//   }
//
//   render(animated) {
//     const { GAME, PLAYER, MAP } = this;
//     MAP.update();
//     PLAYER.update.call({GAME, MAP});
//     if (!animated) UI.update(MAP);
//     MAP.render(animated, PLAYER, GAME);
//     PLAYER.render.call({MAP, GAME}, animated);
//     MAP.draw(PLAYER, GAME);
//   }
//
// }
//
//
// export default GAME
