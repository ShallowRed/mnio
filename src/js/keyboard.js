const Action = require('./actions');

module.exports = function(PLAYER, GAME, UI, MAP, socket) {
  if (GAME.flag) switch (event.keyCode) {

    case 32: // Spacebar
      Action.drawcell(PLAYER.position, PLAYER.selectedcolor, GAME, PLAYER, MAP, socket);
      break;

    case 37: // left arrow
      UI.zoomin(GAME, MAP, PLAYER);
      break;

    case 39: // right arrow
      UI.zoomout(GAME, MAP, PLAYER);
      break;

    case 38: // top arrow
      if (PLAYER.selectedcolor == PLAYER.colors[0]) UI.select(c3, PLAYER);
      else if (PLAYER.selectedcolor == PLAYER.colors[1]) UI.select(c1, PLAYER);
      else UI.select(c2, PLAYER);
      break;

    case 40: // bottom arrow
      if (PLAYER.selectedcolor == PLAYER.colors[0]) UI.select(c2, PLAYER);
      else if (PLAYER.selectedcolor == PLAYER.colors[1]) UI.select(c3, PLAYER);
      else UI.select(c1, PLAYER);
      break;

    case 81: // Q
      Action.askformove("left", GAME, PLAYER, socket);
      break;

    case 90: // Z
      Action.askformove("up", GAME, PLAYER, socket);
      break;

    case 68: // D
      Action.askformove("right", GAME, PLAYER, socket);
      break;

    case 83: // S
      Action.askformove("down", GAME, PLAYER, socket);
      break;
  }
};
