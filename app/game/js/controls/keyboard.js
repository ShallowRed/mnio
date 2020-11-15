import {
  selectColor,
} from '../utils/utils';

import Render from '../components/map/render';

import zoom from '../components/map/zoom';
import move from '../game/move';


const KeyboardInput = (event, context, UI, socket) => {
  const { PLAYER, GAME, MAP } = context;
  const { flag } = GAME;
  const { position, palette, sColor } = PLAYER;
  let next;

  if (
    flag.translate ||
    !flag.moveCallback ||
    flag.input
  ) return;

  switch (event.code) {

    case "Space":
      Render.fill(position, sColor, context, socket);
      break;

    case "KeyW":
      zoom(UI.isAlt ? "out" : "in", context, UI);
      break;

    case "ControlLeft":
      next = (palette.indexOf(sColor) + 1) % palette.length;
      selectColor(next, PLAYER, UI);
      break;

    case "ShiftLeft":
      next = (palette.indexOf(sColor) + palette.length - 1) % palette.length;
      selectColor(next, PLAYER, UI);
      break;

    case "ArrowLeft":
      move("left", context, socket);
      break;

    case "ArrowUp":
      move("up", context, socket);
      break;

    case "ArrowRight":
      move("right", context, socket);
      break;

    case "ArrowDown":
      move("down", context, socket);
      break;
  }
}

export default KeyboardInput;
