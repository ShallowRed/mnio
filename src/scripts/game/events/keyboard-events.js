let isMetaPressed = false;

export default function listenKeyboardEvents() {

	document.addEventListener('keydown', event => {

		if (
			event.code === 'MetaLeft' ||
			event.code === 'MetaRight' ||
			event.code === 'AltLeft' ||
			event.code === 'AltRight' ||
			event.code === 'ControlLeft' ||
			event.code === 'ControlRight'
		) {

			isMetaPressed = true;

			return;
		}

		if (
			this.flags.isTranslating ||
			this.flags.waitingServerConfirmMove
		) return;

		onKeyDown.call(this, event);
	});

	document.addEventListener('keyup', event => {

		if (
			event.code === 'MetaLeft' ||
			event.code === 'MetaRight' ||
			event.code === 'AltLeft' ||
			event.code === 'AltRight' ||
			event.code === 'ControlLeft' ||
			event.code === 'ControlRight'
		) {

			isMetaPressed = false;

			return;
		}
	});
}

function onKeyDown(event) {

	switch (event.code) {

		case "Space":

			this.emit("FILL_ATTEMPT");

			break;

		case "Enter":

			this.emit("FILL_ATTEMPT");

			break;

		case "ArrowLeft":

			this.emit("MOVE_ATTEMPT", "left");

			break;

		case "ArrowRight":

			this.emit("MOVE_ATTEMPT", "right");

			break;

		case "ArrowUp":

			if (isMetaPressed) {

				const length = this.player.palette.length;

				const index = (length + this.player.selectedColorIndex - 1) % length;

				this.emit("SELECT_COLOR", index);

			} else {

				this.emit("MOVE_ATTEMPT", "up");
			}

			break;

		case "ArrowDown":

			if (isMetaPressed) {

				const length = this.player.palette.length;

				const index = (length + this.player.selectedColorIndex + 1) % length;

				this.emit("SELECT_COLOR", index);

			} else {


				this.emit("MOVE_ATTEMPT", "down");
			}

			break;
	}
}