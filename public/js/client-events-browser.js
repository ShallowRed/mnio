//Handle keyboard events
document.addEventListener('keydown', function(event) {
  if (flag) switch (event.keyCode) {

    case 32: // Spacebar
      DrawCell(PLAYER.position, PLAYER.selectedcolor);
      break;

    case 37: // left arrow
      MAP.zoomin();
      break;

    case 39: // right arrow
      MAP.zoomout();
      break;

    case 38: // top arrow
      selectup();
      break;

    case 40: // bottom arrow
      selectdown();
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
