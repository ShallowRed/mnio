const Database = Object.assign({},
  require('./database/logPlayer'), {
    save: require('./database/save')
  });

const Pokedex = require("./pokedex/pokedex.min");
const Player = require('./player/constructor');
const checkMove = require('./player/checkMove');
const allowCells = require('./player/allowCells');

module.exports = class Network {

  constructor(Game, Database, io) {
    this.Game = Game;
    this.Database = Database;
    this.io = io;
    this.io.on('connection', socket => {
      this.logUser(socket);
    });
  }

  logUser(socket) {
    socket.on("username", async userName => {
      const userInDb = await this.Database.isUserNameInDb(userName);
      socket.emit("askPass", !userInDb.exists);
      socket.on("password", input =>
        isPasswordWrong(input, userInDb) ?
        alertWrongPass(socket) :
        this.initPlayer(socket, userInDb, input)
      );
    });
  }

  async initPlayer(socket, userInDb, creds) {

    const params = await this.getParams(userInDb, creds);
    const player = new Player(params);
    this.Game.setPlayer(socket, player);

    socket.emit('isNew', player.isNew)

    player.isNew ?
      socket.on("paletteSelected", index => {
        player.palette = Pokedex[index];
        player.position = randompos(this.gridState);
        player.position == "end" ?
          alertEnd(socket) :
          this.spawnPlayer(socket, player)
      }) :
      this.spawnPlayer(socket, player);
  }

  spawnPlayer(socket, player) {
    socket.emit('initGame', this.getInitData(player));
    socket.broadcast.emit("newPosition", [null, player.position]);
    this.Game.newPosition([null, player.position]);
    this.listenGameEvents(socket, player);
  }

  async getParams({ exists, creds }, [userName, password], playerid, deeds = {
    palette: null,
    ownCells: null
  }) {
    const { gridState, gameid } = this.Game;
    const params = { gridState, userName, playerid };
    if (!exists) {
      params.playerid = await this.Database.saveNewPlayer(userName, password)
    } else {
      params.playerid = creds.playerid;
      const deeds = await this.Database.getPlayerDeeds(creds.playerid, gameid);
      Object.assign(params, deeds);
    }
    return params
  }

  getInitData(player) {
    return {
      GAME: {
        colors: this.Game.gridState,
        positions: this.Game.playersPositions,
        allowed: player.allowedcells,
        owned: player.ownCells,
        RowCol: [this.Game.cols, this.Game.rows]
      },
      position: player.position,
      colors: player.palette,
      admin: player.name == "a"
    }
  }

  listenGameEvents(socket, player) {

    socket.on('move', direction => {
      this.movePlayer(socket, player, direction);
    });

    socket.on('fill', ({ color, position }) => {
      this.saveFill(player, position, color, socket)
    });

    socket.on('disconnect', () => {
      !!player && this.disconnect(socket, player);
    });
  }

  movePlayer(socket, player, direction) {
    socket.emit("moveCallback");
    const newPos = checkMove(player, direction, this.Game);
    if (!newPos) return;
    socket.emit("newPlayerPos", newPos);
    socket.broadcast.emit("newPosition", [player.position, newPos]);
    this.Game.emit('newPosition', [player.position, newPos])
    player.position = newPos;
  };

  saveFill({ name, dbid, ownCells, allowedcells }, position, color,
    socket) {
    this.Database.save.fill(position, name, dbid, color, this.Game.gameid);
    this.Game.newfill([position, color])
    socket.emit("fillCallback");
    socket.broadcast.emit('NewCell', { position, color });
    if (ownCells.includes(position)) return;
    ownCells.push(position);
    allowedcells = allowCells(ownCells);
    socket.emit('AllowedCells', allowedcells);
  };

  disconnect(socket, { name, dbid, position, colors }) {
    console.log(`Player left : ${name} | ${dbid}`);
    if (position) {
      this.Game.newPosition([position, null]);
      socket.broadcast.emit("newPosition", [position, null]);
    };
    if (colors)
      this.Database.save.player(dbid, colors, this.Game.gameid);
  }
}

const isPasswordWrong = ([name, password], userInDb) => {
  return userInDb.exists && userInDb.creds.Password !== password;
};

const alertWrongPass = socket => {
  socket.emit("alert",
    "Mot de passe incorrect pour ce nom d'utilisateur");
};

const randompos = list => {
  const emptyCells = list.map((e, i) => !e ? i : null)
    .filter(e => e !== null);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const alertEnd = socket => {
  socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};
