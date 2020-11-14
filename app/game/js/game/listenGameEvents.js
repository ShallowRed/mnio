import Render from '../utils/render';

export default function listenGameEvents(socket) {
  for (const [eventName, callback] of events) {
    socket.on(eventName, callback.bind(this));
  }
}

const events = Object.entries({

  newPlayerPos: function(position) {
    const { GAME, PLAYER, MAP } = this;
    if (position == PLAYER.position) return;
    PLAYER.position = position;
    window.Translate.init(GAME, MAP, PLAYER);
  },

  newPosition: function(position) {
    const { GAME, PLAYER, MAP } = this;
    if (position[0]) {
      GAME.positions.splice(GAME.positions.indexOf(position[0]), 1);
      Render.clear(position[0], MAP.ctx[2], PLAYER, GAME, MAP);
    }
    if (position[1]) {
      GAME.positions.push(position[1]);
      Render.position(position[1], PLAYER, GAME, MAP);
    }
  },

  NewCell: function(cell) {
    const { GAME, PLAYER, MAP } = this;
    GAME.colors[cell.position] = cell.color;
    Render.color(cell.position, PLAYER, GAME, MAP);
  },

  AllowedCells: function(cells) {
    const { GAME, PLAYER, MAP } = this;
    cells.forEach(position => {
      if (GAME.allowed.includes(position)) return;
      GAME.allowed.push(position);
      Render.allowed(position, PLAYER, GAME, MAP);
    });
  },

  moveCallback: function() {
    const { GAME } = this;
    GAME.flag.moveCallback = true
  },

  fillCallback: function() {
    const { GAME } = this;
    GAME.flag.fillCallback = true
  },

  error: () =>
    window.location.reload(true),

  reconnect_attempt: () =>
    window.location.reload(true)
});
