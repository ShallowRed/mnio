import gameButtons from 'game/components/buttons';

export default function listenClickEvents() {
	
	gameButtons.colorBtns.forEach((colorBtn, i) => {

		colorBtn.style.background = this.player.palette[i];

		colorBtn.addEventListener("mousedown", () => {

			this.selectColor(i);
		});

		colorBtn.addEventListener("mouseup", () => {

			if (this.flags.isTranslating || this.flags.isZooming) return;

			this.fill();
		});

		colorBtn.addEventListener("touchstart", (event) => {

			event.preventDefault();

			this.selectColor(i);
		});

		colorBtn.addEventListener("touchend", (event) => {

			event.preventDefault();

			if (this.flags.isTranslating || this.flags.isZooming) return;

			this.fill();
		});
	});

	for (const [direction, zoomBtn] of Object.entries(gameButtons.zoomBtns)) {

		zoomBtn.addEventListener("click", () => {

			this.zoom(direction);
		});

		zoomBtn.addEventListener("touchstart", (event) => {

			event.preventDefault();

			this.zoom(direction);
		});
	}

	document.addEventListener('click', () => {

		if (document.activeElement.toString() == '[object HTMLButtonElement]') {

			document.activeElement.blur();
		}
	});
}
