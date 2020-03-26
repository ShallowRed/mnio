//Handle touchscreen events
$(document).touchwipe({
  wipeLeft: function() {
    if (flag == true) {
      askformove("left");
      flag = true;
    }
  },
  wipeRight: function() {
    if (flag == true) {
      askformove("right");
      flag = true;
    }
  },
  wipeUp: function() {
    if (flag == true) {
      askformove("down");
      flag = true;
    }
  },
  wipeDown: function() {
    if (flag == true) {
      askformove("up");
      flag = true;
    }
  },
  min_move_x: 20,
  min_move_y: 20,
  preventDefaultEvents: true
});

//Handle keyboard events
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {

    case 32: // Spacebar
      if (flag == true) {
        fillplayercell(playerpos, selectedcolor);
        break;

      } else {
        break;
      }
      // left arrow 37

      case 38: // top arrow
        if (flag == true) {
          if (selectedcolor == pcolor1) {
            selectc2(pcolor2);
            break;
          } else if (selectedcolor == pcolor2) {
            selectc3(pcolor3);
            break;
          } else {
            selectc1(pcolor1);
            break;
          }
        } else {
          break;
        }

        case 40: // bottom arrow
          if (flag == true) {
            if (selectedcolor == pcolor1) {
              selectc3(pcolor3);
              break;
            } else if (selectedcolor == pcolor2) {
              selectc1(pcolor1);
              break;
            } else {
              selectc2(pcolor2);
              break;
            }
          } else {
            break;
          }

          case 81: // Q
            if (flag == true) {
              askformove("left");
            }
            break;

          case 90: // Z
            if (flag == true) {
              askformove("up");
            }
            break;

          case 68: // D
            if (flag == true) {
              askformove("right");
            }
            break;

          case 83: // S
            if (flag == true) {
              askformove("down");
            }
            break;
  }
});
