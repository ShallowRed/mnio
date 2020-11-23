module.exports = class ClientLoginConnector {

  constructor(Database) {
    this.Database = Database;
  }

  init(socket, loginSuccess) {
    return new ClientLogin(socket, this.Database, loginSuccess)
  }
}

class ClientLogin {

  constructor(socket, Database, loginSuccess) {
    this.socket = socket;
    this.Database = Database;
    this.loginSuccess = loginSuccess;
    socket.on("username", userName =>
      this.checkUsername(userName)
    );
  }

  async checkUsername(userName) {
    this.userName = userName;
    this.userInDb = await this.Database.isUserNameInDb(userName);
    this.askPassword();
  }

  askPassword() {
    this.socket.emit("askPass", !this.userInDb.exists);
    this.socket.on("password", password =>
      this.checkPassword(password)
    );
  };

  checkPassword(password) {
    this.userInDb.exists && isPasswordWrong(password, this.userInDb) ?
      this.socket.emit("wrongPass") :
      this.logUser(password);
  }

  logUser(password) {
    this.password = password;
    this.socket.emit('loginSuccess', !this.userInDb.exists);
    this.loginSuccess(this);
  }
}

const isPasswordWrong = (password, { creds }) => {
  return creds.Password !== password;
};
