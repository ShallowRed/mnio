const Touch = require('./mobile');

module.exports = function(PLAYER, GAME, UI, MAP, socket) {

  document.addEventListener('keydown', function(event) {
    require('./keyboard')(PLAYER, GAME, UI, MAP, socket);
  });

  document.addEventListener('touchstart', Touch.start, false);

  document.addEventListener('touchmove', function(evt) {
    Touch.move(evt, PLAYER, GAME, socket)
  }, false);

  document.addEventListener('click', function(e) {
    if (document.activeElement.toString() == '[object HTMLButtonElement]') {
      document.activeElement.blur();
    }
  });

}
