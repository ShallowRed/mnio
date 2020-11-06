const allow = require('./allow');
const { rows, cols } = require('../config');

const askPass = (socket, isNew) =>
  socket.emit("askPass", isNew);

const wrongPass = socket =>
  socket.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");

class Player {
  constructor(userId, userName, colors, owncells, ColorList) {
    const isNew = (!owncells || !owncells.length);
    this.name = userName;
    this.dbid = userId;
    this.colors = isNew ? null : colors;
    this.owncells = isNew ? new Array() : owncells;
    this.allowedcells = isNew ? new Array() : allow(owncells);
    this.position = isNew ? null : owncells[0];
  }
}

const log = (id, user, socket, MNIO, colors, owncells) => {

  // Create a new player in the session
  const player = MNIO.PLAYERS[socket.id] =
    new Player(id, user, colors, owncells, MNIO.ColorList);

  // Send info to the player
  socket.emit('initData', {
    GAME: {
      colors: MNIO.ColorList,
      positions: MNIO.PositionList,
      allowed: player.allowedcells,
      owned: player.owncells,
      RowCol: [MNIO.cols, MNIO.rows]
    },
    position: player.position,
    colors: colors,
    new: !colors,
    admin: user == "a"
  });

  if (player.position) {
    // Send info to others and save position
    MNIO.PositionList.push(player.position);
    socket.broadcast.emit("NewPosition", [null, player.position]);
  }
};

module.exports = {
  log,
  askPass,
  wrongPass
};
