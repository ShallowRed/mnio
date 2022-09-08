import Debug from '#config/debug';
const debug = Debug('game     |');

export default class ClientGame {

	constructor(socket, player, game) {

		this.socket = socket;

		this.player = player;
		
		this.game = game;
	}

	spawnPlayer() {

		this.socket.emit('INIT_GAME', this.initialData);

		this.socket.broadcast.emit("NEW_POSITION", [null, this.player.position]);

		this.game.map.newPosition([null, this.player.position]);
	}

	get initialData() {

		return {
			Game: {
				colors: this.game.map.gridState,
				positions: this.game.map.playersPositions,
				rows: this.game.map.rows,
				cols: this.game.map.cols,
				owned: this.player.ownCells,
				allowed: this.player.allowedCells
			},
			Player: {
				position: this.player.position,
				palette: this.player.palette,
			}
		}
	}

	listenGameEvents() {

		this.socket.on('MOVE', direction => {

			const newPosition = this.checkMove(direction);

			if (newPosition) {

				this.socket.emit("NEW_PLAYER_POSITION", newPosition);

				this.socket.broadcast.emit("NEW_POSITION", [this.player.position, newPosition]);

				this.game.map.newPosition([this.player.position, newPosition]);

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

			debug(`User with socketId '${this.socket.id}' and username ${this.player.name} disconnected`);

			if (this.player.position) {

				this.game.map.newPosition([this.player.position, null]);

				this.socket.broadcast.emit("NEW_POSITION", [this.player.position, null])
			}
		});
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
