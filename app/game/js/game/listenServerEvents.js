import Render from '../components/map/render';
import Translate from './translate';

export default function(socket) {
  for (const [eventName, callback] of events) {
    socket.on(eventName, callback.bind(this));
  }
}

const events = Object.entries({

  newPlayerPos: function(position) {
    const { PLAYER } = this;
    if (position !== PLAYER.position) {
      PLAYER.position = position;
      Translate(this);
    }
  },

  newPosition: function(position) {
    const { positions } = this.GAME;
    if (position[0]) {
      positions.splice(positions.indexOf(position[0]), 1);
      Render.clear(position[0], this);
    }
    if (position[1]) {
      positions.push(position[1]);
      Render.position(position[1], this);
    }
  },

  NewCell: function({ position, color }) {
    const { colors } = this.GAME;
    colors[position] = color;
    Render.color(position, this);
  },

  AllowedCells: function(cells) {
    const { allowed } = this.GAME;
    cells.forEach(position => {
      if (allowed.includes(position)) return;
      allowed.push(position);
      Render.allowed(position, this);
    });
  },

  moveCallback: function() {
    this.GAME.flag.moveCallback = true;
  },

  fillCallback: function() {
    this.GAME.flag.fillCallback = true;
  },

  error: () =>
    window.location.reload(true),

  reconnect_attempt: () =>
    window.location.reload(true)
});
