import ClientGame from '#game/client-game';

export default {

	'/palette': async function (socket) {

		socket.emit("CHOSE_PALETTE", {
			palettesLengths: this.palettesLengths,
			palettes: this.getShuffledPalettes()
		});
	},

	'/game': async function (socket, session) {
		
		const player =
			this.players.get(session.userId) ??
			await this.players.create(session);

		if (player === false) {

			socket.emit('alert', 'Il n\'y a plus de place !');

			return;
		}

		player.updateAllowedCells(this.map);

		const clientGame = new ClientGame(socket, player, this);

		clientGame.spawnPlayer();

		clientGame.listenGameEvents();
	}
}