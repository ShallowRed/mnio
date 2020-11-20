module.exports = function listenLogin(socket, Game) {
  socket.on("username", userName => {
    checkUsername(socket, userName, Game);
  });
}

const checkUsername = async (socket, userName, Game) => {
  const userInDb = await Game.Database.isUserNameInDb(userName);
  askPassword(socket, { userName, userInDb }, Game);
}

const askPassword = (socket, { userName, userInDb }, Game) => {
  socket.emit("askPass", !userInDb.exists);
  socket.on("password", password => {
    checkPassword(socket, { userName, userInDb, password }, Game);
  });
};

const checkPassword = (socket, { userName, userInDb, password }, Game) => {
  userInDb.exists && isPasswordWrong(password, userInDb) ?
    alertWrongPass(socket) :
    logUser(socket, { userName, userInDb, password }, Game);
}

const logUser = (socket, { userName, userInDb, password }, Game) => {
  socket.emit('loginSuccess', !userInDb.exists);
  Game.loginSucess(socket, { userName, userInDb, password })
}

const isPasswordWrong  = (password, { creds }) => {
  creds.Password !== password;
};

const alertWrongPass = socket => {
  socket.emit("alert", "Mot de passe incorrect pour ce nom d'utilisateur");
};
