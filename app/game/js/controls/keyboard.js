import {
  selectColor,
} from '../utils/utils';

import Render from '../components/map/render';

import zoom from '../components/map/zoom';
import move from '../game/move';

let next;

const KeyboardInput = (event, context, UI, socket) => {
  const { PLAYER, GAME, MAP } = context;
  const { flag } = GAME;
  if (flag.translate || !flag.moveCallback || flag.input) return;
  switch (event.code) {

    case "Space":
      Render.fill(PLAYER.position, PLAYER.sColor, context, socket);
      break;

    case "KeyW":
      zoom(UI.isAlt ? "out" : "in", context, UI);
      break;

    case "ControlLeft":
      next = (PLAYER.palette.indexOf(PLAYER.sColor) + 1) % PLAYER.palette
        .length;
      selectColor(next, PLAYER, UI);
      break;

    case "ShiftLeft":
      next = (PLAYER.palette.indexOf(PLAYER.sColor) + PLAYER.palette.length -
        1) % PLAYER.palette.length;
      selectColor(next, PLAYER, UI);
      break;

    case "ArrowLeft":
      move("left", { GAME, PLAYER, MAP }, socket);
      break;

    case "ArrowUp":
      move("up", { GAME, PLAYER, MAP }, socket);
      break;

    case "ArrowRight":
      move("right", { GAME, PLAYER, MAP }, socket);
      break;

    case "ArrowDown":
      move("down", { GAME, PLAYER, MAP }, socket);
      break;
  }
}

export default KeyboardInput;
