const Player = require('./player/Player');
const Pokedex = require('../../datadev/pokedex/pokedex.min');

module.exports = function listenLogin(socket, Game) {
  socket.on("username", userName => {
    checkUsername({ userName, socket }, Game);
  });
}

async function checkUsername(context, Game) {
  const { socket, userName } = context;
  const { Database } = Game;
  const userInDb = await Database.isUserNameInDb(userName);
  Object.assign(context, { userInDb });
  askPassword(context, Game);
}

function askPassword(context, Game) {
  const { socket, userInDb } = context;
  socket.emit("askPass", !userInDb.exists);
  socket.on("password", password => {
    Object.assign(context, { password });
    checkPassword(context, Game);
  });
};

function checkPassword(context, Game) {
  isPasswordWrong(context) ?
    alertWrongPass(context.socket) :
    logUser(context, Game);
}

async function logUser(context, Game) {
  const { socket, userInDb } = context;
  socket.emit('loginSuccess', !userInDb.exists);
  Game.onLoginSucess(socket, context)
}

const isPasswordWrong = ({ password, userInDb }) => {
  return userInDb.exists && userInDb.creds.Password !== password;
};

function alertWrongPass(socket) {
  socket.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");
};
