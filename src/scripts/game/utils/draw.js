export function square(coords, cellSize, ctx, color) {

	const [x, y] = coords.map(x => Math.round(cellSize * x));

	if (!color) {

		ctx.clearRect(x, y, cellSize, cellSize);

	} else {

		ctx.fillStyle = color;

		ctx.fillRect(x, y, cellSize, cellSize);
	}
}

export function roundSquare(coords, color, cellSize, ctx, shift) {

	const [x, y] = coords.map(x => {

		return Math.round(cellSize * x + shift * 1.5);
	});

	ctx.strokeStyle = color;

	ctx.lineWidth = shift;

	roundSquarePath(ctx, {
		left: x,
		top: y,
		size: cellSize - shift * 3,
		radius: shift
	});

	ctx.stroke();
}

function roundSquarePath(ctx, { left, top, size, radius }) {

	const right = left + size;
	const bottom = top + size;

	ctx.beginPath();

	ctx.moveTo(left + radius, top);

	ctx.lineTo(right - radius, top);

	ctx.quadraticCurveTo(right, top, right, top + radius);

	ctx.lineTo(right, bottom - radius);

	ctx.quadraticCurveTo(right, bottom, right - radius, bottom);

	ctx.lineTo(left + radius, bottom);

	ctx.quadraticCurveTo(left, bottom, left, bottom - radius);

	ctx.lineTo(left, top + radius);

	ctx.quadraticCurveTo(left, top, left + radius, top);

	ctx.closePath();
}