import {
  zoom,
  selectColor
} from '../utils';
import Move from '../controlers/move';
import Render from '../views/render';

const KeyboardInput = (event, PLAYER, GAME, UI, MAP, socket) =>  {
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
      selectColor(PLAYER.Scolor == PLAYER.colors[0] ? 2 : PLAYER.Scolor == PLAYER.colors[1] ? 0 : 1, PLAYER, UI);
      break;

    case 83: // S
      selectColor(PLAYER.Scolor == PLAYER.colors[0] ? 1 : PLAYER.Scolor == PLAYER.colors[1] ? 2 : 0, PLAYER, UI);
      break;

    case 37: // left arrow
      Move("left", GAME, PLAYER, MAP, socket);
      break;

    case 38: // top arrow
      Move("up", GAME, PLAYER, MAP, socket);
      break;

    case 39: // right arrow
      Move("right", GAME, PLAYER, MAP, socket);
      break;

    case 40: // bottom arrow
      Move("down", GAME, PLAYER, MAP, socket);
      break;
  }
}

export {
  KeyboardInput
}
