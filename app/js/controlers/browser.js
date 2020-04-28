import {
  zoom,
  select,
} from '../utils';
import Move from '../controlers/move';
import Render from '../views/render';

function KeyboardInput(event, PLAYER, GAME, UI, MAP, socket) {
  if (!GAME.flag.ok()) return;
  switch (event.keyCode) {

    case 32: // Spacebar
      Render.fill(PLAYER.position, PLAYER.Scolor, GAME, PLAYER, MAP, socket);
      break;

    case 37: // left arrow
      zoom("in", GAME, MAP, PLAYER);
      break;

    case 39: // right arrow
      zoom("out", GAME, MAP, PLAYER);
      break;

    case 38: // top arrow
      select(UI.cs[PLAYER.Scolor == PLAYER.colors[0] ? 2 : PLAYER.Scolor == PLAYER.colors[1] ? 0 : 1], PLAYER, UI);
      break;

    case 40: // bottom arrow
      select(UI.cs[PLAYER.Scolor == PLAYER.colors[0] ? 1 : PLAYER.Scolor == PLAYER.colors[1] ? 2 : 0], PLAYER, UI);
      break;

    case 81: // Q
      Move("left", GAME, PLAYER, MAP, socket);
      break;

    case 90: // Z
      Move("up", GAME, PLAYER, MAP, socket);
      break;

    case 68: // D
      Move("right", GAME, PLAYER, MAP, socket);
      break;

    case 83: // S
      Move("down", GAME, PLAYER, MAP, socket);
      break;
  }
}

export {
  KeyboardInput
}
