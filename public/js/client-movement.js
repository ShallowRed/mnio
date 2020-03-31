//Handle touchscreen events
$(document).touchwipe({
  wipeLeft: function() {
    if (flag) askformove("left");
  },
  wipeRight: function() {
    if (flag) askformove("right");
  },
  wipeUp: function() {
    if (flag) askformove("down");
  },
  wipeDown: function() {
    if (flag) askformove("up");
  },
  min_move_x: 20,
  min_move_y: 20,
  preventDefaultEvents: true
});

//Handle keyboard events
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {

    case 32: // Spacebar
      if (flag) fillplayercell(playerpos, selectedcolor);
      break;

    case 37: // left arrow
      if (viewsize > 3 && flag) {
        --vrows;
        --vcols;
        setcanvassize();
        setplayerposinview(playerpos, false);
        drawplayer(selectedcolor);
        drawgrid(playerpos);
      }
      break;

    case 39: // right arrow
    if (viewsize + 1 < globalrows && flag) {
        ++vrows;
        ++vcols;
        setcanvassize();
        setplayerposinview(playerpos, false);
        drawplayer(selectedcolor);
        drawgrid(playerpos);
      }
      break;

    case 38: // top arrow
      if (flag) {
        if (selectedcolor == pcolor1) selectc2();
        else if (selectedcolor == pcolor2) selectc3();
        else selectc1();
      }
      break;

    case 40: // bottom arrow
      if (flag) {
        if (selectedcolor == pcolor1) selectc3();
        else if (selectedcolor == pcolor2) selectc1();
        else selectc2();
      }
      break;

    case 81: // Q
      if (flag) askformove("left");
      break;
    case 90: // Z
      if (flag) askformove("up");

      break;
    case 68: // D
      if (flag) askformove("right");
      break;
    case 83: // S
      if (flag) askformove("down");
      break;
  }
});
