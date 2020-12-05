const translationTimeout = (Game, callback, start = Date.now(), delay = Game.duration*1.1) => {

  const delta = (Date.now() - start) / 1000;

  if (Game.flag.fill)
    delay += 0.015;

  if (delta >= delay) {
    callback();
    Game.flag.translate = false;
    return;
  }

  window.requestAnimationFrame(() =>
    translationTimeout(Game, callback, start, delay)
  );
};

export default translationTimeout;
