const Database = require('../database/events/');
const Player = require('./player/Player');
const listenLogin = require('./login');
const listenGameEvents = require('./gameEvents');

module.exports = class Network {

  constructor(Game, io) {
    this.Game = Game;
    this.Database = Database.bindGameId(Game.gameid)
    this.io = io;
    this.sessions = new Sessions();
    this.players = {};
    this.listenConnection();
  }

  listenConnection() {
    this.io.of('/login')
      .on('connection', socket => {
        listenLogin(socket, this);
        if (this.sessions.get(socket))
          this.spawnPlayer(socket);
      });

    this.io.of('/palette')
      .on('connection', socket => {
        socket.on("paletteSelected", index => {
          this.sessions.setPalette(socket, index, this)
        });
      });

    this.io.of('/game')
      .on('connection', socket => {
        if (this.sessions.get(socket))
          this.spawnPlayer(socket)
        else
          console.log("no session !");
      });
  }

  async logUser(context) {
    const { socket, userName, password, userInDb } = context;
    socket.emit('loginSuccess', !userInDb.exists);
    if (userInDb.exists)
      this.sessions.setPlayer(socket, userName, userInDb.creds, this);
    else if (this.Game.hasAvailableSpace())
      this.sessions.setCredentials(socket, { userName, password }, this);
    else alertEnd(socket);
  }

  async getExistingPlayer(userName, { playerid }) {
    const { Database, Game } = this;
    const palette = await Database.getPlayerPalette(playerid);
    const ownCells = await Database.getPlayerOwnCells(playerid);
    const props = { playerid, userName, palette, ownCells };
    return new Player(props, Game);
  }

  async createNewPLayer(index, { userName, password }) {
    const { Database, Game } = this;
    const playerid = await Database.saveCredentials(userName, password);
    const palette = await Database.savePlayerPalette(playerid, index);
    const props = { playerid, userName, palette };
    return new Player(props, Game);
  }

  spawnPlayer(socket) {
    const { Game } = this;
    const player = this.sessions.get(socket);
    socket.emit('initGame', getInitData(player, Game));
    socket.broadcast.emit("newPosition", [null, player.position]);
    Game.newPosition([null, player.position]);
    listenGameEvents(socket, player, this);
  }
}

class Sessions {
  constructor() {
    this.players = {};
  }

  set(socket, data) {
    this.players[socket.request.sessionId] = data;
  }

  get(socket) {
    return this.players[socket.request.sessionId];
  }

  setCredentials(socket, credentials, network) {
    this.set(socket, credentials);
  }

  async setPalette(socket, index, network) {
    const credentials = this.get(socket);
    const player = await network.createNewPLayer(index, credentials);
    this.set(socket, player);
  }

  async setPlayer(socket, userName, creds, network) {
    const player = await network.getExistingPlayer(userName, creds);
    this.set(socket, player);
  }
}

function getInitData(player, Game) {

  return {
    GAME: {
      colors: Game.gridState,
      positions: Game.playersPositions,
      rows: Game.rows,
      cols: Game.cols,
      owned: player.ownCells,
      allowed: player.allowedcells
    },
    PLAYER: {
      position: player.position,
      palette: player.palette,
      admin: player.name == "a"
    }
  }
};

// this can be put client side
const alertEnd = socket => {
  socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};
