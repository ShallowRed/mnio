import {
  selectColor,
} from '../utils/utils';

import RenderCell from '../components/map/renderCell';

import zoom from '../components/map/zoom';

const KeyboardInput = (event, GAME, socket) => {
  const { flag, PLAYER, UI } = GAME;
  const { position, palette, sColor } = PLAYER;
  let next;

  if (
    flag.translate ||
    !flag.moveCallback ||
    flag.input
  ) return;

  switch (event.code) {

    case "Space":
      RenderCell.fill(position, sColor, GAME, socket);
      break;

    case "KeyW":
      zoom(UI.isAlt ? "out" : "in", GAME);
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
      GAME.moveAttempt("left", socket);
      break;

    case "ArrowUp":
      GAME.moveAttempt("up", socket);
      break;

    case "ArrowRight":
      GAME.moveAttempt("right", socket);
      break;

    case "ArrowDown":
      GAME.moveAttempt("down", socket);
      break;
  }
}

export default KeyboardInput;
