import {start, move} from './mobile'
import {listen} from './keyboard';

function events(PLAYER, GAME, UI, MAP, socket) {

  document.addEventListener('keydown', function(event) {
    listen(event, PLAYER, GAME, UI, MAP, socket);
  });

  document.addEventListener('touchstart', start, false);

  document.addEventListener('touchmove', function(evt) {
    move(evt, PLAYER, GAME, socket);
  }, false);

  document.addEventListener('click', function() {
    if (document.activeElement.toString() == '[object HTMLButtonElement]') {
      document.activeElement.blur();
    }
  });

}

export {events}
