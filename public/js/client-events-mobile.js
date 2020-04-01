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
