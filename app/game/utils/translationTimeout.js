const translationTimeout = (Game, start = Date.now()) => {
  const { Map, flag, duration } = Game;

  const delta = (Date.now() - start) / 1000;
  const delay = duration * (flag.fill ? 2.5 : 1);

  if (delta >= delay) {
    Map.render();
    flag.translate = false;
    return;
  }

  window.requestAnimationFrame(() =>
    translationTimeout(Game, start)
  );
};

export default translationTimeout;
