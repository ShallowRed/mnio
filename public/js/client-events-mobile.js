//Handle touchscreen events
$(document).touchwipe({
  wipeLeft: function() {
    if (GAME.flag) askformove("left");
  },
  wipeRight: function() {
    if (GAME.flag) askformove("right");
  },
  wipeUp: function() {
    if (GAME.flag) askformove("down");
  },
  wipeDown: function() {
    if (GAME.flag) askformove("up");
  },
  min_move_x: 20,
  min_move_y: 20,
  preventDefaultEvents: true
});

// TODO: new touchwipe system
