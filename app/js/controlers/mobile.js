import Move from '../controlers/move';
import {flagOk} from '../utils'
let xDown = null;
let yDown = null;

function touchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
  flug = true;
}

function touchEnd(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
  flug = false;
}

let flug = true;

function touchMove(evt, PLAYER, GAME, MAP, socket) {
  if (!flagOk(GAME)) return;
  if (!xDown || !yDown) return;
  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;
  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) Move("left", GAME, PLAYER, MAP, socket);
    else Move("right", GAME, PLAYER, MAP, socket);
  } else {
    if (yDiff > 0) Move("up", GAME, PLAYER, MAP, socket);
    else Move("down", GAME, PLAYER, MAP, socket);
  }
  while (flug) {
    if (GAME.flag && GAME.flag2 && GAME.flag3) {
      xDown = xUp;
      yDown = yUp;
      touchMove(evt, PLAYER, GAME, MAP, socket);
    }
    return;
  }
  xDown = null;
  yDown = null;
}

export {
  touchStart,
  touchEnd,
  touchMove
}
