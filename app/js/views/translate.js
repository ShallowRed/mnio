const Translate = window.Translate = window.Translate || {};

Translate.init = (GAME, MAP, PLAYER) => {
  GAME.flag.translate = true;
  PLAYER.update(GAME, MAP);
  MAP.render(true, PLAYER, GAME);
  PLAYER.render(true, MAP, GAME);
  Translate.start = Date.now();
  Translate.frame(GAME, MAP, PLAYER);
  Translate.duration = GAME.flag.fill ? GAME.duration * 2 : GAME.duration;
};

Translate.frame = (GAME, MAP, PLAYER) => {
  Translate.delta = (Date.now() - Translate.start) / 1000;
  if (Translate.delta >= Translate.duration) {
    MAP.draw(PLAYER, GAME);
    GAME.flag.translate = false;
  } else Translate.animationFrame = window.requestAnimationFrame(() => Translate.frame(GAME, MAP, PLAYER));
};
