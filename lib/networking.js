const Events = require('./events');

const Database = require('./database/logPlayer');
Object.assign(Database, { save: require('./database/save') });

const Pokedex = require("./pokedex/pokedex.min");

const Player = require('./player/constructor');
const checkMove = require('./player/checkMove');
const allowCells = require('./player/allowCells');

module.exports = (socket) => {

  socket.on("username", async userName => {

    const { exists, creds } =
    await Database.isUserNameInDb(userName);
    socket.emit("askPass", !exists);
    socket.on("password", async ([userName, password]) => {

      if (exists && password !== creds.Password) {
        alertWrongPass(socket);
        return;
      }

      const params = Object.assign({
        ColorList: Events.getColorList(),
        userName,
        playerid: exists ?
          creds.playerid : await Database.saveNewPlayer(
            userName, password),
      }, exists ? await Database.getPlayerDeeds(creds
        .playerid) : null);

      console.log(params);


///////////////////////: ERROR HERE
      const player = Events.getPlayer(socket) = new Player(params);

      console.log(player);
      socket.emit('initData', getInitData(player));

      if (player.position) {
        Events.emit('newPosition', [null, player.position])
        socket.broadcast.emit("newPosition", [null, player
          .position
        ]);
      }
    });
  });

  socket.on("paletteSelected", index =>
    initPlayerGame(index, socket)
  );

  socket.on('move', direction => {
    const player = getPlayer(socket);
    movePlayer(socket, player, direction);
  });

  socket.on('fill', ({ color, position }) => {
    const player = getPlayer(socket);
    saveFill(player, position, color, socket)
  });

  socket.on('disconnect', () => {
    const player = getPlayer(socket);
    !!player && disconnect(socket, player);
  });
};

const getInitData = ({ name, position, palette, ownCells, allowedcells }) => ({
  GAME: {
    colors: Events.getColorList(),
    positions: Events.getPositionList(),
    allowed: allowedcells,
    owned: ownCells,
    RowCol: [Events.getCols(), Events.getRows()]
  },
  position,
  colors: palette,
  new: !palette,
  admin: name == "a"
});

const alertWrongPass = socket => {
  socket.emit("alert",
    "Mot de passe incorrect pour ce nom d'utilisateur");
};

const initPlayerGame = (index, socket) => {
  Events.emit('initNewPlayer', [socket, Pokedex[index]]);
  Events.once(`newPlayerSet-${socket.id}`, spawnPlayer)
};

const spawnPlayer = ([socket, player]) => {
  socket.emit("startPos", player.position);
  socket.broadcast.emit("newPosition", [null, player.position]);
  Events.emit('newPosition', [null, player.position])
}

const movePlayer = (socket, player, direction) => {
  socket.emit("moveCallback");
  const newPos = checkMove(player, direction);
  if (!newPos) return;
  socket.emit("newPlayerPos", newPos);
  socket.broadcast.emit("newPosition", [player.position, newPos]);
  Events.emit('newPosition', [player.position, newPos])
  player.position = newPos;
};

const saveFill = ({ name, dbid, ownCells, allowedcells }, position, color,
  socket, MNIO) => {
  console.log("fill: ", color);
  Database.save.fill(position, name, dbid, color);
  Events.emit('fill', [position, color])
  socket.emit("fillCallback");
  socket.broadcast.emit('NewCell', { position, color });
  if (ownCells.includes(position)) return;
  ownCells.push(position);
  allowedcells = allowCells(ownCells);
  socket.emit('AllowedCells', allowedcells);
};

const disconnect = (socket, { name, dbid, position, colors }) => {
  console.log(`Player left : ${name} | ${dbid}`);
  if (position) {
    Events.emit("newPosition", [position, null]);
    socket.broadcast.emit("newPosition", [position, null]);
  };
  if (colors)
    Database.save.player(dbid, colors);
};
