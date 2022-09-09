export const fillCell = (coord, cellSize, ctx, color) => {

	const [vX, vY] = coord.map(x => Math.round(cellSize * x));

	ctx.clearRect(vX, vY, cellSize, cellSize);

	if (!color) return;

	ctx.fillStyle = color || "red";

	// ctx.fillStyle = color;

	ctx.fillRect(vX, vY, cellSize, cellSize);
};

export const roundSquare = (coord, cellSize, ctx, shift) => {

	const [x, y] = coord.map(x => {

		return Math.round(cellSize * x + shift * 1.5);
	});

	roundRect(ctx, "black", {
		x,
		y,
		width: cellSize - shift * 3,
		height: cellSize - shift * 3,
		radius: shift
	});
};

const roundRect = (ctx, color, { x, y, width, height, radius }) => {
	
	ctx.strokeStyle = color;
	ctx.lineWidth = radius;
	
	ctx.beginPath();
	
	ctx.moveTo(x + radius, y);
	
	ctx.lineTo(x + width - radius, y);
	
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	
	ctx.lineTo(x + width, y + height - radius);
	
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	
	ctx.lineTo(x + radius, y + height);
	
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	
	ctx.lineTo(x, y + radius);
	
	ctx.quadraticCurveTo(x, y, x + radius, y);
	
	ctx.closePath();
	
	ctx.stroke();
};