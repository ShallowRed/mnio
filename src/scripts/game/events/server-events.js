export default function listenServerEvents() {

	this.socket.on("NEW_PLAYER_POSITION", (newPosition) => {

		this.flags.waitingServerConfirmMove = false;

		if (newPosition !== this.player.position) {

			this.emit("MOVE_PLAYER", newPosition);
		}
	});

	this.socket.on("NEW_POSITION", ({ id, from: lastPosition, to: newPosition }) => {

		if (!newPosition) {

			this.players.remove(id);

		} else if (!lastPosition) {

			this.players.create({ id, position: newPosition });

		} else if (
			newPosition &&
			newPosition !== this.player.position &&
			newPosition !== this.player.lastPosition
		) {

			const player = this.players.get(id);

			if (!player) {

				this.players.create({ id, position: newPosition });

			} else {

				player.updatePosition(newPosition);

				player.updateCoordsInView();

				if (!this.map.areCoordsInView(player.coordsInView)) {

					this.players.remove(id);

				} else {

					player.render();
				}
			}
		}
	});

	this.socket.on("NEW_FILL", ({ id, position, color }) => {

		const player = this.players.get(id);

		if (player) {

			player.setColor(color);

			player.stampAnimation();
		}

		this.map.gridState[position] = color;

		this.map.renderCell(position, `#${color}`);
	});

	this.socket.on("ALLOWED_CELLS", (cells) => {

		cells.forEach(position => {

			if (this.player.allowedCells.includes(position)) return;

			this.player.allowedCells.push(position);

			if (!this.flags.isTranslating) {

				this.map.renderCell(position, this.map.allowedColor);
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