//Handle keyboard events
document.addEventListener('keydown', function(event) {
  if (flag) switch (event.keyCode) {

    case 32: // Spacebar
      fillplayercell(PLAYERPOS, selectedcolor);
      break;

    case 37: // left arrow
      zoominview();
      break;

    case 39: // right arrow
      zoomoutview();
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

function selectup() {
  if (selectedcolor == pcolor1) selectc3();
  else if (selectedcolor == pcolor2) selectc1();
  else selectc2();
}

function selectdown() {
  if (selectedcolor == pcolor1) selectc2();
  else if (selectedcolor == pcolor2) selectc3();
  else selectc1();
}
