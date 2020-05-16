import Move from '../controlers/move';

const Touch = {
  start: [null, null],
  direction: null,
  delta: null,
}

const touchStart = (evt, GAME) => {
  Touch.start = [evt.touches[0].clientX, evt.touches[0].clientY]
  GAME.flag.input = true;
}

const touchEnd = (evt, GAME) => {
  GAME.flag.input = false;
  Touch.start = [null, null];
  Touch.direction = null;
  Touch.lastdir = null;
}

const touchMove = (evt, PLAYER, GAME, MAP, socket) => {
  let start = Touch.start
  if (!Touch.start[0] || !Touch.start[1]) return;
  Touch.delta = [Touch.start[0] - evt.touches[0].clientX, Touch.start[1] - evt.touches[0].clientY];
  Touch.direction = Math.abs(Touch.delta[0]) > Math.abs(Touch.delta[1]) ? Touch.delta[0] > 0 ? "left" : "right" : Touch.delta[1] > 0 ? "up" : "down";
  if (!Touch.lastdir) Touch.lastdir = Touch.direction;
  if (Touch.lastdir !== Touch.direction && Math.abs(Touch.delta[0]) < 50 && Math.abs(Touch.delta[1]) < 50) Touch.direction = Touch.lastdir;
  if (!GAME.flag.moveCallback || GAME.flag.translate || (Math.abs(Touch.delta[0]) < 50 && Math.abs(Touch.delta[1]) < 50)) return
  Move(Touch.direction, GAME, PLAYER, MAP, socket);
  Touch.start = [evt.touches[0].clientX, evt.touches[0].clientY];
  Touch.lastdir = Touch.direction;
  keepMoving(GAME, PLAYER, MAP, socket);
}

const keepMoving = (GAME, PLAYER, MAP, socket) => setInterval(() => {
  if (GAME.flag.moveCallback && !GAME.flag.translate && GAME.flag.input) Move(Touch.direction, GAME, PLAYER, MAP, socket);
  if (!GAME.flag.input) clearInterval(keepMoving);
}, 50);

export {
  touchStart,
  touchEnd,
  touchMove
}
