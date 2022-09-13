const ANIMATION_DURATION = 400;
const N_STRIPES = 8;

export default function fillAnimation(position) {

	this.flags.fill = true;

	const cellSize = this.map.cellSize;

	const [cellLeft, cellTop] = this.map.getRelativeCoords(position)
		.map(coord => Math.round(coord * cellSize));

	const lineWidth = Math.floor(cellSize / N_STRIPES);

	const nSmallStripes = N_STRIPES - cellSize % N_STRIPES;

	const ctx = this.map.ctx;
	const flags = this.flags;
	const color = this.player.selectedColor;

	fillAnimationFrame();

	function fillAnimationFrame({
		prevYIndex = 0,
		prevLineX = 0,
		startDate = Date.now()
	} = {}) {

		const delay = Date.now() - startDate;

		const progress = delay * N_STRIPES / ANIMATION_DURATION;

		const yIndex = Math.trunc(progress);

		const lineX = Math.round((progress - yIndex) * cellSize);

		drawFrameStripes({
			yIndex,
			prevYIndex,
			lineX,
			prevLineX
		});

		if (delay < ANIMATION_DURATION) {

			window.requestAnimationFrame(() => {

				fillAnimationFrame({
					prevYIndex: yIndex,
					prevLineX: lineX,
					startDate
				});
			});

		} else {

			flags.fill = false;
		}
	}

	function drawFrameStripes({
		yIndex,
		prevYIndex,
		lineX,
		prevLineX
	}) {

		if (yIndex === prevYIndex) {

			drawStripe(yIndex, { from: prevLineX, to: lineX });

		} else {

			drawStripe(prevYIndex, { from: prevLineX, to: cellSize });

			for (let index = prevYIndex + 1; index < yIndex; index++) {

				drawStripe(index, { from: 0, to: cellSize });
			}

			drawStripe(yIndex, { from: 0, to: lineX });
		}

		function drawStripe(yIndex, { from, to }) {

			if (yIndex < nSmallStripes) {

				strokeStripe({
					lineWidth,
					lineY: cellSize - lineWidth * (yIndex + 0.5),
				});

			} else if (yIndex < N_STRIPES) {

				strokeStripe({
					lineWidth: lineWidth + 1,
					lineY: (lineWidth + 1) * (N_STRIPES - (yIndex + 0.5)),
				});
			}

			function strokeStripe({
				lineWidth,
				lineY,
			}) {

				ctx.lineWidth = lineWidth;

				ctx.strokeStyle = color;

				ctx.beginPath();

				ctx.moveTo(cellLeft + from, cellTop + lineY);

				ctx.lineTo(cellLeft + to, cellTop + lineY);

				ctx.stroke();
			}
		}
	}
}