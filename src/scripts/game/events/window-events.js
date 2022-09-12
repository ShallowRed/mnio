export default function listenWindowEvents() {

	window.addEventListener('resize', () => {

		this.render();
	});

	window.addEventListener("orientationchange", () => {

		setTimeout(() => this.render(), 500)
	});
}