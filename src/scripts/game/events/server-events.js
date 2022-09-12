export default function listenServerEvents() {

	this.socket.on("NEW_PLAYER_POSITION", (newPosition) => {

		this.flags.waitingServerConfirmMove = false;

		if (newPosition !== this.player.position) {

			this.emit("MOVE_PLAYER", newPosition);
		}
	});

	this.socket.on("NEW_POSITION", ({ from: lastPosition, to: newPosition }) => {

		if (lastPosition) {

			this.map.playersPositions.splice(this.map.playersPositions.indexOf(lastPosition), 1);

			this.map.clearCell(lastPosition, this.map.positionsContext);
		}

		if (newPosition) {

			this.map.playersPositions.push(newPosition);

			this.map.renderPosition(newPosition);
		}
	});

	this.socket.on("NEW_FILL", ({ position, color }) => {

		this.map.gridState[position] = color;

		this.renderCell(position, this.map.colorsCtx, `#${color}`);
	});

	this.socket.on("ALLOWED_CELLS", (cells) => {

		cells.forEach(position => {

			if (this.player.allowedCells.includes(position)) return;

			this.player.allowedCells.push(position);

			if (!this.flags.isTranslating) {

				this.map.renderCell(position, this.map.allowedCtx, this.map.allowedCellsColor);
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