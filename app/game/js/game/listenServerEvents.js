import Render from '../components/map/render';
import Translate from './translate';

export default function(socket) {
  for (const [eventName, callback] of events) {
    socket.on(eventName, (data) => callback(this, data));
  }
}

const events = Object.entries({

  newPlayerPos: function(context, newPosition) {
    let { position } = context.PLAYER;
    if (newPosition !== position) {
      position = newPosition;
      Translate(context);
    }
  },

  newPosition: function(context, position) {
    const { positions } = context.GAME;

    if (position[0]) {
      positions.splice(positions.indexOf(position[0]), 1);
      Render.clear(position[0], context);
    }

    if (position[1]) {
      positions.push(position[1]);
      Render.position(position[1], context);
    }
  },

  NewCell: function(context, {position, color }) {
    const { colors } = context.GAME;

    colors[position] = color;
    Render.color(position, context);
  },

  AllowedCells: function(context, cells) {
    const { allowed } = context.GAME;

    cells.forEach(position => {
      if (allowed.includes(position)) return;
      allowed.push(position);
      Render.allowed(position, context);
    });
  },

  moveCallback: function(context) {
    context.GAME.flag.moveCallback = true;
  },

  fillCallback: function(context) {
    context.GAME.flag.fillCallback = true;
  },

  error: () =>
    window.location.reload(true),

  reconnect_attempt: () =>
    window.location.reload(true)
});
