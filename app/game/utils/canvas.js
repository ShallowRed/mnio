const fillCell = ([x, y], cellSize, ctx, color) => {
  ctx.clearRect(cellSize * x, cellSize * y, cellSize, cellSize);
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(cellSize * x, cellSize * y, cellSize, cellSize);
};

const roundSquare = ([x, y], cellSize, ctx, shift) => {
  roundRect(ctx, {
    x: cellSize * x + shift * 1.5,
    y: cellSize * y + shift * 1.5,
    width: cellSize - shift * 3,
    height: cellSize - shift * 3,
    radius: shift
  });
};

const roundRect = (ctx, { x, y, width, height, radius }) => {
  ctx.strokeStyle = "black";
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

export {
  fillCell,
  roundSquare
};
