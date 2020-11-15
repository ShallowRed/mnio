const Touch = {
  start: [null, null],
  direction: null,
  delta: null,
}

const touchStart = (evt, flag) => {
  Touch.start = [
    evt.touches[0].clientX,
    evt.touches[0].clientY
  ];
  flag.input = true;
}

const touchEnd = (evt, flag) => {
  flag.input = false;
  Touch.start = [null, null];
  Touch.direction = null;
  Touch.lastdir = null;
}

const touchMove = (evt, GAME, flag, socket) => {
  let { start, direction, delta, lastdir } = Touch;

  if (!start[0] || !start[1]) return;

  delta = [
    start[0] - evt.touches[0].clientX,
    start[1] - evt.touches[0].clientY
  ];

  direction = Math.abs(delta[0]) > Math.abs(delta[1]) ?
    delta[0] > 0 ? "left" : "right" : delta[1] > 0 ? "up" :
    "down";

  if (!lastdir) lastdir = direction;

  if (
    lastdir !== direction &&
    Math.abs(delta[0]) < 50 &&
    Math.abs(Touch.delta[1]) < 5
  ) direction = lastdir;

  if (
    !flag.moveCallback ||
    flag.translate ||
    (Math.abs(delta[0]) < 50 && Math.abs(delta[1]) < 50)
  ) return

  GAME.moveAttempt(direction, socket);
  start = [evt.touches[0].clientX, evt.touches[0].clientY];
  lastdir = direction;
  keepMoving(GAME, flag, socket);
}

const keepMoving = (GAME, flag, socket) =>
  setInterval(() => {
    if (
      flag.moveCallback &&
      !flag.translate &&
      flag.input
    ) GAME.moveAttempt(Touch.direction, socket);
    if (!flag.input)
      clearInterval(keepMoving);
  }, 50);

export {
  touchStart,
  touchEnd,
  touchMove
}
