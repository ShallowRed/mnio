const events = require('./events');
const allowCells = require('./player/allowCells');

const Database = require('./database/logPlayer');
Object.assign(Database, {save: require('./database/save')});

const Pokedex = require("./pokedex/pokedex.min");
const Player = require('./player/constructor');
const checkMove = require('./player/checkMove');

module.exports = (socket, MNIO) => {

  socket.on("username", async userName => {
    const { exists, creds } =
    await Database.isUserNameInDb(userName, socket, MNIO);
    socket.emit("askPass", !exists);
    socket.on("password", async ([user, pass]) => {
      if (exists && pass !== creds.Password) {
        socket.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");
        return;
      }

      const playerid = !exists ?
        await Database.saveNewPlayer(user, pass, socket, MNIO) :
        creds.playerid;

      const { colors, ownCellsIds } = !exists ? {
        colors: null,
        ownCellsIds: null
      } : await Database.getReturningPlayer(creds.playerid, user,
        socket, MNIO);

      const player = MNIO.PLAYERS[socket.id] =
        new Player(playerid, user, colors, owncells, MNIO.ColorList);

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
        events.emit('newPosition', [null, player.position])
        socket.broadcast.emit("newPosition", [null, player.position]);
      }
    });
  });

  socket.on("paletteSelected", index =>
    initPlayerGame(index, socket)
  );

  socket.on('move', direction => {
    const player = MNIO.PLAYERS[socket.id];
    movePlayer(socket, player, direction, MNIO);
  });

  socket.on('fill', ({ color, position }) => {
    const player = MNIO.PLAYERS[socket.id];
    saveFill(player, position, color, socket, MNIO)
  });

  socket.on('disconnect', () => {
    const player = MNIO.PLAYERS[socket.id];
    !!player && disconnect(socket, player, MNIO.gameid);
  });
};

const initPlayerGame = (index, socket) => {
  events.emit('setNewPlayer', [socket, Pokedex[index]]);
  events.once('initNewPlayer-' + socket.id, ([socket, player]) => {
    socket.emit("startPos", player.position);
    socket.broadcast.emit("newPosition", [null, player.position]);
    events.emit('newPosition', [null, player.position])
  })
};

const movePlayer = (socket, player, direction, MNIO) => {
  socket.emit("moveCallback");
  const newPos = checkMove(player, direction, MNIO);
  if (!newPos) return;
  socket.emit("NewPlayerPos", newPos);
  socket.broadcast.emit("newPosition", [player.position, newPos]);
  events.emit('newPosition', [player.position, newPos])
  player.position = newPos;
};

const saveFill = (player, position, color, socket, MNIO) => {
  console.log("fill: " + color);
  Database.save.fill(position, player.name, player.dbid, color, MNIO.gameid);
  events.emit('fill', [position, color])
  socket.emit("fillCallback");
  socket.broadcast.emit('NewCell', { position, color });
  if (!player.owncells.includes(position)) {
    player.owncells.push(position);
    player.allowedcells = allowCells(player.owncells);
    socket.emit('AllowedCells', player.allowedcells);
  }
};

const disconnect = (socket, { name, dbid, position, colors }, gameid) => {
  console.log(`Player left : ${name} | ${dbid}`);

  if (position) {
    events.emit("newPosition", [position, null]);
    socket.broadcast.emit("newPosition", [position, null]);
  };

  if (colors)
    Database.save.player(dbid, colors, gameid);
};
