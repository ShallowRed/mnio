import gameButtons from 'game/components/buttons';

export default {

	"SELECT_COLOR": function (index) {

		this.player.setColor(index);

		gameButtons.focusColorBtn(index);
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
}