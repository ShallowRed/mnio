import SharedGameMap from 'shared/map';
import ViewObject from "game/components/view-object";

export default ViewObject(class GameMap extends SharedGameMap {

	view = document.getElementById('view');
	canvas = document.querySelector('canvas');

	minCellsInView = 12;
	startCellsInView = 18;
	maxCellsInView = 36;
	offScreenCells = 2;
	nCellsZoomIncrement = 2;

	canvasOffset = [null, null];
	maxCoordsInView = [null, null];
	viewSize = [null, null];

	positionsColor = "black";
	allowedColor = "#e5e5e5";

	constructor(game, { gridState, rows, cols }) {

		super({ gridState, rows, cols });

		this.game = game;

		this.ctx = this.canvas.getContext('2d');

		this.domElement = this.canvas;
	}

	get longestDimensionIndex() {

		return this.isWidthLarger ? 0 : 1;
	}

	get shortestDimensionIndex() {

		return this.isWidthLarger ? 1 : 0;
	}

	////////////////////////////////////////////////////

	setViewSize() {

		this.isWidthLarger = window.innerWidth >= window.innerHeight;

		document.body.className = this.isWidthLarger ? 'width-larger' : 'height-larger';

		this.viewSize = [
			this.view.offsetWidth,
			this.view.offsetHeight
		];
	}

	updateCellsLayout() {

		this.maxCoordsInView[this.longestDimensionIndex] ??= this.startCellsInView;

		this.lastCellSize = this.cellSize;

		this.cellSize = Math.round(this.viewSize[this.longestDimensionIndex] / this.maxCoordsInView[this.longestDimensionIndex]);

		this.cellPadding = Math.round(this.game.map.cellSize / 8);

		this.maxCoordsInView[this.shortestDimensionIndex] = Math.round(this.viewSize[this.shortestDimensionIndex] / this.cellSize);
	}

	updateCanvasOffset() {

		for (const i in [0, 1]) {

			const canvasOffset = this.viewSize[i] - this.maxCoordsInView[i] * this.cellSize;

			this.canvasOffset[i] = canvasOffset * this.game.player.coordsInViewCoef[i];
		}
	}

	updateCanvasLayout() {

		const { cellSize, maxCoordsInView, offScreenCells } = this;

		this.canvas.width = cellSize * (maxCoordsInView[0] + offScreenCells * 2);

		this.canvas.height = cellSize * (maxCoordsInView[1] + offScreenCells * 2);

		this.canvas.style.top = this.canvas.style.left =
			`-${Math.round(offScreenCells * cellSize)}px`;

		this.ctx.imageSmoothingEnabled = false;
	}

	////////////////////////////////////////////////////

	renderCells() {

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		this.game.player.allowedCells.forEach(position => {

			this.renderCell(position, this.allowedColor);
		});

		this.filledCells.forEach(({ color, position }) => {

			this.renderCell(position, color);
		});
	}

	get filledCells() {

		return this.gridState
			.map((color, i) => color && { color: `#${color}`, position: i })
			.filter(Boolean)
	}

	renderCell(position, color) {

		const coordsInView = this.getRelativeCoords(position);

		if (!this.areCoordsInView(coordsInView)) return;

		const [x, y] = coordsInView.map(x => Math.round(this.cellSize * x));

		if (color) {

			this.ctx.fillStyle = color;

			this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

		} else {

			this.ctx.clearRect(x, y, this.cellSize, this.cellSize);
		}
	}

	////////////////////////////////////////////////////

	getRelativeCoords(position) {

		return this.indexToCoords(position)
			.map(this.getCoordInView);
	}

	getCoordInView = (coord, i) => {

		return coord - this.game.player.coords[i] + this.game.player.coordsInView[i] + this.offScreenCells;
	}

	areCoordsInView([x, y]) {

		return (
			x > -this.offScreenCells &&
			y > -this.offScreenCells &&
			x - 1 <= this.maxCoordsInView[0] + this.offScreenCells &&
			y - 1 <= this.maxCoordsInView[1] + this.offScreenCells
		);
	}

	////////////////////////////////////////////////////

	translate(duration) {

		this.transitionDuration = duration;

		const translation = [...this.canvasOffset];

		if (duration !== 0) {

			const { lastCoords, coords, lastCoordsInView, coordsInView } = this.game.player;

			for (const i in [0, 1]) {

				const coef = lastCoords[i] - coords[i] + coordsInView[i] - lastCoordsInView[i];

				translation[i] += coef * this.cellSize;
			}
		}

		this.transform = { translation };
	}

	////////////////////////////////////////////////////

	isZoomable(direction) {

		if (
			(
				direction == "in" &&
				this.maxCoordsInView[this.longestDimensionIndex] > this.minCellsInView
			) || (
				direction == "out" &&
				this.maxCoordsInView[this.longestDimensionIndex] < this.maxCellsInView
			)
		) {

			return true;
		}
	}

	incrementMaxCoordsInView(direction) {

		const sense = direction == "in" ? -1 : 1;

		this.maxCoordsInView[this.longestDimensionIndex] += this.nCellsZoomIncrement * sense;
	}

	zoom(duration) {

		this.transitionDuration = duration;

		const factor = Math.round(1000 * this.cellSize / this.lastCellSize) / 1000;

		const deltaOffset = (this.lastCellSize - this.cellSize) * this.offScreenCells;

		const translation = [...this.canvasOffset];

		for (const i in [0, 1]) {

			translation[i] += deltaOffset;

			translation[i] += (this.game.player.coordsInView[i] - this.game.player.lastCoordsInView[i]) * this.cellSize
		}

		this.transform = { translation, factor };
	}
});