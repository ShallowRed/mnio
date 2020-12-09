export default (Game) => {

  const { flag, Map: { view } } = Game;

  view.addEventListener('touchstart', event =>
    touchStart(event, flag),
    false
  );

  view.addEventListener('touchmove', event =>
    touchMove(event, flag, Game),
    false
  );

  view.addEventListener('touchend', event =>
    touchEnd(event, flag),
    false
  );
};

const Touch = {
  start: [null, null],
  delta: [null, null],
  direction: null,
  lastdir: null,
  limit: 80,

  setOrigin(evt) {
    this.start[0] = evt.touches[0].clientX;
    this.start[1] = evt.touches[0].clientY
  },

  setLimit(amount = 50) {
    this.limit = amount;
  },

  getDelta(evt) {
    this.delta[0] = this.start[0] - evt.touches[0].clientX;
    this.delta[1] = this.start[1] - evt.touches[0].clientY;
  },

  getDirection() {
    const [deltaX, deltaY] = this.delta;
    if (Math.abs(deltaX) > Math.abs(deltaY))
      this.direction = deltaX > 0 ? "left" : "right"
    else
      this.direction = deltaY > 0 ? "up" : "down";
  },

  saveDirection() {
    this.lastdir = this.direction;
  },

  useLastDir() {
    this.direction = this.lastdir;
  },

  isSameDirection() {
    return this.lastdir === this.direction;
  },

  isTooSmall() {
    return Math.abs(Touch.delta[0]) < Touch.limit &&
      Math.abs(Touch.delta[1]) < Touch.limit;
  }
};

const touchStart = (evt, flag) => {
  flag.isTouching = true;
  Touch.setOrigin(evt);
}

const touchEnd = (evt, flag) => {
  flag.isTouching = false;
  Touch.setLimit();
  Touch.start = [null, null];
  Touch.direction = null;
  Touch.lastdir = null;
}

const touchMove = (evt, flag, Game) => {
  let { start, lastdir, } = Touch;
  if (!start[0] || !start[1]) return;

  Touch.getDelta(evt);
  Touch.getDirection();
  if (!lastdir) Touch.saveDirection();

  if (
    flag.waitingServerConfirmMove || flag.isTranslating ||
    Touch.isTooSmall()
  ) return;

  Game.moveAttempt(Touch.direction);
  Touch.setOrigin(evt);
  Touch.setLimit(120);
  Touch.saveDirection();

  const keepMoving = setInterval(() => {
    if (
      !flag.waitingServerConfirmMove &&
      !flag.isTranslating &&
      flag.isTouching && Touch.direction
    ) Game.moveAttempt(Touch.direction);
    if (!flag.isTouching)
      clearInterval(keepMoving);
  }, 100);
}
