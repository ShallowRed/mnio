import {
  selectColor,
} from '../utils/utils';

import Render from '../utils/render';

import zoom from '../utils/zoom';
import move from '../utils/move';

let next;

const KeyboardInput = (event, PLAYER, GAME, UI, MAP, socket) => {
  if (GAME.flag.translate || !GAME.flag.moveCallback || GAME.flag.input) return;
  switch (event.code) {

    case "Space":
      Render.fill(PLAYER.position, PLAYER.Scolor, GAME, PLAYER, MAP, socket);
      break;

    case "KeyW":
      zoom(UI.isAlt ? "out" : "in", GAME, MAP, UI);
      break;

      //   zoom("out", GAME, MAP, UI);
      //   break;

    case "ControlLeft":
      next = (PLAYER.palette.indexOf(PLAYER.Scolor) + 1) % PLAYER.palette.length;
      selectColor(next, PLAYER, UI);
      break;

    case "ShiftLeft":
      next = (PLAYER.palette.indexOf(PLAYER.Scolor) + PLAYER.palette.length - 1) % PLAYER.palette.length;
      selectColor(next, PLAYER, UI);
      break;

    case "ArrowLeft":
      move("left", GAME, PLAYER, MAP, socket);
      break;

    case "ArrowUp":
      move("up", GAME, PLAYER, MAP, socket);
      break;

    case "ArrowRight":
      move("right", GAME, PLAYER, MAP, socket);
      break;

    case "ArrowDown":
      move("down", GAME, PLAYER, MAP, socket);
      break;
  }
}

export default KeyboardInput;
