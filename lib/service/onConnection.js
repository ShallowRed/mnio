const Player = require('../player/Player');
const Pokedex = require('../pokedex/pokedex.min');

module.exports = function logPlayer(socket) {
  const context = { network: this, socket };

  socket.on("username", checkUsername.bind(context));
}

async function checkUsername(userName) {
  const { socket, network } = this, { Database } = network;
  const userInDb = await Database.isUserNameInDb(userName);
  const context = { socket, network, userName, userInDb };
  askPassword.call(context)
}

function askPassword() {
  const { socket, userInDb } = this;
  socket.emit("askPass", !userInDb.exists);
  socket.on("password", checkPassword.bind(this));
};

function checkPassword(password) {
  isPasswordWrong(password, this.userInDb) ?
    alertWrongPass.call(this.socket) :
    initPlayer.call(this, password)
}

const isPasswordWrong = (password, userInDb) => {
  return userInDb.exists && userInDb.creds.Password !== password;
};

function alertWrongPass() {
  this.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");
};

async function initPlayer(password) {
  const { socket, userName, userInDb, network: { Game } } = this;
  socket.emit('loginSuccess', !userInDb.exists);
  userInDb.exists ?
    returningPlayer.call(this, userName) :
    !Game.hasAvailableSpace() ?
    alertEnd.call({ socket }) :
    socket.on("paletteSelected", newPlayer.bind(this, {userName, password}));
}

async function returningPlayer(userName) {
  const { userInDb, network: { Database } } = this;
  const { playerid } = userInDb.creds;
  console.log("Player back :", playerid);
  const palette = await Database.getPlayerPalette(playerid);
  const ownCells = await Database.getPlayerOwnCells(playerid);
  spawnPlayer.call(this, { playerid, userName, palette, ownCells });
}

async function newPlayer({userName, password}, index) {
  const { socket, network: { Database, Game: { gridState } } } = this;
  const playerid = await Database.saveCredentials(userName, password);
  const palette = await Database.savePlayerPalette(playerid, index);
  console.log("New player :", playerid);
  spawnPlayer.call(this, { playerid, userName, palette })
}

function spawnPlayer(props) {
  const { socket, network } = this, { Game } = network;
  const player = new Player(props, Game);
  const context = { socket, player, network };
  socket.emit('initGame', getInitData.call(context));
  socket.broadcast.emit("newPosition", [null, player.position]);
  Game.newPosition([null, player.position]);
  network.listenGameEvents.call(context);
}

// THIS SHOULD BE REFACTORED, split game state and player state ///////////////
function getInitData() {
  const { player, network: { Game } } = this;

  return {
    GAME: {
      colors: Game.gridState,
      positions: Game.playersPositions,
      allowed: player.allowedcells,
      owned: player.ownCells,
      RowCol: [Game.cols, Game.rows]
    },
    position: player.position,
    colors: player.palette,
    admin: player.name == "a"
  }
}

// this can be put client side
const alertEnd = () => {
  this.socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};
