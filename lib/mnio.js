const events = require('./events');
const openSocketConnection = require('./networking');
const initDB = require('./database/initDatabase');

const MNIO = {
  PositionList: new Array(),
  PLAYERS: new Object(),

  initGame(io) {
    initDB();
    events.once('initGridState', grid => {
      console.log("Grid ready, listening to socket connections");
      Object.assign(MNIO, grid)
      io.on('connection', socket =>
        openSocketConnection(socket, MNIO));
    });
  }
};

events.on('newPosition', ([lastPos, newPos]) => {
  lastPos && MNIO.PositionList.splice(MNIO.PositionList.indexOf(lastPos),
    1);
  newPos && MNIO.PositionList.push(newPos);
});

events.on('fill', ([position, color]) => {
  MNIO.ColorList[position] = color;
});

events.on('setNewPlayer', ([socket, palette]) => {
  const player = MNIO.PLAYERS[socket.id];
  player.position = randompos(MNIO.ColorList);
  if (player.position == "end") {
    alertEnd(socket);
    return;
  };
  player.colors = palette;
  events.emit('initNewPlayer-' + socket.id, [socket, player])
});

const randompos = list => {
  const emptyCells = list.map((e, i) => !e ? i : null)
    .filter(e => e !== null);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const alertEnd = socket => {
  events.removeListener('initNewPlayer-' + socket.id);
  socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};

module.exports = MNIO;
