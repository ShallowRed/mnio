export default {

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

			this.emit("MOVE_SELF", nextPosition);

		} else {

			this.player.bumpAnimation(direction);
		}
	},

	"MOVE_SELF": function (position) {

		this.flags.waitingServerConfirmMove = true;

		this.flags.isTranslating = true;

		this.player.position = position;

		this.player.updateCoordsInView();

		this.map.updateCanvasOffset();

		this.map.translate(this.durations.translationAnimation);

		this.player.translate(this.durations.translationAnimation);

		this.players.update(this.durations.translationAnimation);

		const onTranslationAnimationEnd = () => {

			this.map.translate(0);

			this.map.renderCells();

			this.flags.isTranslating = false;
		}

		this.animationTimeout(onTranslationAnimationEnd, this.durations.translationAnimation * 1.1);
	},

	"NEW_SELF_POSITION": function (newPosition) {

		this.flags.waitingServerConfirmMove = false;

		if (newPosition !== this.player.position) {

			this.emit("MOVE_SELF", newPosition);
		}
	},

	"NEW_POSITION": function ({ userId, from: lastPosition, to: newPosition }) {

		if (!newPosition) { // existing player left game

			const player = this.get(userId);

			if (player) {

				player?.sprite?.remove();

				this.players.delete(userId);
			}

		} else if (!lastPosition) { // new player spawned

			this.players.create({ userId, position: newPosition });

		} else if (newPosition) { // existing player moved

			if (
				newPosition === this.player.position &&
				newPosition === this.player.lastPosition
			) {
				console.log("Received position we shouldn't have received");
				return;
			}

			const player = this.players.get(userId);

			if (!player) {

				this.players.create({ userId, position: newPosition });

			} else {

				player.position = newPosition;

				player.update(this.durations.translationAnimation);
			}
		}
	}
}