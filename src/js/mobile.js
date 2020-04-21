const Action = require('./actions');

let xDown = null;
let yDown = null;

function start(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
};

function move(evt, PLAYER, GAME, socket) {
  if (!xDown || !yDown) return;
  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;
  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) Action.askformove("left", GAME, PLAYER, socket);
    else Action.askformove("right", GAME, PLAYER, socket);
  } else {
    if (yDiff > 0) Action.askformove("up", GAME, PLAYER, socket);
    else Action.askformove("down", GAME, PLAYER, socket);
  }
  xDown = null;
  yDown = null;
};

module.exports = {
  start,
  move
}

//
