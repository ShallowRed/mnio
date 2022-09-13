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
				playersPositions: this.game.map.playersPositions.filter(
					position => position !== this.player.position
				),
				rows: this.game.map.rows,
				cols: this.game.map.cols,
			},
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

		this.movePlayer({ from: null, to: this.player.position });
	}

	listenGameEvents() {

		this.socket.on('MOVE', direction => {

			const newPosition = this.game.map.checkMove(this.player, direction);

			if (newPosition) {

				this.movePlayer({ from: this.player.position, to: newPosition });

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

				this.movePlayer({ from: this.player.position, to: null });
			}
		});
	}


	movePlayer({ from, to }) {

		// todo no need to send to socket if disconnected
		// maybe neither on spawn

		this.socket.emit("NEW_PLAYER_POSITION", to);

		this.socket.broadcast.emit("NEW_POSITION", { from, to });

		this.game.map.newPosition({ from, to });
	}

	checkMove(direction) {

		let [x, y] = this.game.map.indexToCoords(this.player.position);

		if (direction == "left" && x !== 0) {

			x--;

		} else if (direction == "right" && x !== this.game.map.cols - 1) {

			x++;

		} else if (direction == "up" && y !== 0) {

			y--;

		} else if (direction == "down" && y !== this.game.map.rows - 1) {

			y++;

		} else {

			return;
		}

		const targetPosition = this.game.map.coordsToIndex([x, y]);

		if (this.player.ownCells.includes(targetPosition) || (
			this.player.allowedCells.includes(targetPosition) &&
			!this.game.map.playersPositions.includes(targetPosition) &&
			!this.game.map.gridState[targetPosition]
		)) {

			return targetPosition;
		}
	}
};
