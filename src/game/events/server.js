export default function listenServerEvents() {

	this.socket.on("NEW_PLAYER_POSITION", (newPosition) => {

		this.flags.waitingServerConfirmMove = false;

		if (newPosition !== this.player.position) {

			this.movePlayer(newPosition);
		}
	});

	this.socket.on("NEW_POSITION", ({ from: lastPosition, to: newPosition }) => {

		if (lastPosition) {

			this.playersPositions.splice(this.playersPositions.indexOf(lastPosition), 1);

			this.Cell.render.clear(lastPosition)
		}

		if (newPosition) {

			this.playersPositions.push(newPosition);

			this.Cell.render.position(newPosition)
		}
	});

	this.socket.on("NEW_FILL", ({ position, color }) => {

		this.gridState[position] = color;

		this.Cell.render.color(position);
	});

	this.socket.on("ALLOWED_CELLS", (cells) => {

		cells.forEach(position => {

			if (this.allowedCells.includes(position)) return;

			this.allowedCells.push(position);

			if (!this.flags.isTranslating) {

				this.Cell.render.allowedCells(position);
			}
		});
	});

	this.socket.on("CONFIRM_FILL", () => {

		this.flags.waitingServerConfirmFill = false;
	});

	this.socket.on("ALERT", message => {

		alert(message);
	});

	this.socket.on("reconnect_attempt", () => {

		window.location.reload(true);
	});

	this.socket.on("error", () => {

		if (!window.isReloading) {

			window.location.reload(true);
		}
	});
}