import Move from '../controlers/move';

const Touch = {
  start: [null, null],
  direction: null,
}

function touchStart(evt, GAME) {
  if (!GAME.flag.ok()) return;
  Touch.start = [evt.touches[0].clientX, evt.touches[0].clientY]
  GAME.flag.input = true;
}

function touchEnd(evt, GAME) {
  GAME.flag.input = false;
  Touch.start = [null, null];
  Touch.direction = null;
  Touch.lastdir = null;
}

function touchMove(evt, PLAYER, GAME, MAP, socket) {
  if (!Touch.start[0] || !Touch.start[1]) return;
  let Delta = [Touch.start[0] - evt.touches[0].clientX, Touch.start[1] - evt.touches[0].clientY];
  Touch.direction = Math.abs(Delta[0]) > Math.abs(Delta[1]) ? Delta[0] > 0 ? "left" : "right" : Delta[1] > 0 ? "up" : "down";
  // if (!Touch.lastdir) Touch.lastdir = Touch.direction;
  // if (Touch.lastdir !== Touch.direction) {
  //   if (Math.abs(Delta[0]) > 30 || Math.abs(Delta[1]) > 30) {
  //     GAME.flag.input = false;
  //     return;
  //   } else Touch.direction = Touch.lastdir;
  // }
  if (GAME.flag.server || GAME.flag.anim || (Math.abs(Delta[0]) < 30 && Math.abs(Delta[1]) < 30)) return
  Move(Touch.direction, GAME, PLAYER, MAP, socket);
  Touch.start = [evt.touches[0].clientX, evt.touches[0].clientY];
  Touch.lastdir = Touch.direction;
  keepMoving(GAME, PLAYER, MAP, socket);

}

const keepMoving = (GAME, PLAYER, MAP, socket) => setInterval(() => {
  if (!GAME.flag.server && !GAME.flag.anim && GAME.flag.input && Touch.direction) Move(Touch.direction, GAME, PLAYER, MAP, socket);
  if (!GAME.flag.input) clearInterval(keepMoving);
}, 50);

export {
  touchStart,
  touchEnd,
  touchMove
}
