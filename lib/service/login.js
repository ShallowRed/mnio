const Player = require('../player/Player');
const Pokedex = require('../pokedex/pokedex.min');

module.exports = function logPlayer(socket, network) {
  socket.on("username", userName => {
    checkUsername(userName, socket, network);
  });
}

async function checkUsername(userName, socket, network) {
  const { Database } = network;
  const userInDb = await Database.isUserNameInDb(userName);
  const context = { socket, network, userName, userInDb };
  askPassword(context)
}

function askPassword(context) {
  const { socket, userInDb } = context;
  socket.emit("askPass", !userInDb.exists);
  socket.on("password", password => {
    checkPassword(password, context);
  });
};

function checkPassword(password, context) {
  const { socket, userInDb } = context;
  isPasswordWrong(password, userInDb) ?
    alertWrongPass(socket) :
    initPlayer(password, context)
}

const isPasswordWrong = (password, userInDb) => {
  return userInDb.exists && userInDb.creds.Password !== password;
};

function alertWrongPass(socket) {
  socket.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");
};

async function initPlayer(password, context) {
  const { socket, userName, userInDb, network: { Game } } = context;
  socket.emit('loginSuccess', !userInDb.exists);
  userInDb.exists ?
    returningPlayer(context) :
    !Game.hasAvailableSpace() ?
    alertEnd(socket) :
    socket.on("paletteSelected", index => {
      newPlayer(index, context, { userName, password })
    });
}

async function returningPlayer(context) {
  const { userInDb, userName, network: { Database } } = context;
  const { playerid } = userInDb.creds;
  console.log("Player back :", playerid);
  const palette = await Database.getPlayerPalette(playerid);
  const ownCells = await Database.getPlayerOwnCells(playerid);
  spawnPlayer(context, { playerid, userName, palette, ownCells });
}

async function newPlayer(index, context, { userName, password }) {
  const { socket, network: { Database, Game: { gridState } } } = context;
  const playerid = await Database.saveCredentials(userName, password);
  const palette = await Database.savePlayerPalette(playerid, index);
  console.log("New player :", playerid);
  spawnPlayer(context, { playerid, userName, palette })
}

function spawnPlayer(context, props) {
  const { socket, network } = context, { Game } = network;
  const player = new Player(props, Game);

  network.players[socket.request.sessionId] = player;
};

// this can be put client side
const alertEnd = socket => {
  socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};
