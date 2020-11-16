const translationTimeout = (GAME, start = Date.now()) => {
  const { MAP, flag, duration } = GAME;

  const delta = (Date.now() - start) / 1000;
  const delay = duration * (flag.fill ? 2.5 : 1);

  if (delta >= delay) {
    MAP.draw(GAME);
    flag.translate = false;
    return;
  }

  window.requestAnimationFrame(() =>
    translationTimeout(GAME, start)
  );
};

export default translationTimeout;
