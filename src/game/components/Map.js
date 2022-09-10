import mapMethods from 'shared/map-methods';

export default class GameMap {

	mincells = 7;
		
	startcells = 15;
	
	maxcells = 36;
	
	offScreenCells = 2;
	
	numCellsInView = [0, 0];
	
	viewSize = [0, 0];
	
	scale = {};
	
	translateCoef = [0, 0];
	
	canvasOrigin = [0, 0];
	
	view = document.getElementById('view');
	
	canvas = document.querySelectorAll('canvas');

	constructor(game) {
		
		this.game = game;
		
		this.ctx = [...this.canvas].map(canvas => {

			return canvas.getContext('2d')
		});
	}

	////////////////////////////////////////////////////

	setView() {

		this.getMainDimension();
		
		this.setViewPosition();
		
		this.setViewSize();
		
		this.updateViewSize();
	}

	getMainDimension() {
		
		const isWidthLarger = window.innerWidth >= window.innerHeight;
		
		this.mainDimension = isWidthLarger ? 0 : 1;
		
		this.secDimension = isWidthLarger ? 1 : 0;
	}

	setViewPosition() {
		
		const { mainDimension: mD } = this;
		
		this.view.style[["left", "top"][mD]] = "44.5%";
		
		this.view.style[["top", "left"][mD]] = "50%";
	}

	setViewSize() {
		
		const { mainDimension: mD } = this;
		
		this.view.style[["width", "height"][mD]] = "85.5%";
		
		this.view.style[["height", "width"][mD]] = "95%";
	}

	updateViewSize() {
		
		const windowSize = ["innerWidth", "innerHeight"];
		
		const { mainDimension: mD, secDimension: sD } = this;
		
		this.viewSize[mD] = Math.round(0.855 * window[windowSize[mD]]);
		
		this.viewSize[sD] = Math.round(0.95 * window[windowSize[sD]]);
	}

	////////////////////////////////////////////////////

	updateCanvasGrid() {
		
		this.updateCellSize();
		
		this.updateSecDimensionNumCells();
		
		this.updateViewCanvasDeltaSize();
	}

	updateCellSize() {
		
		const { mainDimension: mD } = this;
		
		if (!this.numCellsInView[mD]) {

			this.numCellsInView[mD] = this.startcells;
		}
		
		if (this.cellSize) {
		
			const { cellSize } = this;
		
			this.lastCellSize = cellSize
		}
		
		this.cellSize = Math.round(this.viewSize[mD] / this.numCellsInView[mD]);
	}

	updateSecDimensionNumCells() {
		
		const { secDimension: sD } = this;
		
		this.numCellsInView[sD] = Math.round(this.viewSize[sD] / this.cellSize);
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
		
		const { isTranslating } = this.game;
		
		!isTranslating && this.setCanvasSizeAndPos();
		
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
		
		const { Cell } = this.game;

		this.ctx.forEach(ctx => {

			ctx.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height)
		});

		this.game.allowedCells.forEach(position => {
		
			Cell.render.allowedCells(position);
		});

		this.game.playersPositions.forEach(position => {

			Cell.render.position(position);
		});

		this.game.gridState.map((color, i) => color ? i : null)
			.filter(color => color)
			.forEach((position) => {

				Cell.render.color(position);
			});
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
		
		const { mainDimension: mD } = this;

		if (
			(direction == "in" && this.numCellsInView[mD] <= this.mincells) ||
			(direction == "out" && this.numCellsInView[mD] >= this.maxcells)
		) return;

		this.numCellsInView[mD] += increment * sense;
		
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
}
