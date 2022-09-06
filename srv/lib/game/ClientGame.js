import Debug from '#debug';
import { Tables } from '#database/tables';

const debug = Debug('game:clientGame');

export default class ClientGame {

	constructor(socket, player, map, database) {

		this.socket = socket;
		this.player = player;
		this.map = map;
		this.database = database;

		this.spawnPlayer();
		this.listenGameEvents();
	}

	spawnPlayer() {

		this.socket.emit('initGame', this.initialData);

		this.socket.broadcast.emit("newPosition", [null, this.player.position]);

		this.map.newPosition([null, this.player.position]);
	}

	get initialData() {

		return {
			Game: {
				colors: this.map.gridState,
				positions: this.map.playersPositions,
				rows: this.map.rows,
				cols: this.map.cols,
				owned: this.player.ownCells,
				allowed: this.player.allowedCells
			},
			Player: {
				position: this.player.position,
				palette: this.player.palette,
				admin: this.player.name == "a"
			}
		}
	}

	listenGameEvents() {

		this.socket.on('move', direction => {

			const newPosition = this.checkMove(direction, this.player, this.map);

			if (newPosition) {

				this.socket.emit("newPlayerPos", newPosition);

				this.socket.broadcast.emit("newPosition", [this.player.position, newPosition]);

				this.map.newPosition([this.player.position, newPosition]);

				this.player.position = newPosition;
			}
		});

		this.socket.on('fill', cell => {

			Tables.get("grid").insert({
				playerid: this.player.playerid,
				cellid: cell.position,
				color: cell.color
			});

			this.map.saveFill(cell);

			this.socket.broadcast.emit('newFill', cell);

			const hasOwnedCellsBeenUpdated = this.player.updateOwnedCells(cell.position);

			if (hasOwnedCellsBeenUpdated) {
				this.player.updateAllowedCells();
				this.socket.emit('allowedCells', this.player.allowedCells);
			}

			this.socket.emit('confirmFill');
		});

		this.socket.on('disconnect', () => {

			debug('Player left:', this.player.playerid);

			if (this.player.position) {

				this.map.newPosition([this.player.position, null]);

				this.socket.broadcast.emit("newPosition", [this.player.position, null])
			}
		});
	}

	checkMove(direction) {

		let [x, y] = this.map.indexToCoords(this.player.position);

		if (direction == "left" && x !== 0) {

			x--;

		} else if (direction == "right" && x !== this.map.cols - 1) {

			x++;

		} else if (direction == "up" && y !== 0) {

			y--;

		} else if (direction == "down" && y !== this.map.rows - 1) {

			y++;

		} else {

			return;
		}

		const targetPosition = this.map.coordsToIndex([x, y]);

		if (this.player.ownCells.includes(targetPosition) || (
			this.player.allowedCells.includes(targetPosition) &&
			!this.map.playersPositions.includes(targetPosition) &&
			!this.map.gridState[targetPosition]
		)) {

			return targetPosition;
		}
	}
};
