import { pool } from '#database/connection';
import Pokedex from '#database/pokedex';

import Debug from '#debug';
const debug = Debug('game:gameDatabase');

export default class GameDatabase {

	constructor(gameid) {

		this.gameid = gameid;
	}

	async userNameData(userName) {

		const userNameData = await pool.query("isUserNameInDb", [this.gameid, userName]);

		debug('userNameData :', userNameData);
		
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

	async savePlayerPalette(playerid, paletteid) {

		debug('Saving player palette :', playerid, paletteid);

		pool.query("savePlayerPalette", [this.gameid, playerid, paletteid]);

		return Pokedex[paletteid - 1];
	}

	async getPlayerPalette(playerid) {

		const response = await pool.query("getPlayerPalette", [this.gameid, playerid]);

		const { paletteid } = response[0];

		debug('Retrieved player palette:', playerid, paletteid);

		return Pokedex[paletteid  - 1];
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