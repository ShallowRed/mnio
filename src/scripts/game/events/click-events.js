import gameButtons from 'game/components/buttons';

export default function listenClickEvents() {
	
	gameButtons.colorBtns.forEach((colorBtn, i) => {

		colorBtn.style.background = this.player.palette[i];

		colorBtn.addEventListener("mousedown", () => {

			this.emit("SELECT_COLOR", i);
		});

		colorBtn.addEventListener("mouseup", () => {

			if (this.flags.isTranslating || this.flags.isZooming) return;

			this.emit("FILL_ATTEMPT");
		});

		colorBtn.addEventListener("touchstart", (event) => {

			event.preventDefault();

			this.emit("SELECT_COLOR", i);
		});

		colorBtn.addEventListener("touchend", (event) => {

			event.preventDefault();

			if (this.flags.isTranslating || this.flags.isZooming) return;

			this.emit("FILL_ATTEMPT");
		});
	});

	for (const [direction, zoomBtn] of Object.entries(gameButtons.zoomBtns)) {

		zoomBtn.addEventListener("click", () => {

			this.emit("ZOOM", direction);
		});

		zoomBtn.addEventListener("touchstart", (event) => {

			event.preventDefault();

			this.emit("ZOOM", direction);
		});
	}

	document.addEventListener('click', () => {

		if (document.activeElement.toString() == '[object HTMLButtonElement]') {

			document.activeElement.blur();
		}
	});
}
