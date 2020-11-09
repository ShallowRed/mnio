const Pokedex = require("../pokedex/pokedex.min");
const events = require('../events');

const initGame = (index, socket) => {

  events.emit('setNewPlayer', [socket, Pokedex[index]]);

  events.once('initNewPlayer', ([socket, player]) => {
    if (player.position == "end") {
      alertEnd(socket);
      return;
    };
    socket.emit("startPos", player.position);
    socket.broadcast.emit("newPosition", [null, player.position]);
    events.emit('newPosition', [null, player.position])
  })
};

const alertEnd = socket => {
  socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};

module.exports = initGame;
