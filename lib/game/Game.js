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

  async loginSucess(socket, { userInDb, userName, password }) {
    if (userInDb.exists) {
      const player = await Player.getExisting(userInDb.creds, this);
      this.set(socket, player);
    } else if (this.Map.hasAvailableSpace())
      this.set(socket, { userName, password });
    else alertEnd(socket);
  }

  listenPaletteSelection(socket) {
    socket.on("paletteSelected", async index => {
      const credentials = this.get(socket);
      const player = await Player.createNew(index, credentials, this)
      this.set(socket, player);
    });
  }

  startClientGame(socket) {
    const player = this.get(socket);
    if (player && player.ownCells)
      spawnPlayer(socket, player, this)
    else {
      console.log("no session !");
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
