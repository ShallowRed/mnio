const Player = require('./player/Player');

module.exports = class Sessions {
  constructor() {
    this.players = {};
  }

  set(socket, data) {
    this.players[socket.request.sessionId] = data;
  }

  get(socket) {
    return this.players[socket.request.sessionId];
  }

  setCredentials(socket, credentials) {
    this.set(socket, credentials);
  }

  async setNewPlayer(socket, index, network) {
    const credentials = this.get(socket);
    const player = await Player.createNew(index, credentials, network);
    this.set(socket, player);
  }

  async setExistingPlayer(socket, credentials, network) {
    const player = await Player.getExisting(credentials, network);
    this.set(socket, player);
  }
}
