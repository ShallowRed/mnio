export default (Game) => {
  for (const [eventName, callback] of serverEvents) {
    Game.socket.on(eventName, (data) =>
      callback(Game, data)
    );
  }
}

const serverEvents = Object.entries({

  newPlayerPos(Game, newPosition) {
    Game.flag.moveCallback = true;
    // console.log("_____________________");
    // console.log("server nextPos :", newPosition);
    // console.log("move allowed: ", true)
    if (newPosition !== Game.Player.position) {
      // console.log("!!! Game.Player.position :", Game.Player.position);
      Game.newPlayerPos(newPosition);
    }
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

  allowedCells({ allowed, Cell }, cells) {
    cells.forEach(position => {
      if (allowed.includes(position)) return;
      allowed.push(position);
      Cell.render.allowed(position);
    });
  },

  moveCallback(
    // { flag }
  ) {
    // console.log("__________________________________________");
    // console.log("__ moveCallBack received");
    // flag.moveCallback = true;
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
