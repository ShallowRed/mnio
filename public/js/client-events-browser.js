document.addEventListener('keydown', function(event) {
    if (GAME.flag) switch (event.keyCode) {

      case 32: // Spacebar
        drawcell(PLAYER.position, PLAYER.selectedcolor);
        break;

      case 37: // left arrow
        UI.zoomin();
        // getsizes();
        break;

      case 39: // right arrow
        UI.zoomout();
        break;

      case 38: // top arrow
        if (PLAYER.selectedcolor == PLAYER.colors[0]) UI.select(c3);
        else if (PLAYER.selectedcolor == PLAYER.colors[1]) UI.select(c1);
        else UI.select(c2);
        break;

      case 40: // bottom arrow
        if (PLAYER.selectedcolor == PLAYER.colors[0]) UI.select(c2);
        else if (PLAYER.selectedcolor == PLAYER.colors[1]) UI.select(c3);
        else UI.select(c1);
        break;

      case 81: // Q
        askformove("left");
        break;

      case 90: // Z
        askformove("up");
        break;

      case 68: // D
        askformove("right");
        break;

      case 83: // S
        askformove("down");
        break;
    }
  });

document.addEventListener('click', function(e) { if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur(); } });
