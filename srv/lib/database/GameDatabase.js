const { pool } = require('@database/connection');
const Pokedex = require('@database/pokedex.js');

const debug = require('@debug')('gameDatabase');

module.exports = class GameDatabase {

	constructor(gameid) {

		this.gameid = gameid;
	}

	async userNameData(userName) {

		const userNameData = await pool.query("isUserNameInDb", [this.gameid, userName]);

		return {
			exists: Boolean(userNameData.length),
			...userNameData?.[0]
		};
	}

	async saveCredentials({ userName, password }) {

		const { insertId } = await pool.query("saveCredentials", [this.gameid, userName, password]);

		return insertId;
	}

	async getEveryPalettes() {

		if (!this._palettes) {

			const palettes = await pool.query("getEveryPalettes");

			this._palettes = palettes.map(({ paletteid, ...colors }) => {
				
				return {
					id: paletteid,
					colors: Object.values(colors).map(color => `#${color}`)
				};
			});
		}

		return this._palettes;
	}

	async savePlayerPalette(playerid, index) {

		pool.query("savePlayerPalette", [this.gameid, playerid, index]);

		return Pokedex[index];
	}

	async getPlayerPalette(playerid) {

		const index = await pool.query("getPlayerPalette", [this.gameid, playerid]);

		return Pokedex[index[0].paletteid]
	}

	async getPlayerOwnCells(playerid) {

		const ownCells = await pool.query("getPlayerOwnCells", [this.gameid, playerid]);

		if (ownCells && ownCells.length) {

			return ownCells.map(({ cellid }) => cellid);
		}
	}

	async saveFill(playerid, { position, color }) {

		console.log('Player fill :', playerid);

		pool.query("saveFill", [this.gameid, playerid, position, color]);
	}
};