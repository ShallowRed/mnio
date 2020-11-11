const Player = require('../player/Player');
const Pokedex = require('../pokedex/pokedex.min');

module.exports = function logPlayer() {
  const { socket, network: { Database } } = this;

  socket.on("username", async userName => {
    const userInDb = await Database.isUserNameInDb(userName);
    socket.emit("askPass", !userInDb.exists);
    socket.on("password", input =>
      isPasswordWrong(input, userInDb) ?
      alertWrongPass.call({ socket }) :
      initPlayer.call(this, userInDb, input)
    );
  });
}

const isPasswordWrong = ([name, password], userInDb) => {
  return userInDb.exists && userInDb.creds.Password !== password;
};

const alertWrongPass = () => {
  this.socket.emit("alert",
    "Mot de passe incorrect pour ce nom d'utilisateur");
};

async function initPlayer(userInDb, creds) {
  const { socket, network } = this;
  const { Game } = network;
  const params = await getParams.call(this, userInDb, creds);
  const player = new Player(params);
  Game.setPlayer(socket, player);
  socket.emit('isNew', player.isNew)

  // const context = Object.assign({}, this, { player });

  player.isNew ?
    socket.on("paletteSelected", index => {
      player.palette = Pokedex[index];
      player.position = randompos(Game.gridState);
      player.position == "end" ?
        alertEnd.call({ socket }) :
        spawnPlayer.call({ network, player, socket })
    }) :
    spawnPlayer.call({ network, player, socket });
}

function spawnPlayer() {
  const { socket, player, network: { Game } } = this;
  socket.emit('initGame', getInitData.call(this));
  socket.broadcast.emit("newPosition", [null, player.position]);
  Game.newPosition([null, player.position]);
  this.network.listenGameEvents.call(this);
}

async function getParams({ exists, creds }, [userName, password], playerid,
  deeds = { palette: null, ownCells: null }) {
  const { network: { Database, Game: { gridState, gameid } } } = this;
  const params = { gridState, userName, playerid };
  if (!exists) {
    params.playerid = await Database.saveNewPlayer(userName,
      password)
  } else {
    params.playerid = creds.playerid;
    const deeds = await Database.getPlayerDeeds.call({ gameid }, creds
      .playerid);
    Object.assign(params, deeds);
  }
  return params
}

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

const randompos = list => {
  const emptyCells = list.map((e, i) => !e ? i : null)
    .filter(e => e !== null);
  if (!emptyCells.length) return "end";
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const alertEnd = () => {
  this.socket.emit("alert",
    "Il n'y a plus de cases à colorier ! Rendez-vous dans quelques jours pour voir le résultat sur mnio.fr et jouer sur une nouvelle tapisserie !"
  );
};
