import Cell from '../components/Cell';

export default (Game) => {
  for (const [eventName, callback] of serverEvents) {
    Game.socket.on(eventName, (data) =>
      callback(Game, data)
    );
  }
}

const serverEvents = Object.entries({

  newPlayerPos(Game, newPosition) {
    if (newPosition !== Game.Player.position) {
      Game.newPlayerPos(newPosition);
    }
  },

  newPosition(Game, position) {
    const { positions } = Game;
    if (position[0]) {
      positions.splice(positions.indexOf(position[0]), 1);
      Cell.render.clear(position[0], Game);
    }

    if (position[1]) {
      positions.push(position[1]);
      Cell.render.position(position[1], Game);
    }
  },

  newFill(Game, { position, color }) {
    const { colors } = Game;

    colors[position] = color;
    Cell.render.color(position, Game);
  },

  allowedCells(Game, cells) {
    const { allowed } = Game;

    cells.forEach(position => {
      if (allowed.includes(position)) return;
      allowed.push(position);
      Cell.render.allowed(position, Game);
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
