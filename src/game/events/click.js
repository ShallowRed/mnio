export default function listenClickEvents(game) {
	
	const { flags, Ui } = game;

	Ui.colorBtns.forEach((colorBtn, i) => {

		colorBtn.style.background = game.player.palette[i];

		colorBtn.addEventListener("mousedown", () => {

			game.selectColor(i);
		});

		colorBtn.addEventListener("mouseup", () => {

			if (flags.isTranslating || flags.isZooming) return;

			game.fill();
		});

		colorBtn.addEventListener("touchstart", (event) => {

			event.preventDefault();

			game.selectColor(i);
		});

		colorBtn.addEventListener("touchend", (event) => {

			event.preventDefault();

			if (flags.isTranslating || flags.isZooming) return;

			game.fill();
		});
	});

	for (const [direction, zoomBtn] of Object.entries(Ui.zoomBtns)) {

		zoomBtn.addEventListener("click", () => {

			game.zoom(direction);
		});

		zoomBtn.addEventListener("touchstart", (event) => {

			event.preventDefault();

			game.zoom(direction);
		});
	}

	document.addEventListener('click', () => {

		if (document.activeElement.toString() == '[object HTMLButtonElement]') {

			document.activeElement.blur();
		}
	});
}
