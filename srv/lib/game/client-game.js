import Debug from '#config/debug';
const debug = Debug('game     |');

export default class ClientGame {

	constructor(socket, player, game) {

		this.socket = socket;

		this.player = player;

		this.game = game;
	}

	get initialData() {

		return {
			map: {
				gridState: this.game.map.gridState,
				rows: this.game.map.rows,
				cols: this.game.map.cols,
			},
			players: this.game.players.getConnectedEnnemies(this.player),
			player: {
				ownCells: this.player.ownCells,
				allowedCells: this.player.allowedCells,
				position: this.player.position,
				palette: this.player.palette,
			}
		}
	}

	spawnPlayer() {

		this.player.connected = true;

		this.socket.emit('INIT_GAME', this.initialData);

		this.socket.broadcast.emit("NEW_POSITION", {
			userId: this.player.userId,
			from: null,
			to: this.player.position
		});
	}

	listenGameEvents() {

		this.socket.on('MOVE', direction => {

			const newPosition = this.game.map.checkMove(this.player, direction);

			if (newPosition) {

				this.socket.emit("NEW_SELF_POSITION", newPosition);

				this.socket.broadcast.emit("NEW_POSITION", {
					userId: this.player.userId,
					from: this.player.position,
					to: newPosition
				});

				this.player.position = newPosition;
			}
		});

		this.socket.on('FILL', ({ position, color }) => {

			const userId = this.player.userId;

			this.game.tables.get("gridEvents").insert({
				userId,
				cellid: position,
				color
			});

			this.game.map.saveFill({ position, color });

			this.socket.broadcast.emit('NEW_FILL', { userId, position, color });

			if (!this.player.ownCells.includes(position)) {

				this.player.ownCells.push(position);

				this.player.updateAllowedCells(this.game.map);

				this.socket.emit('NEW_SELF_ALLOWED_CELLS', this.player.allowedCells);
			}

			this.socket.emit('NEW_CONFIRM_FILL');
		});

		this.socket.on('disconnect', () => {

			debug(`User with userId '${this.player.userId}' disconnected`);

			this.player.connected = false;

			this.socket.broadcast.emit("NEW_POSITION", {
				userId: this.player.userId,
				from: this.player.position,
				to: null
			});
		});
	}
};
