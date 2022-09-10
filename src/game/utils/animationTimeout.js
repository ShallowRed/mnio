export default function animationTimeout(game, callback, start = Date.now(), delay = game.duration) {

	const delta = (Date.now() - start) / 1000;

	if (game.flags.fill) {

		delay += 0.015;
	}

	if (delta >= delay) {

		callback();

		return;
	}

	window.requestAnimationFrame(() => {

		animationTimeout(game, callback, start, delay)
	});
}