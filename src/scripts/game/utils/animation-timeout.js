export default function animationTimeout(callback, delay, start = Date.now()) {

	const delta = Date.now() - start;

	if (delta >= delay) {

		callback();

		return;
	}

	window.requestAnimationFrame(() => {

		this.animationTimeout(callback, delay, start)
	});
}