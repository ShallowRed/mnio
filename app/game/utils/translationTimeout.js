const translationTimeout = (Game, callback, start = Date.now()) => {

  const delta = (Date.now() - start) / 1000;
  const delay = Game.duration * (Game.flag.fill ? 2.5 : 1);

  if (delta >= delay) {
    callback();
    Game.flag.translate = false;
    return;
  }

  window.requestAnimationFrame(() =>
    translationTimeout(Game, callback, start)
  );
};

export default translationTimeout;
