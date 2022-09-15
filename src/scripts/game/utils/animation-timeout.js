export default function animationTimeout(callback, delay, start = Date.now()) {

	if (Date.now() - start < delay) {

		window.requestAnimationFrame(() => {

			this.animationTimeout(callback, delay, start)
		});

	} else {

		callback();
	}
}