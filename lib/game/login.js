const Player = require('./player/Player');
const Pokedex = require('../../datadev/pokedex/pokedex.min');

module.exports = function listenLogin(socket, network) {
  socket.on("username", userName => {
    console.log("userName :", userName);
    checkUsername({ userName, socket }, network);
  });
}

async function checkUsername(context, network) {
  const { socket, userName } = context;
  const { Database } = network;
  const userInDb = await Database.isUserNameInDb(userName);
  askPassword(Object.assign(context, { userInDb }), network);
}

function askPassword(context, network) {
  const { socket, userInDb } = context;
  socket.emit("askPass", !userInDb.exists);
  socket.on("password", password => {
    checkPassword(Object.assign(context, { password }), network);
  });
};

function checkPassword(context, network) {
  isPasswordWrong(context) ?
    alertWrongPass(context.socket) :
    network.logUser(context);
}

const isPasswordWrong = ({ password, userInDb }) => {
  return userInDb.exists && userInDb.creds.Password !== password;
};

function alertWrongPass(socket) {
  socket.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");
};
