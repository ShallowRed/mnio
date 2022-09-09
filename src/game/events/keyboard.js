let isAltPressed = false;

export default (game) => {
	document.addEventListener('keydown', event => {

		if (event.code == "AltLeft") {

			isAltPressed = true;
		}

		if (
			game.flag.isTranslating ||
			game.flag.waitingServerConfirmMove
		) return;

		onKeyDown(event, game)
	});

	document.addEventListener('keyup', event => {

		if (event.code == "AltLeft") {

			isAltPressed = false;
		}
	});
};

const onKeyDown = (event, game) => {

	switch (event.code) {

		case "Space":

			document.querySelector(".pressed")

			focusBtn(".pressed");

			game.fill();

			break;

		case "KeyW":

			focusBtn(game.Ui.zoomBtns.in);

			game.zoom("in");

			break;

		case "KeyS":

			if (isAltPressed) {

				focusBtn(game.Ui.zoomBtns.out);

				game.zoom("out");
			}

			break;

		case "ControlLeft":

			game.selectColor("next");

			break;

		case "ShiftLeft":

			game.selectColor("prev");

			break;

		case "ArrowLeft":

			game.moveAttempt("left");

			break;

		case "ArrowUp":

			game.moveAttempt("up");

			break;

		case "ArrowRight":

			game.moveAttempt("right");

			break;

		case "ArrowDown":

			game.moveAttempt("down");

			break;
	}
};

const focusBtn = (btn) => {

	if (typeof btn == "string") {

		btn = document.querySelector(btn);
	}
	
	btn.focus();
	
	setTimeout(() => {
	
		document.activeElement.blur();
	
	}, 200);
};
