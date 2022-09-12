const ANIMATION_DURATION = 400;
const N_STRIPES = 8;

export default function fillAnimation(position) {

	this.flags.fill = true;

	const [x, y] = this.map.getRelativeCoords(position)
		.map(coord => Math.round(coord * this.map.cellSize));

	const lineWidth = Math.floor(this.map.cellSize / N_STRIPES);

	const nSmallStripes = N_STRIPES - this.map.cellSize % N_STRIPES;

	const size = this.map.cellSize;
	const ctx = this.map.colorsCtx;
	const flags = this.flags;

	ctx.strokeStyle = this.player.selectedColor;

	fillAnimationFrame();

	function fillAnimationFrame({
		lastStripeIndex = 0,
		lastStripePortion = 0,
		startDate = Date.now()
	} = {}) {

		const delay = Date.now() - startDate;

		const progress = delay * N_STRIPES / ANIMATION_DURATION;

		const stripeIndex = Math.trunc(progress);

		const stripePortion = Math.round((progress - stripeIndex) * size);

		drawFrameStripes({
			lineWidth,
			stripeIndex,
			lastStripeIndex,
			stripePortion,
			lastStripePortion
		});

		if (delay < ANIMATION_DURATION) {

			window.requestAnimationFrame(() => {

				fillAnimationFrame({
					lastStripeIndex: stripeIndex,
					lastStripePortion: stripePortion,
					startDate
				});
			});

		} else {

			flags.fill = false;
		}
	}

	function drawFrameStripes({
		lineWidth,
		stripeIndex,
		lastStripeIndex,
		stripePortion,
		lastStripePortion
	}) {

		if (stripeIndex === lastStripeIndex) {

			drawStripe({ stripeIndex, startX: lastStripePortion, endX: stripePortion });

		} else {

			drawStripe({ stripeIndex: lastStripeIndex, startX: lastStripePortion, endX: size });

			for (let index = lastStripeIndex + 1; index < stripeIndex; index++) {

				drawStripe({ stripeIndex: index, startX: 0, endX: size });
			}

			drawStripe({ stripeIndex, startX: 0, endX: stripePortion });
		}

		function drawStripe({ stripeIndex, startX, endX }) {

			let posY;

			if (stripeIndex < nSmallStripes) {

				posY = size - lineWidth * (stripeIndex + 0.5);

			} else if (stripeIndex < N_STRIPES) {

				++lineWidth;

				posY = lineWidth * (N_STRIPES - stripeIndex - 0.5);

			} else return;

			ctx.lineWidth = lineWidth;

			ctx.beginPath();

			ctx.moveTo(x + startX, y + posY);

			ctx.lineTo(x + endX, y + posY);

			ctx.stroke();
		}
	}
}