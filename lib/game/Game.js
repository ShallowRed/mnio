const Map = require('./Map');
const DatabaseConnector = require('../database/connector');
const PlayerConnector = require('./Player');
const LoginConnector = require('./Login');
const ClientGameConnector = require('./ClientGame');

module.exports = class Game {

  constructor(mapState, io) {
    this.Map = new Map(mapState);
    this.Database = new DatabaseConnector(Map.gameid);
    this.Login = new LoginConnector(this.Database);
    this.Player = new PlayerConnector(this.Database, this.Map);
    this.ClientGame = new ClientGameConnector(this.Database, this.Map);

    this.Players = {};
    this.loginPage = io.of('/login');
    this.palettePage = io.of('/palette');
    this.gamePage = io.of('/game');
    this.listenConnection();
  }

  setSession(socket, data) {
    this.Players[socket.request.sessionId] = data;
  }

  getSession(socket) {
    return this.Players[socket.request.sessionId];
  }

  listenConnection() {
    this.loginPage.on('connection', socket =>
      this.listenLogin(socket)
    );
    this.palettePage.on('connection', socket =>
      this.listenPaletteSelection(socket)
    );
    this.gamePage.on('connection', socket =>
      this.startClientGame(socket)
    );
  }

  listenLogin(socket) {
    if (socket.request.session.isLogged) {
      socket.emit('redirect', '/game');
      return;
    }
    this.Login.init(socket, data =>
      this.loginSuccess(data)
    );
  }

  async loginSuccess({ socket, userInDb, userName, password }) {
    if (userInDb.exists) {
      const player = await this.Player.getExisting(userInDb.creds);
      this.setSession(socket, player);
    } else if (this.Map.hasAvailableSpace())
      this.setSession(socket, { userName, password });
    else alertEnd(socket);
  }

  listenPaletteSelection(socket) {
    if (socket.request.session.isLogged) {
      socket.emit('redirect', '/game');
      return;
    }
    socket.on("paletteSelected", async index => {
      const credentials = this.getSession(socket);
      const player = await this.Player.createNew(index, credentials)
      this.setSession(socket, player);
    });
  }

  async startClientGame(socket, player) {
    console.log("--------------------");
    if (socket.request.session.isLogged) {
      console.log("Player already logged in");
      if (this.getSession(socket)) {
        console.log("Found player in memory");
        player = this.getSession(socket);
      } else {
        console.log("Didn't find player in memory, searching in database");
        const { playerid, position } = socket.request.session;
        player = await this.Player.getExisting({ playerid, position });
        this.setSession(socket, player);
      }
    } else {
      console.log("Player didn't log in");
      player = this.getSession(socket);
      if (player) {
        console.log("Found player in memory");
        socket.request.session.isLogged = true;
        socket.request.session.playerid = player.playerid;
        socket.request.session.position = player.position;
        socket.request.session.save();
      }
    }
    console.log(player);

    if (player)
      this.ClientGame.init(socket, player);
    else {
      console.log('Unable to retrieve player, redirecting to login');
      socket.emit('redirect', '/');
    }
    console.log("-------------------");
  }
}

// this can be put client side
const alertEnd = socket => {
  socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};
