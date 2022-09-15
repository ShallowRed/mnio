import gameButtons from 'game/components/buttons';

export default {

	"SELECT_COLOR": function (index) {

		this.player.setColor(index);

		gameButtons.focusColorBtn(index);
	},

	"MOVE_ATTEMPT": function (direction) {

		if (
			this.flags.waitingServerConfirmMove ||
			this.flags.isTranslating ||
			this.flags.isStamping ||
			this.flags.isFilling ||
			this.flags.isZooming
		) return;

		this.socket.emit('MOVE', direction);

		const nextPosition = this.map.checkMove(this.player, direction);

		if (nextPosition) {

			this.emit("MOVE_SELF", nextPosition, direction);

		} else {

			this.player.bumpAnimation(direction);
		}
	},

	"MOVE_SELF": function (position, direction) {

		this.flags.waitingServerConfirmMove = true;

		this.flags.isTranslating = true;

		this.updateState(position, direction);

		this.map.translateCanvas(this.durations.translation * 0.9);

		this.animationTimeout(() => {

			this.map.render();

			this.flags.isTranslating = false;

		}, this.durations.translation);

		this.player.render();

		this.players.render();
	},

	"NEW_SELF_POSITION": function (newPosition) {

		this.flags.waitingServerConfirmMove = false;

		if (newPosition !== this.player.position) {

			this.emit("MOVE_SELF", newPosition);
		}
	},

	"NEW_POSITION": function ({ userId, from: lastPosition, to: newPosition }) {

		if (!newPosition) {

			this.players.remove(userId);

		} else if (!lastPosition) {

			this.players.create({ userId, position: newPosition });

		} else if (
			newPosition &&
			newPosition !== this.player.position &&
			newPosition !== this.player.lastPosition
		) {

			const player = this.players.get(userId);

			if (!player) {

				this.players.create({ userId, position: newPosition });

			} else {

				player.updatePosition(newPosition);

				player.updateCoordsInView();

				if (!this.map.areCoordsInView(player.coordsInView)) {

					this.players.remove(userId);

				} else {

					player.render();
				}
			}
		}
	},

	"FILL_ATTEMPT": function () {

		if (
			!this.flags.waitingServerConfirmFill &&
			!this.flags.isFilling
		) {

			this.emit("FILL_SELF_CELL", this.player.position);
		}
	},

	"FILL_SELF_CELL": function (position) {

		if (!this.player.ownCells.includes(position)) {

			this.player.ownCells.push(position);
		}

		this.fillAnimation(position, this.player.selectedColor);

		const color = this.player.selectedColor.substring(1);

		this.map.gridState[position] = color;

		this.socket.emit("FILL", { position, color });

		this.flags.waitingServerConfirmFill = true;

		this.player.stampAnimation();
	},

	"NEW_CONFIRM_FILL": function () {

		this.flags.waitingServerConfirmFill = false;
	},

	"NEW_FILL": function ({ userId, position, color }) {

		const player = this.players.get(userId);

		if (player) {

			player.setColor(color);

			player.stampAnimation();
		}

		this.map.gridState[position] = color;

		// this.fillAnimation(position, `#${color}`);

		this.map.renderCell(position, `#${color}`);
	},

	"NEW_SELF_ALLOWED_CELLS": function (cells) {

		cells.forEach(position => {

			if (this.player.allowedCells.includes(position)) return;

			this.player.allowedCells.push(position);

			this.map.renderCell(position, this.map.allowedColor);
		});
	},

	"ZOOM_ATTEMPT": function (direction) {

		if (
			!this.flags.isZooming &&
			!this.flags.isTranslating &&
			this.map.isZoomable(direction)
		) this.emit("ZOOM", direction);
	},

	"ZOOM": function (direction) {

		this.flags.isZooming = true;

		this.map.incrementMaxCoordsInView(direction);

		this.updateState();

		this.map.zoom(this.durations.zoom * 0.9);

		this.player.render();

		this.players.render();

		this.animationTimeout(() => {

			this.map.render();

			if (this.flags.zoomBtnPressed) {

				this.animationTimeout(() => {

					this.flags.isZooming = false;

					this.emit("ZOOM_ATTEMPT", direction);

				}, 30);

			} else {

				this.flags.isZooming = false;
			}

		}, this.durations.zoom);
	},
}