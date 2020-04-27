const Translate = window.Translate = window.Translate || {};

Translate.init = (GAME, MAP, PLAYER) => {
  GAME.flag = false;
  PLAYER.update(GAME, MAP);
  MAP.render(true, PLAYER, GAME);
  PLAYER.render(true, MAP, GAME);
  Translate.start = Date.now();
  Translate.frame(GAME, MAP, PLAYER);
};

Translate.frame = (GAME, MAP, PLAYER) => {
  Translate.delta = (Date.now() - Translate.start) / 1000;
  if (Translate.delta >= GAME.duration) {
    MAP.draw(PLAYER, GAME);
    GAME.flag = GAME.flag3 = true;
  } else Translate.animationFrame = window.requestAnimationFrame(() =>
    Translate.frame(GAME, MAP, PLAYER));
};