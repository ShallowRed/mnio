let isMetaPressed = false;

export default function listenKeyboardEvents() {

	document.addEventListener('keydown', event => {

		// detect if cmd on mac is pressed
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

		onKeyDown.call(this, event)
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

			this.fill();

			break;

		case "Enter":

			this.fill();

			break;

		case "ArrowLeft":

			this.moveAttempt("left");

			break;

		case "ArrowRight":

			this.moveAttempt("right");

			break;

		case "ArrowUp":

			if (isMetaPressed) {

				this.selectColor("prev");

			} else {


				this.moveAttempt("up");
			}

			break;

		case "ArrowDown":

			if (isMetaPressed) {

				this.selectColor("next");

			} else {


				this.moveAttempt("down");
			}

			break;
	}
}