let isAltPressed = false;

export default function listenKeyboardEvents() {

	document.addEventListener('keydown', event => {

		if (event.code == "AltLeft") {

			isAltPressed = true;
		}

		if (
			this.flags.isTranslating ||
			this.flags.waitingServerConfirmMove
		) return;

		onKeyDown.call(this, event)
	});

	document.addEventListener('keyup', event => {

		if (event.code == "AltLeft") {

			isAltPressed = false;
		}
	});
}

function onKeyDown(event) {

	switch (event.code) {

		case "Space":

			document.querySelector(".pressed")

			focusBtn(".pressed");

			this.fill();

			break;

		case "KeyW":

			focusBtn(this.Ui.zoomBtns.in);

			this.zoom("in");

			break;

		case "KeyS":

			if (isAltPressed) {

				focusBtn(this.Ui.zoomBtns.out);

				this.zoom("out");
			}

			break;

		case "ControlLeft":

			this.selectColor("next");

			break;

		case "ShiftLeft":

			this.selectColor("prev");

			break;

		case "ArrowLeft":

			this.moveAttempt("left");

			break;

		case "ArrowUp":

			this.moveAttempt("up");

			break;

		case "ArrowRight":

			this.moveAttempt("right");

			break;

		case "ArrowDown":

			this.moveAttempt("down");

			break;
	}
}

function focusBtn(btn) {

	if (typeof btn == "string") {

		btn = document.querySelector(btn);
	}

	btn.focus();

	setTimeout(() => {

		document.activeElement.blur();

	}, 200);
}