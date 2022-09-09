export default (Game) => {
	for (const [eventName, callback] of serverEvents) {
		Game.socket.on(eventName, (data) =>
			callback(Game, data)
		);
	}
}

const serverEvents = Object.entries({

	NEW_PLAYER_POSITION(Game, newPosition) {
		Game.flag.waitingServerConfirmMove = false;
		if (newPosition !== Game.Player.position)
			Game.movePlayer(newPosition);
	},

	NEW_POSITION({ positions, Cell }, {from: lastPosition, to: newPosition}) {
		lastPosition && (
			positions.splice(positions.indexOf(lastPosition), 1),
			Cell.render.clear(lastPosition)
		);
		newPos && (
			positions.push(newPosition),
			Cell.render.position(newPosition)
		)
	},

	NEW_FILL({ colors, Cell }, { position, color }) {
		colors[position] = color;
		Cell.render.color(position);
	},

	ALLOWED_CELLS({ allowed, Cell, flag }, cells) {
		cells.forEach(position => {
			if (allowed.includes(position)) return;
			allowed.push(position);
			if (!flag.isTranslating)
				Cell.render.allowed(position);
		});
	},

	CONFIRM_FILL({ flag }) {
		flag.waitingServerConfirmFill = false;
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
