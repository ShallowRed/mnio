import gameButtons from 'game/components/buttons';

export default function listenClickEvents() {

	gameButtons.colorBtns.forEach((colorBtn, i) => {

		colorBtn.style.background = this.player.palette[i];

		colorBtn.addEventListener("mousedown", () => {

			this.emit("SELECT_COLOR", i);
		});

		colorBtn.addEventListener("mouseup", () => {

			if (
				this.flags.isTranslating ||
				this.flags.isZooming
			) return;

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

	for (const direction in gameButtons.zoomBtns) {

		const btn = gameButtons.zoomBtns[direction];

		btn.addEventListener("mousedown", () => {

			this.flags.zoomBtnPressed = true;

			this.emit("ZOOM_ATTEMPT", direction);
		});

		btn.addEventListener("touchstart", (event) => {

			event.preventDefault();

			this.flags.zoomBtnPressed = true;

			this.emit("ZOOM_ATTEMPT", direction);
		});

		btn.addEventListener("mouseup", () => {

			this.flags.zoomBtnPressed = false;
		});

		btn.addEventListener("touchend", (event) => {

			event.preventDefault();

			this.flags.zoomBtnPressed = false;
		});
	}

	document.addEventListener('click', () => {

		if (document.activeElement.toString() == '[object HTMLButtonElement]') {

			document.activeElement.blur();
		}
	});
}
