import { Tables } from '#database/tables';

import Debug from '#debug';
const debug = Debug('database:client-events');

export default  {

	async checkUsername(userName) {

		const userNameData = await Tables.get('creds')
			.select("*", { where: { "username": userName } });

		return {
			exists: Boolean(userNameData.length),
			...userNameData?.[0]
		};
	},

	async getGamePalettes() {

		if (!this._palettes) {

			const palettes = await Tables.get('pokedex')
				.select("*");

			this._palettes = palettes.map(({ paletteid, ...colors }) => {

				return {
					id: paletteid,
					colors: Object.values(colors).map(color => `#${color}`)
				};
			});
		}

		return this._palettes;
	},


	async getColors(paletteid) {

		const palettes = await this.getGamePalettes();

		return palettes
			.find(palette => palette.id === paletteid)
			.colors;
	},

	async getPlayerData(playerid) {

		const palette = await this.getPlayerPalette(playerid);

		const ownCells = await this.getPlayerOwnCells(playerid);

		return { palette, ownCells };
	},

	async getPlayerPalette(playerid) {

		const response = await Tables.get('palettes')
			.select('paletteid', { where: { "playerid": playerid } });

		const { paletteid } = response[0];

		debug('Retrieved player palette:', playerid, paletteid);

		return this.getColors(paletteid);
	},

	async getPlayerOwnCells(playerid) {

		const ownCells = await Tables.get('grid')
			.select('cellid', { where: { "playerid": playerid } });

		if (ownCells?.length) {

			return ownCells.map(({ cellid }) => cellid);
		}
	}
};