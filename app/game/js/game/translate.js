export default (context) => {
  const { GAME, MAP, PLAYER } = context;
  const { rows, cols, duration, flag } = GAME;
  const gameInfo = { rows, cols, duration };

  flag.translate = true;
  PLAYER.update(GAME);
  MAP.render(true, PLAYER, gameInfo);
  PLAYER.render(MAP, gameInfo, true);

  translationFrame(context, Date.now());
};

const translationFrame = (context, start) => {
  const { GAME, MAP, PLAYER } = context;
  const { flag, duration } = GAME;

  const delta = (Date.now() - start) / 1000;
  const delay = duration * (flag.fill ? 2.5 : 1);

  if (delta >= delay) {
    MAP.draw(PLAYER, GAME);
    flag.translate = false;
    return;
  }

  window.requestAnimationFrame(() =>
    translationFrame(context, start)
  );
};
