import Cell from '../components/Cell';

export default (GAME) => {
  for (const [eventName, callback] of serverEvents) {
    GAME.socket.on(eventName, (data) =>
      callback(GAME, data)
    );
  }
}

const serverEvents = Object.entries({

  newPlayerPos(GAME, newPosition) {
    if (newPosition !== GAME.PLAYER.position) {
      GAME.newPlayerPos(newPosition);
    }
  },

  newPosition(GAME, position) {
    const { positions } = GAME;
    if (position[0]) {
      positions.splice(positions.indexOf(position[0]), 1);
      Cell.render.clear(position[0], GAME);
    }

    if (position[1]) {
      positions.push(position[1]);
      Cell.render.position(position[1], GAME);
    }
  },

  NewCell(GAME, { position, color }) {
    const { colors } = GAME;

    colors[position] = color;
    Cell.render.color(position, GAME);
  },

  AllowedCells(GAME, cells) {
    const { allowed } = GAME;

    cells.forEach(position => {
      if (allowed.includes(position)) return;
      allowed.push(position);
      Cell.render.allowed(position, GAME);
    });
  },

  moveCallback({ flag }) {
    flag.moveCallback = true;
  },

  fillCallback({ flag }) {
    flag.fillCallback = true;
  },

  error: () =>
    window.location.reload(true),

  reconnect_attempt: () =>
    window.location.reload(true),

  alert: message =>
    alert(message)

});
