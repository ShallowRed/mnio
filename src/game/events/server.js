export default (Game) => {
  for (const [eventName, callback] of serverEvents) {
    Game.socket.on(eventName, (data) =>
      callback(Game, data)
    );
  }
}

const serverEvents = Object.entries({

  newPlayerPos(Game, newPosition) {
    Game.flag.waitingServerConfirmMove = false;
    if (newPosition !== Game.Player.position)
      Game.movePlayer(newPosition);
  },

  newPosition({ positions, Cell }, [lastPos, newPos]) {
    lastPos && (
      positions.splice(positions.indexOf(lastPos), 1),
      Cell.render.clear(lastPos)
    );
    newPos && (
      positions.push(newPos),
      Cell.render.position(newPos)
    )
  },

  newFill({ colors, Cell }, { position, color }) {
    colors[position] = color;
    Cell.render.color(position);
  },

  allowedCells({ allowed, Cell, flag }, cells) {
    cells.forEach(position => {
      if (allowed.includes(position)) return;
      allowed.push(position);
      if (!flag.isTranslating)
        Cell.render.allowed(position);
    });
  },

  confirmFill({ flag }) {
    flag.waitingServerConfirmFill = false;
  },

  reconnect_attempt: () => {
    window.location.reload(true);
  },

  error: () => {
    if (!window.isReloading)
      window.location.reload(true);
  },

  alert: message =>
    alert(message)
});
