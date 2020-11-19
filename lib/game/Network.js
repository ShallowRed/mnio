const Database = require('../database/events/');
const Sessions = require('./Sessions');
const listenLogin = require('./login');
const spawnPlayer = require('./gameEvents');

module.exports = class Network {

  constructor(Game, io) {
    this.Game = Game;
    this.io = io;
    this.loginPage = this.io.of('/login');
    this.palettePage = this.io.of('/palette');
    this.gamePage = this.io.of('/game');
    this.Database = Database.bindGameId(Game.gameid)
    this.sessions = new Sessions();
    this.listenConnection();
  }

  listenConnection() {

    this.loginPage.on('connection', socket =>
      listenLogin(socket, this));

    this.palettePage.on('connection', socket =>
      this.listenPaletteSelection(socket));

    this.gamePage.on('connection', socket =>
      this.spawnPlayer(socket));
  }

  onLoginSucess(socket, context) {
    const { userInDb, userName, password } = context;
    if (userInDb.exists)
      this.sessions.setExistingPlayer(socket, userInDb.creds, this);
    else if (this.Game.hasAvailableSpace())
      this.sessions.setCredentials(socket, { userName, password }, this);
    else alertEnd(socket);
  }

  listenPaletteSelection(socket) {
    socket.on("paletteSelected", index => {
      this.sessions.setNewPlayer(socket, index, this)
    });
  }

  spawnPlayer(socket) {
    const player = this.sessions.get(socket);
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
