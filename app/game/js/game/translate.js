export default ({ GAME, MAP, PLAYER }) => {
  GAME.flag.translate = true;
  const { rows, cols, duration } = GAME;
  const gameInfo = { rows, cols, duration };

  PLAYER.update(GAME);
  MAP.render(true, PLAYER, gameInfo);
  PLAYER.render(MAP, gameInfo, true);

  const start = Date.now();
  frame({ GAME, MAP, PLAYER }, start);
};

const frame = (context, start) => {
  const { GAME, MAP, PLAYER } = context;
  const { flag } = GAME;

  const delta = (Date.now() - start) / 1000;
  const duration = GAME.duration * (flag.fill ? 2.5 : 1);

  if (delta >= duration) {
    MAP.draw(PLAYER, GAME);
    flag.translate = false;
    return;
  }

  window.requestAnimationFrame(() =>
    frame(context, start)
  );
};
