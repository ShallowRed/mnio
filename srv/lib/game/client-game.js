import Debug from '#config/debug';
const debug = Debug('game     |');

export default class ClientGame {

	constructor(socket, player, game) {

		this.socket = socket;

		this.player = player;

		this.game = game;
	}

	get initialData() {

		const players = Object.values(this.game.players.collection)
			.filter(player => player.position !== this.player.position)
			.map(player => {
				return {
					id: player.userId,
					position: player.position
				}
			});

		return {
			map: {
				gridState: this.game.map.gridState,
				rows: this.game.map.rows,
				cols: this.game.map.cols,
			},
			players,
			player: {
				ownCells: this.player.ownCells,
				allowedCells: this.player.allowedCells,
				position: this.player.position,
				palette: this.player.palette,
			}
		}
	}

	spawnPlayer() {

		this.socket.emit('INIT_GAME', this.initialData);

		this.movePlayer({ id: this.player.userId, from: null, to: this.player.position });
	}

	listenGameEvents() {

		this.socket.on('MOVE', direction => {

			const newPosition = this.game.map.checkMove(this.player, direction);

			if (newPosition) {

				this.movePlayer({ id: this.player.userId, from: this.player.position, to: newPosition });

				this.player.position = newPosition;
			}
		});

		this.socket.on('FILL', cell => {

			this.game.tables.get("gridEvents").insert({
				userId: this.player.userId,
				cellid: cell.position,
				color: cell.color
			});

			this.game.map.saveFill(cell);

			this.socket.broadcast.emit('NEW_FILL', cell);

			if (!this.player.ownCells.includes(cell.position)) {

				this.player.ownCells.push(cell.position);

				this.player.updateAllowedCells(this.game.map);

				this.socket.emit('ALLOWED_CELLS', this.player.allowedCells);
			}

			this.socket.emit('CONFIRM_FILL');
		});

		this.socket.on('disconnect', () => {

			debug(`User with userId '${this.player.userId}' disconnected`);

			if (this.player.position) {

				this.movePlayer({ id: this.player.userId, from: this.player.position, to: null });
			}
		});
	}


	movePlayer({ id, from, to }) {

		// todo no need to send to socket if disconnected
		// maybe neither on spawn

		this.socket.emit("NEW_PLAYER_POSITION", to);

		this.socket.broadcast.emit("NEW_POSITION", { id, from, to });
	}
};
