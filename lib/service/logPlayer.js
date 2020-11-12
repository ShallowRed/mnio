const Player = require('../player/Player');
const Pokedex = require('../pokedex/pokedex.min');

module.exports = function logPlayer(socket) {
  const context = { network: this, socket };

  socket.on("username", checkUsername.bind(context));
}

async function checkUsername(userName) {
  const { socket, network } = this, { Database } = network;
  const userInDb = await Database.isUserNameInDb(userName);

  askPassword.call({ socket, network, userInDb })
}

function askPassword() {
  const { socket, userInDb } = this;

  socket.emit("askPass", !userInDb.exists);
  socket.on("password", checkPassword.bind(this));
}

function checkPassword(input) {
  isPasswordWrong(input, this.userInDb) ?
    alertWrongPass.call(this.socket) :
    initPlayer.call(this, input)
}

const isPasswordWrong = ([name, password], userInDb) => {
  return userInDb.exists && userInDb.creds.Password !== password;
};

function alertWrongPass() {
  this.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");
};

async function initPlayer(creds) {
  const { socket, network: { Database }, userInDb } = this;
  const [userName, password] = creds;

  socket.emit('isNew', !userInDb.exists);
  if (userInDb.exists) {
    const { playerid } = userInDb.creds;
    const deeds = await Database.getPlayerDeeds(playerid);
    spawnPlayer.call(this, { playerid, userName }, deeds);
    return;
  }
  socket.on("paletteSelected", setPaletteAndSpawn.bind(this, creds));
}

async function setPaletteAndSpawn([userName, password], index) {
  const { socket, network: { Database, Game: { gridState } } } = this;
  const position = randomPosition(gridState);

  if (position == 'end') {
    alertEnd.call({ socket });
    return;
  }
  const playerid = await Database.saveNewPlayer(userName, password);
  const palette = Pokedex[index];
  spawnPlayer.call(this, { playerid, userName }, { palette, position })
}

function spawnPlayer(ids, deeds) {
  const { socket, network } = this, { Game } = network, { rows, cols } = Game;

  const player = new Player(ids, deeds, { rows, cols });
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

const randomPosition = list => {
  const emptyCells = list.map(isNull)
    .filter(isNotNull);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const isNull = (e, i) =>
  !e ? i : null;

const isNotNull = e =>
  e !== null;

const alertEnd = () => {
  this.socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};
