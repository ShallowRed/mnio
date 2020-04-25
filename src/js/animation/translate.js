const Translate = window.Translate = window.Translate || {};

Translate.init = (GAME, MAP, PLAYER) => {
  GAME.flag = false;
  GAME.update(true);
  Translate.start = Date.now();
  Translate.frame(GAME, MAP, PLAYER);
};

Translate.frame = (GAME, MAP, PLAYER) => {
  Translate.delta = (Date.now() - Translate.start) / 1000;
  if (Translate.delta >= GAME.duration) {
    MAP.render(PLAYER, GAME);
    GAME.flag = GAME.flag3 = true;
  } else Translate.animationFrame = window.requestAnimationFrame(() =>
    Translate.frame(GAME, MAP, PLAYER));
};
