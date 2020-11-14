const Translate = window.Translate = window.Translate || {};

Translate.init = (GAME, MAP, PLAYER) => {
  GAME.flag.translate = true;
  PLAYER.update.call({GAME, MAP});
  MAP.render(true, PLAYER, GAME);
  PLAYER.render.call({MAP, GAME}, true);
  Translate.start = Date.now();
  Translate.frame(GAME, MAP, PLAYER);
};

Translate.frame = (GAME, MAP, PLAYER) => {
  Translate.delta = (Date.now() - Translate.start) / 1000;

  Translate.duration = GAME.flag.fill ? GAME.duration * 2.5 : GAME.duration;

  if (Translate.delta >= Translate.duration) {
    MAP.draw(PLAYER, GAME);
    GAME.flag.translate = false;
    return;
  }
  Translate.animationFrame = window.requestAnimationFrame(() => Translate.frame(GAME, MAP, PLAYER));
};
