const { query, sQuery } = require('./mysql');
const Pokedex = require('./pokedex.js');

// class PlayerDatabase {

// 	constructor(gameid, playerid) {

// 		this.gameid = gameid;

// 		this.playerid = playerid;
// 	}

// 	async savePlayerPalette(index) {

// 		query("savePlayerPalette", [this.gameid, this.playerid, index]);

// 		return Pokedex[index];
// 	}

// 	async getPlayerPalette() {

// 		const index = await sQuery("getPlayerPalette", [this.gameid, this.playerid]);

// 		return Pokedex[index[0].paletteid]
// 	}

// 	async getPlayerOwnCells() {

// 		const ownCells = await sQuery("getPlayerOwnCells", [this.gameid, this.playerid]);

// 		if (ownCells && ownCells.length) {

// 			return ownCells.map(({ cellid }) => cellid);
// 		}
// 	}

// 	async saveFill({ position, color }) {

// 		console.log('Player fill :', this.playerid);

// 		query("saveFill", [this.gameid, this.playerid, position, color]);

// 		return;
// 	}
// };

class GameDatabase {

	constructor(gameid) {

		this.gameid = gameid;

		// this.playerDatabase = class extends PlayerDatabase {

		// 	constructor(playerid) {

		// 		super(gameid, playerid);
		// 	}
		// }
	}

	async isUserNameInDb(userName) {

		const userInDb = await sQuery("isUserNameInDb", [this.gameid, userName]);

		const exists = !!userInDb.length;

		return { exists, creds: exists ? userInDb[0] : null }
	}

	async saveCredentials({ userName, password }) {

		const { insertId } = await sQuery("saveCredentials", [this.gameid, userName, password]);

		return insertId;
	}

	async savePlayerPalette(playerid, index) {

		query("savePlayerPalette", [this.gameid, playerid, index]);

		return Pokedex[index];
	}

	async getPlayerPalette(playerid) {

		const index = await sQuery("getPlayerPalette", [this.gameid, playerid]);

		return Pokedex[index[0].paletteid]
	}

	async getPlayerOwnCells(playerid) {

		const ownCells = await sQuery("getPlayerOwnCells", [this.gameid, playerid]);

		if (ownCells && ownCells.length) {

			return ownCells.map(({ cellid }) => cellid);
		}
	}

	async saveFill(playerid, { position, color }) {

		console.log('Player fill :', playerid);

		query("saveFill", [this.gameid, playerid, position, color]);

		return;
	}
};

module.exports = {
	GameDatabase,
}