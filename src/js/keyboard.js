import {askformove, drawcell} from './actions';

function listen(event, PLAYER, GAME, UI, MAP, socket) {
  if (GAME.flag) switch (event.keyCode) {

    case 32: // Spacebar
      drawcell(PLAYER.position, PLAYER.selectedcolor, GAME, PLAYER, MAP, socket);
      break;

    case 37: // left arrow
      UI.zoomin(GAME, MAP, PLAYER);
      break;

    case 39: // right arrow
      UI.zoomout(GAME, MAP, PLAYER);
      break;

    case 38: // top arrow
      if (PLAYER.selectedcolor == PLAYER.colors[0]) UI.select(UI.cs[2], PLAYER);
      else if (PLAYER.selectedcolor == PLAYER.colors[1]) UI.select(UI.cs[0], PLAYER);
      else UI.select(UI.cs[1], PLAYER);
      break;

    case 40: // bottom arrow
      if (PLAYER.selectedcolor == PLAYER.colors[0]) UI.select(UI.cs[1], PLAYER);
      else if (PLAYER.selectedcolor == PLAYER.colors[1]) UI.select(UI.cs[2], PLAYER);
      else UI.select(UI.cs[0], PLAYER);
      break;

    case 81: // Q
      askformove("left", GAME, PLAYER, socket);
      break;

    case 90: // Z
      askformove("up", GAME, PLAYER, socket);
      break;

    case 68: // D
      askformove("right", GAME, PLAYER, socket);
      break;

    case 83: // S
      askformove("down", GAME, PLAYER, socket);
      break;
  }
}

export {listen}
