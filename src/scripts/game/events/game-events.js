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
			this.flags.isZooming
		) return;

		this.socket.emit('MOVE', direction);

		const nextPosition = this.map.checkMove(this.player, direction);

		if (nextPosition) {

			this.emit("MOVE_PLAYER", nextPosition, direction);

		} else {

			this.player.bumpAnimation(direction);
		}
	},

	"MOVE_PLAYER": function (position, direction) {

		this.flags.waitingServerConfirmMove = true;

		this.flags.isTranslating = true;

		this.updateState(position, direction);

		this.map.translateCanvas(this.duration);

		this.animationTimeout(() => {

			this.map.render();

			this.flags.isTranslating = false;

		}, this.duration);

		this.player.render();

		this.players.render();
	},

	"FILL_ATTEMPT": function () {

		if (
			!this.flags.waitingServerConfirmFill &&
			!this.flags.fill
		) {

			this.emit("FILL_PLAYER_CELL", this.player.position);
		}
	},

	"FILL_PLAYER_CELL": function (position) {

		if (!this.player.ownCells.includes(position)) {

			this.player.ownCells.push(position);
		}

		this.fillAnimation(position);

		const color = this.player.selectedColor.substring(1);

		this.map.gridState[position] = color;

		this.socket.emit("FILL", { position, color });

		this.flags.waitingServerConfirmFill = true;

		this.player.stampAnimation();
	},

	"ZOOM": function (direction) {

		if (
			this.flags.isZooming ||
			this.flags.isTranslating ||
			!this.map.isZoomable(direction)
		) return;

		this.flags.isZooming = true;

		this.map.incrementMaxCoordsInView(direction);
		
		this.updateState();

		this.map.zoom(this.duration);

		this.animationTimeout(() => {

			this.map.render();

			this.flags.isZooming = false;

		}, this.duration);

		this.player.render();

		this.players.render();
	},
}