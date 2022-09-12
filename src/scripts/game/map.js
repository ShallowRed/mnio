import SharedGameMap from 'shared/map-methods';

export default class GameMap extends SharedGameMap {

	view = document.getElementById('view');
	canvas = document.querySelectorAll('canvas');

	mincells = 7;
	startcells = 15;
	maxcells = 36;
	offScreenCells = 2;

	translateCoef = [0, 0];

	numCellsInView = [null, null];
	viewSize = [null, null];
	canvasOrigin = [null, null];
	scale = {};

	positionsColor = "black";
	allowedColor = "#e5e5e5";

	constructor(game, { rows, cols, gridState, playersPositions }) {

		super();

		this.game = game;

		this.rows = rows;

		this.cols = cols;

		this.playersPositions = playersPositions;

		this.gridState = gridState;

		this.ctx = [...this.canvas].map(canvas => {

			return canvas.getContext('2d')
		});
	}


	get positionsCtx() {

		return this.ctx[2];
	}

	get colorsCtx() {

		return this.ctx[1];
	}

	get allowedCtx() {

		return this.ctx[0];
	}

	////////////////////////////////////////////////////

	getViewSize() {

		this.isWidthLarger =  window.innerWidth >= window.innerHeight;
		
		document.body.className = this.isWidthLarger ? 'width-larger' : 'height-larger';

		this.viewSize = [
			this.view.offsetWidth,
			this.view.offsetHeight
		];
	}

	////////////////////////////////////////////////////

	updateCanvasGrid() {

		this.updateCellSize();

		this.updateSecDimensionNumCells();

		this.updateViewCanvasDeltaSize();
	}

	updateCellSize() {

		const index = this.isWidthLarger ? 0 : 1;

		if (!this.numCellsInView[index]) {

			this.numCellsInView[index] = this.startcells;
		}

		if (this.cellSize) {

			const { cellSize } = this;

			this.lastCellSize = cellSize
		}

		this.cellSize = Math.round(this.viewSize[index] / this.numCellsInView[index]);
	}

	updateSecDimensionNumCells() {

		const index = this.isWidthLarger ? 1 : 0;

		this.numCellsInView[index] = Math.round(this.viewSize[index] / this.cellSize);
	}

	updateViewCanvasDeltaSize() {

		this.viewCanvasDelta = [0, 1].map(i => {

			return this.viewSize[i] - this.numCellsInView[i] * this.cellSize;
		});
	}

	updateCanvasOrigin() {

		this.canvasOrigin = this.viewCanvasDelta.map((viewCanvasDelta, i) => {

			return viewCanvasDelta * this.game.player.posInViewCoef[i];
		});
	}

	////////////////////////////////////////////////////

	render() {

		if (!this.game.flags.isTranslating) {
			this.setCanvasSizeAndPos();
		}

		this.translateCanvas({ duration: 0 });

		this.renderCells();
	}

	setCanvasSizeAndPos() {

		const { cellSize, numCellsInView, offScreenCells } = this;

		this.canvas.forEach(canvas => {

			canvas.width = cellSize * (numCellsInView[0] + offScreenCells * 2);

			canvas.height = cellSize * (numCellsInView[1] + offScreenCells * 2);

			canvas.style.top =
				`-${Math.round(offScreenCells * cellSize)}px`;

			canvas.style.left =
				`-${Math.round(offScreenCells * cellSize)}px`;
		});

		this.ctx.forEach(ctx => {
			ctx.imageSmoothingEnabled = false;
		});
	}

	renderCells() {

		this.ctx.forEach(ctx => {

			ctx.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height)
		});

		this.game.player.allowedCells.forEach(position => {

			this.renderCell(position, this.allowedCtx, this.allowedColor);
		});

		this.playersPositions.forEach(position => {

			this.renderPosition(position);
		});

		this.gridState
			.map((color, i) => color && { color, position: i })
			.filter(Boolean)
			.forEach(({ color, position }) => {
				this.renderCell(position, this.colorsCtx, `#${color}`);
			});
	}

	renderCell(position, ctx, color) {

		const coords = this.getRelativeCoords(position);

		if (!coords) return;

		drawSquare(coords, this.cellSize, ctx, color);
	}

	clearCell(position, ctx) {

		this.renderCell(position, ctx, null);
	}

	renderPosition(position) {

		const coords = this.getRelativeCoords(position);

		if (!coords) return;

		const shift = Math.round(this.map.cellSize / 8);

		drawRoundSquare(coords, this.positionsColor, this.cellSize, this.positionsCtx, shift);
	}

	////////////////////////////////////////////////////

	translateCanvas({ duration }) {

		this.updateTranslateVector(duration);

		this.canvas.forEach(canvas => {

			canvas.style.transitionDuration = `${duration}s`;

			canvas.style.transform =
				`translate(${this.translateVector.join(', ')})`;
		});
	}

	updateTranslateVector(duration) {

		if (duration) {

			this.updateTranslateCoef();
		} else {

			this.resetTranslateCoef();
		}

		this.translateVector = this.translateCoef.map((translateCoef, i) => {

			return `${translateCoef * this.cellSize + this.canvasOrigin[i]}px`;
		});
	}

	resetTranslateCoef() {

		this.translateCoef[0] = 0;

		this.translateCoef[1] = 0;
	}

	updateTranslateCoef() {

		const { lastCoords, coords, lastPosInView, posInView } = this.game.player;

		this.translateCoef = lastCoords.map((x, i) => {

			return x - coords[i] + posInView[i] - lastPosInView[i];
		});
	}

	////////////////////////////////////////////////////

	incrementMainNumCells(direction) {

		const increment = 2;

		const sense = direction == "in" ? -1 : 1;

		const index = this.isWidthLarger ? 0 : 1;

		if (
			(direction == "in" && this.numCellsInView[index] <= this.mincells) ||
			(direction == "out" && this.numCellsInView[index] >= this.maxcells)
		) return;

		this.numCellsInView[index] += increment * sense;

		return true;
	}

	zoom() {

		this.updateScaleVector();

		this.canvas.forEach(canvas => {

			canvas.style.transitionDuration = "0.19s";

			canvas.style.transform =
				`translate(${this.scale.translation.join(', ')}) scale(${this.scale.factor}) `;
		});
	}

	updateScaleVector() {

		const cS1 = this.lastCellSize;

		const cS2 = this.cellSize;

		const dCs = (cS1 - cS2) * this.offScreenCells;

		this.scale.factor = Math.round(1000 * cS2 / cS1) / 1000;

		this.scale.translation = [0, 1].map((e, i) => {

			const oX = this.getScaleTranslation(i, dCs, cS2);

			return `${Math.round(oX * 2) / 2}px`
		});
	}

	getScaleTranslation(dimension, dCs, cS2) {

		const cO = this.canvasOrigin[dimension];

		const pX1 = this.game.player.lastPosInView[dimension];

		const pX2 = this.game.player.posInView[dimension];

		return dCs + (pX2 - pX1) * cS2 + cO;
	}

	////////////////////////////////////////////////////

	getCoordInView = (coord, i) => {

		return coord - this.game.player.coords[i] + this.game.player.posInView[i] + this.offScreenCells;
	}

	getRelativeCoords(position) {

		return this.indexToCoords(position)
			.map(this.getCoordInView);
	}

	areCoordsInView([x, y]) {

		return (
			x > -this.offScreenCells &&
			y > -this.offScreenCells &&
			x - 1 <= this.numCellsInView[0] + this.offScreenCells &&
			y - 1 <= this.numCellsInView[1] + this.offScreenCells
		);
	}
}

function drawSquare(coords, cellSize, ctx, color) {

	const [x, y] = coords.map(x => Math.round(cellSize * x));

	if (!color) {

		ctx.clearRect(x, y, cellSize, cellSize);

	} else {

		ctx.fillStyle = color;

		ctx.fillRect(x, y, cellSize, cellSize);
	}
}

function drawRoundSquare(coords, color, cellSize, ctx, shift) {

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