export default (game) => {

	for (const [eventName, callback] of serverEvents) {

		game.socket.on(eventName, (data) =>

			callback(game, data)
		);
	}
}

const serverEvents = Object.entries({

	NEW_PLAYER_POSITION(game, newPosition) {

		game.flags.waitingServerConfirmMove = false;

		if (newPosition !== game.player.position) {

			game.movePlayer(newPosition);
		}
	},

	NEW_POSITION({ playersPositions, Cell }, { from: lastPosition, to: newPosition }) {

		lastPosition && (
			playersPositions.splice(playersPositions.indexOf(lastPosition), 1),
			Cell.render.clear(lastPosition)
		);

		newPosition && (
			playersPositions.push(newPosition),
			Cell.render.position(newPosition)
		)
	},

	NEW_FILL({ gridState, Cell }, { position, color }) {

		gridState[position] = color;

		Cell.render.color(position);
	},

	ALLOWED_CELLS({ allowedCells, Cell, flags }, cells) {

		cells.forEach(position => {

			if (allowedCells.includes(position)) return;

			allowedCells.push(position);

			if (!flags.isTranslating) {

				Cell.render.allowedCells(position);
			}
		});
	},

	CONFIRM_FILL({ flags }) {

		flags.waitingServerConfirmFill = false;
	},

	reconnect_attempt: () => {

		window.location.reload(true);
	},

	error: () => {

		if (!window.isReloading) {

			window.location.reload(true);
		}
	},

	ALERT: message => {

		alert(message);
	}
});
