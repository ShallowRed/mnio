const Database = require('../database/events/');
const listenLogin = require('./events/login');
const spawnPlayer = require('./events/inGame');
const Player = require('./Player');

module.exports = class Game {

  constructor(Map, io) {
    this.Map = Map;
    this.Database = Database.bindGameId(Map.gameid)
    this.Players = {};
    this.io = io;
    this.loginPage = this.io.of('/login');
    this.palettePage = this.io.of('/palette');
    this.gamePage = this.io.of('/game');
    this.listenConnection();
  }

  set(socket, data) {
    this.Players[socket.request.sessionId] = data;
  }

  get(socket) {
    return this.Players[socket.request.sessionId];
  }

  listenConnection() {

    this.loginPage.on('connection', socket =>
      listenLogin(socket, this));

    this.palettePage.on('connection', socket =>
      this.listenPaletteSelection(socket));

    this.gamePage.on('connection', socket =>
      this.startClientGame(socket));
  }

  async loginSuccess(socket, { userInDb, userName, password }) {
    if (userInDb.exists) {
      const player = await Player.getExisting(userInDb.creds, this);
      this.set(socket, player);
    } else if (this.Map.hasAvailableSpace())
      this.set(socket, { userName, password });
    else alertEnd(socket);
  }

  listenPaletteSelection(socket) {
    if (socket.request.session.isLogged) {
      socket.emit('redirect', '/game');
      return;
    }
    socket.on("paletteSelected", async index => {
      const credentials = this.get(socket);
      const player = await Player.createNew(index, credentials, this)
      this.set(socket, player);
    });
  }

  async startClientGame(socket, player) {
    console.log("---------------------");
    if (socket.request.session.isLogged) {
      console.log("Player already logged in");
      if (this.get(socket)) {
        console.log("Found player in memory");
        player = this.get(socket);
      } else {
        console.log("Didn't find player in memory, searching in database");
        const { playerid, position } = socket.request.session;
        player = await Player.getExisting({ playerid, position }, this);
        this.set(socket, player);
      }
    } else {
      console.log("Player didn't log in");
      player = this.get(socket);
      if (player) {
        console.log("Found player in memory");
        socket.request.session.isLogged = true;
        socket.request.session.playerid = player.dbid;
        socket.request.session.position = player.position;
        socket.request.session.save();
      }
    }

    if (player)
      spawnPlayer(socket, player, this);
    else {
      console.log('Unable to retrieve player, redirecting to login');
      socket.emit('redirect', '/');
    }
  }
}

// this can be put client side
const alertEnd = socket => {
  socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};
