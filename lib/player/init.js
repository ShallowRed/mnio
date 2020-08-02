const Pokedex = require("../pokedex/pokedex.min");

const initGame = (MNIO, socket, Pokedex) => {
  const player = MNIO.PLAYERS[socket.id];
  if (!player) return;

  player.position = randompos(MNIO.ColorList);

  if (player.position == "end") {
    socket.emit("alert", "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !");
    return;
  }

  player.colors = Pokedex[index];

  socket.emit("startPos", player.position);

  socket.broadcast.emit("NewPosition", [null, player.position]);

  MNIO.PositionList.push(player.position);
};

const randompos = list => {
  const emptyCells = list.map((e, i) => !e ? i : null).filter(e => e !== null);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

module.exports = initGame;
