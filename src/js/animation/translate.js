const Translate = window.Translate = window.Translate || {};

Translate.init = function(GAME, MAP, PLAYER) {
  GAME.flag = false;
  GAME.update(true);
  this.start = Date.now();
  this.frame(GAME, MAP, PLAYER);
};

Translate.frame = function(GAME, MAP, PLAYER) {
  Translate.delta = (Date.now() - Translate.start) / 1000;
  if (Translate.delta >= GAME.duration) {
    MAP.render(PLAYER, GAME);
    GAME.flag = true;
  } else Translate.animationFrame = window.requestAnimationFrame(function() {
    Translate.frame(GAME, MAP, PLAYER);
  });
};
