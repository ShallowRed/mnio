const Events = require('./events');
const openSocketConnection = require('./networking');

const MNIO = {
  PositionList: new Array(),
  PLAYERS: new Object(),

  initGame(io) {
    Events.setMnio(MNIO);
    Events.once('initGridState', grid => {
      console.log("Grid ready, listening to socket connections");
      Object.assign(MNIO, grid)
      io.on('connection', socket =>
        openSocketConnection(socket));
    });
  }
};

Events.on('newPosition', ([lastPos, newPos]) => {
  lastPos && MNIO.PositionList.splice(MNIO.PositionList.indexOf(lastPos),
    1);
  newPos && MNIO.PositionList.push(newPos);
});

Events.on('fill', ([position, color]) => {
  MNIO.ColorList[position] = color;
});

Events.on('initNewPlayer', ([socket, palette]) => {
  const player = MNIO.PLAYERS[socket.id];
  player.position = randompos(MNIO.ColorList);
  if (player.position == "end") {
    alertEnd(socket);
    return;
  };
  player.colors = palette;
  Events.emit(`newPlayerSet-${socket.id}`, [socket, player])
});

const randompos = list => {
  const emptyCells = list.map((e, i) => !e ? i : null)
    .filter(e => e !== null);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const alertEnd = socket => {
  Events.removeListener('initNewPlayer-' + socket.id);
  socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};

module.exports = MNIO;
