import Move from '../controlers/move';
import {
  flagOk
} from '../utils'

// let xDown = null;
// let yDown = null;
let start = [null, null];
let flug = true;

function touchStart(evt) {
  start = [evt.touches[0].clientX, evt.touches[0].clientY]
  // xDown = evt.touches[0].clientX;
  // yDown = evt.touches[0].clientY;
  flug = true;
}

function touchEnd(evt, GAME) {
  // xDown = evt.touches[0].clientX;
  // yDown = evt.touches[0].clientY;
  GAME.flag3 = true;
  flug = false;
  start = [null, null];
  // xDown = null;
  // yDown = null;
}

function touchMove(evt, PLAYER, GAME, MAP, socket) {

  if (!flagOk(GAME) || !xDown || !yDown) return;

  let Diff = [start[0] - evt.touches[0].clientX, start[1] - evt.touches[0].clientY];

  let dir = (Math.abs(Diff[0]) > Math.abs(Diff[1])) ?
    (Diff[0] > 0) ? "left" : "right" :
    (Diff[1] > 0) ? "up" : "down";

  Move(dir, GAME, PLAYER, MAP, socket)

  start = [null, null];

  while (flug) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
    touchMove(evt, PLAYER, GAME, MAP, socket);
    return;
  }
}

export {
  touchStart,
  touchEnd,
  touchMove
}
