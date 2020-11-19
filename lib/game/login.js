const Player = require('./player/Player');
const Pokedex = require('../../datadev/pokedex/pokedex.min');

module.exports = function listenLogin(socket, network) {
  socket.on("username", userName => {
    checkUsername({ userName, socket }, network);
  });
}

async function checkUsername(context, network) {
  const { socket, userName } = context;
  const { Database } = network;
  const userInDb = await Database.isUserNameInDb(userName);
  Object.assign(context, { userInDb });
  askPassword(context, network);
}

function askPassword(context, network) {
  const { socket, userInDb } = context;
  socket.emit("askPass", !userInDb.exists);
  socket.on("password", password => {
    Object.assign(context, { password });
    checkPassword(context, network);
  });
};

function checkPassword(context, network) {
  isPasswordWrong(context) ?
    alertWrongPass(context.socket) :
    logUser(context, network);
}

async function logUser(context, network) {
  const { socket, userInDb } = context;
  socket.emit('loginSuccess', !userInDb.exists);
  network.onLoginSucess(socket, context)
}

const isPasswordWrong = ({ password, userInDb }) => {
  return userInDb.exists && userInDb.creds.Password !== password;
};

function alertWrongPass(socket) {
  socket.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");
};
