export default function animationTimeout(callback, start = Date.now(), delay) {

	delay ??= this.duration;

	const delta = (Date.now() - start) / 1000;

	if (this.flags.fill) {

		delay += 0.015;
	}

	if (delta >= delay) {

		callback();

		return;
	}

	window.requestAnimationFrame(() => {

		this.animationTimeout(callback, start, delay)
	});
}