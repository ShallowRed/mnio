export default function listenWindowEvents() {

	window.addEventListener('resize', this.fullRender);

	window.addEventListener("orientationchange", () => {

		setTimeout(this.fullRender, 500)
	});
}