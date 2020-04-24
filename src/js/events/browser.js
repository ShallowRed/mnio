import {zoomin, zoomout, select} from '../utils';
import Move from '../controlers/move';
import Render from '../controlers/render';

function KeyboardInput(event, PLAYER, GAME, UI, MAP, socket) {
  switch (event.keyCode) {

    case 32: // Spacebar
      Render.fill(PLAYER.position, PLAYER.selectedcolor, GAME, PLAYER, MAP, socket);
      break;

    case 37: // left arrow
      zoomin(GAME, MAP, PLAYER);
      break;

    case 39: // right arrow
      zoomout(GAME, MAP, PLAYER);
      break;

    case 38: // top arrow
      if (PLAYER.selectedcolor == PLAYER.colors[0]) select(UI.cs[2], PLAYER, UI);
      else if (PLAYER.selectedcolor == PLAYER.colors[1]) select(UI.cs[0], PLAYER, UI);
      else select(UI.cs[1], PLAYER, UI);
      break;

    case 40: // bottom arrow
      if (PLAYER.selectedcolor == PLAYER.colors[0]) select(UI.cs[1], PLAYER, UI);
      else if (PLAYER.selectedcolor == PLAYER.colors[1]) select(UI.cs[2], PLAYER, UI);
      else select(UI.cs[0], PLAYER);
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

export {KeyboardInput}
