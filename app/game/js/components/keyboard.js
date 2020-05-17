import {
  selectColor,
} from '../utils/utils';

import Render from '../utils/render';

import zoom from '../utils/zoom';
import move from '../utils/move';

let next;

const KeyboardInput = (event, PLAYER, GAME, UI, MAP, socket) => {
  if (GAME.flag.translate || !GAME.flag.moveCallback || GAME.flag.input) return;
  switch (event.keyCode) {

    case 32: // Spacebar
      Render.fill(PLAYER.position, PLAYER.Scolor, GAME, PLAYER, MAP, socket);
      break;

    case 81: // Q
      zoom("in", GAME, MAP, UI);
      break;

    case 68: // D
      zoom("out", GAME, MAP, UI);
      break;

    case 90: // Z
      next = (PLAYER.colors.indexOf(PLAYER.Scolor) + 1) % PLAYER.colors.length;
      console.log(next);
      selectColor(next, PLAYER, UI);
      // selectColor(PLAYER.Scolor == PLAYER.colors[0] ? 2 : PLAYER.Scolor == PLAYER.colors[1] ? 0 : 1, PLAYER, UI);
      break;

    case 83: // S
      next = (PLAYER.colors.indexOf(PLAYER.Scolor) + PLAYER.colors.length - 1) % PLAYER.colors.length;
      console.log(next);
      selectColor(next, PLAYER, UI);
      // selectColor(PLAYER.Scolor == PLAYER.colors[0] ? 1 : PLAYER.Scolor == PLAYER.colors[1] ? 2 : 0, PLAYER, UI);
      break;

    case 37: // left arrow
      move("left", GAME, PLAYER, MAP, socket);
      break;

    case 38: // top arrow
      move("up", GAME, PLAYER, MAP, socket);
      break;

    case 39: // right arrow
      move("right", GAME, PLAYER, MAP, socket);
      break;

    case 40: // bottom arrow
      move("down", GAME, PLAYER, MAP, socket);
      break;
  }
}

export {
  KeyboardInput
}
