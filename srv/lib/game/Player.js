const allowCells = require('./utils/allowCells');
const randomPosition = require('./utils/randomPosition');

module.exports = class PlayerConnector {

  constructor(Database, Map) {
    this.Map = () => Map;
    this.Database =  () => Database;
  }

  async getExisting({ position, playerid }) {
    const palette = await this.Database().getPlayerPalette(playerid);
    const ownCells = await this.Database().getPlayerOwnCells(playerid);
    return new Player({ playerid, palette, position, ownCells }, this.Map());
  }

  async createNew(index, creds) {
    const playerid = await this.Database().saveCredentials(creds);
    const palette = await this.Database().savePlayerPalette(playerid, index);
    return new Player({ playerid, palette }, this.Map());
  }
}

class Player {

  constructor(params, Map) {
    const { playerid, position, palette, ownCells } = params;
    this.Map = () => Map;
    console.log(!ownCells ? "New player  :" : "Player back :", playerid);
    this.playerid = playerid;
    this.palette = palette;
    this.ownCells = ownCells || [];
    this.position = position || this.ownCells[0] || this.Map().randomPosition()
    this.updateAllowedCells();
  }

  updateOwnedCells(position) {
    if (!this.ownCells.includes(position)) {
      this.ownCells.push(position);
      return true;
    }
  }

  updateAllowedCells() {
    this.allowedCells = allowCells(this.ownCells, this.Map());
  }
}
