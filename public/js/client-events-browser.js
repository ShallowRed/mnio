  document.addEventListener('keydown', function(event) {
    if (GAME.flag) switch (event.keyCode) {

      case 32: // Spacebar
        drawcell(PLAYER.position, PLAYER.selectedcolor);
        break;

      case 37: // left arrow
        GAME.zoomin();
        // getsizes();
        break;

      case 39: // right arrow
        GAME.zoomout();
        break;

      case 38: // top arrow
        if (PLAYER.selectedcolor == PLAYER.color1) selectc3();
        else if (PLAYER.selectedcolor == PLAYER.color2) selectc1();
        else selectc2();
        break;

      case 40: // bottom arrow
        if (PLAYER.selectedcolor == PLAYER.color1) selectc2();
        else if (PLAYER.selectedcolor == PLAYER.color2) selectc3();
        else selectc1();
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
