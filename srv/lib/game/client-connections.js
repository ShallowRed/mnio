import ClientGame from '#game/client-game';
import { Player } from '#game/players';

import Debug from '#config/debug';
const debug = Debug('game     |');

export default {

	'/palette': async function (socket) {

		socket.emit("chosePalette", this.getShuffledPalettes());
	},

	'/game': async function (socket) {

		debug(`New connection on game page with socketId '${socket.id}'`);

		let player = this.players.get(socket);

		if (player) {

			debug(`Player with socketId '${socket.id}' already in players collection`);

		} else {

			const { userId, paletteId } = this.sessionStore.get(socket, 'passport').user;

			const { palette, position, ownCells } = await this.fetchPlayerData(userId, paletteId);

			debug(`Creating new player with socketId '${socket.id}' and userId '${userId}'`);

			player = new Player({ userId, palette, position, ownCells });

			this.players.set(socket, player);
		}

		player.updateAllowedCells(this.map);

		new ClientGame(socket, player, this.map, this.tables);
	}
}