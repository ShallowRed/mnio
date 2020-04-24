import Move from '../controlers/move';

let xDown = null;
let yDown = null;

function touchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
}

function touchMove(evt, PLAYER, GAME, MAP, socket) {
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
  xDown = null;
  yDown = null;
}

export {touchStart, touchMove}
