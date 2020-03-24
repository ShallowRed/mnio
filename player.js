class Player {
  constructor(socket, playerpos, rdmrow, rdmcol, rdmcolor) {
    this.id = socket.id;
    this.playerpos = playerpos;
    this.x = rdmrow;
    this.y = rdmcol;
    this.color = rdmcolor; /* Players start with 2 gold coins */
    this.owncells = [];
  }
}

module.exports = Player;
