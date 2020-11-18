const Database = require('../database/events/');
const Player = require('./player/Player');
const logPlayer = require('./login');
const listenGameEvents = require('./gameEvents');

module.exports = class Network {

  constructor(Game, io) {
    this.Game = Game;
    this.Database = Database.bindGameId(Game.gameid)
    this.io = io;
    this.players = {};
    this.listenConnection();
  }

  listenConnection() {

    this.io.of('/login')
      .on('connection', socket => {
        logPlayer(socket, this);
        if (!!this.players[socket.request.sessionId]) {
          const player = this.players[socket.request.sessionId];
          this.spawnPlayer(socket, player);
          listenGameEvents(socket, player, this);
        }
      });

    this.io.of('/palette')
      .on('connection', socket => {
        const player = this.players[socket.request.sessionId];
        socket.on("paletteSelected", index => {
          this.newPlayer(index, socket, player)
        });
      });

    this.io.of('/game')
      .on('connection', socket => {
        const player = this.players[socket.request.sessionId];
        this.spawnPlayer(socket, player);
        listenGameEvents(socket, player, this);
      });

  }

  spawnPlayer(socket, player) {
    const { Game } = this;
    socket.emit('initGame', getInitData(player, Game));
    socket.broadcast.emit("newPosition", [null, player.position]);
    Game.newPosition([null, player.position]);
  }

  async newPlayer(index, socket, player) {
    const { Database, Game } = this;
    const { userName, password } = player;

    const playerid = await Database.saveCredentials(userName, password);
    const palette = await Database.savePlayerPalette(playerid, index);

    console.log("New player :", playerid);

    const props = { playerid, userName, palette };
    this.players[socket.request.sessionId] = new Player(props, Game);
  };


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
}
