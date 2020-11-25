export default (Game) => {

  const { flag, Map: { master } } = Game;

  master.addEventListener('touchstart', event =>
    touchStart(event, flag),
    false
  );

  master.addEventListener('touchmove', event =>
    touchMove(event, flag, Game),
    false
  );

  master.addEventListener('touchend', event =>
    touchEnd(event, flag),
    false
  );
};

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

const touchMove = (evt, flag, Game) => {
  let { start, delta } = Touch;

  if (!start[0] || !start[1]) return;

  delta = [
    start[0] - evt.touches[0].clientX,
    start[1] - evt.touches[0].clientY
  ];

  Touch.direction = Math.abs(delta[0]) > Math.abs(delta[1]) ?
    delta[0] > 0 ? "left" : "right" : delta[1] > 0 ? "up" :
    "down";

  if (!Touch.lastdir) Touch.lastdir = Touch.direction;

  if (
    Touch.lastdir !== Touch.direction &&
    Math.abs(delta[0]) < 50 &&
    Math.abs(Touch.delta[1]) < 5
  ) Touch.direction = Touch.lastdir;

  if (
    !flag.moveCallback ||
    flag.translate ||
    (Math.abs(delta[0]) < 50 && Math.abs(delta[1]) < 50)
  ) return

  Game.moveAttempt(Touch.direction);
  start = [evt.touches[0].clientX, evt.touches[0].clientY];
  Touch.lastdir = Touch.direction;

  const keepMove = () => {
    if (
      flag.moveCallback &&
      !flag.translate &&
      flag.input && Touch.direction
    ) Game.moveAttempt(Touch.direction);
    if (!flag.input)
      clearInterval(keepMoving);
  }
  const keepMoving = setInterval(keepMove, 150);
}
