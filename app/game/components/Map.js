export default class Map {

  constructor(Game) {
    this.Game = () => Game;
    this.Player = () => Game.Player;
    this.mincells = 5;
    this.startcells = 8;
    this.maxcells = 16;
    this.numOffscreen = 1.5;
    this.numCells = [0, 0];
    this.viewSize = [0, 0];
    this.scale = {},
      this.translateCoef = [0, 0];
    this.canvasOrigin = [0, 0];
    this.view = document.getElementById('view');
    this.canvas = document.querySelectorAll('canvas');
    this.ctx = [...this.canvas].map(canvas => canvas.getContext('2d'));
  }

  ////////////////////////////////////////////////////

  setView() {
    this.getMainDimension();
    this.setViewPosition();
    this.setViewSize();
    this.updateViewSize();
  }

  getMainDimension() {
    this.ratio = (window.innerWidth >= window.innerHeight);
    this.mainDimension = this.ratio ? 0 : 1;
    this.secDimension = this.ratio ? 1 : 0;
  }

  setViewPosition() {
    const { mainDimension: mD } = this;
    this.view.style[["left", "top"][mD]] = "45%";
    this.view.style[["top", "left"][mD]] = "50%";
  }

  setViewSize() {
    const { mainDimension: mD } = this;
    this.view.style[["width", "height"][mD]] = "85%";
    this.view.style[["height", "width"][mD]] = "95%";
  }

  updateViewSize() {
    const windowSize = ["innerWidth", "innerHeight"];
    const { mainDimension: mD, secDimension: sD } = this;
    this.viewSize[mD] = Math.round(0.85 * window[windowSize[mD]]);
    this.viewSize[sD] = Math.round(0.95 * window[windowSize[sD]]);
  }

  ////////////////////////////////////////////////////

  updateCanvas() {
    this.updateCellSize();
    this.updateSecDimensionNumCells();
    this.updateViewCanvasDeltaSize();
  }

  updateCellSize() {
    const { mainDimension: mD } = this;
    if (!this.numCells[mD])
      this.numCells[mD] = this.startcells;
    if (this.cellSize) {
      const { cellSize } = this;
      this.lastCellSize = cellSize
    }
    this.cellSize = Math.round(this.viewSize[mD] / this.numCells[mD]);
  }

  updateSecDimensionNumCells() {
    const { secDimension: sD } = this;
    this.numCells[sD] = Math.round(this.viewSize[sD] / this.cellSize);
  }

  updateViewCanvasDeltaSize(i) {
    this.viewCanvasDelta = [0, 1].map(i =>
      this.viewSize[i] - this.numCells[i] * this.cellSize
    )
  }

  updateCanvasOrigin(Player = this.Player()) {
    this.canvasOrigin = this.viewCanvasDelta.map((viewCanvasDelta, i) => {
      return viewCanvasDelta * Player.posInViewCoef[i];
    });
  }

  ////////////////////////////////////////////////////

  setCanvas() {
    this.setCanvasSize();
    this.setCanvasPos();
  }

  setCanvasSize() {
    const { cellSize, numCells, numOffscreen } = this;
    this.canvas.forEach(canvas => {
      canvas.width = cellSize * (numCells[0] + numOffscreen * 2);
      canvas.height = cellSize * (numCells[1] + numOffscreen * 2);
    });
  }

  setCanvasPos() {
    this.canvas.forEach(canvas => {
      canvas.style.top =
        `-${Math.round(this.numOffscreen * this.cellSize)}px`;
      canvas.style.left =
        `-${Math.round(this.numOffscreen * this.cellSize)}px`;
    });
  }

  ////////////////////////////////////////////////////

  render() {
    this.resetTranslateCoef();
    this.translateCanvas({ duration: 0 })
    this.clearAllCanvas();
    this.drawAllCells();
  }

  clearAllCanvas() {
    this.ctx.forEach(ctx =>
      ctx.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height)
    );
  }

  drawAllCells(Game = this.Game()) {
    const { Cell } = Game;

    Game.allowed.forEach(position =>
      Cell.render.allowed(position)
    );

    Game.positions.forEach(position =>
      Cell.render.position(position)
    );

    Game.colors.map((color, i) => color ? i : null)
      .filter(color => color)
      .forEach((position) =>
        Cell.render.color(position)
      )
  }

  ////////////////////////////////////////////////////

  translateCanvas({ duration }) {
    this.updateTranslateVector();
    this.canvas.forEach(canvas => {
      canvas.style.transitionDuration = `${duration}s`;
      canvas.style.transform =
        `translate(${this.translateVector.join(', ')})`;
    });
  }

  updateTranslateVector() {
    this.translateVector = this.translateCoef.map((translateCoef, i) =>
      `${translateCoef * this.cellSize + this.canvasOrigin[i]}px`
    );
  }

  resetTranslateCoef() {
    this.translateCoef[0] = 0;
    this.translateCoef[1] = 0;
  }

  updateTranslateCoef() {
    const { lastCoord, coord, lastPosInView, posInView } = this.Player();
    this.translateCoef = lastCoord.map((x, i) =>
      x - coord[i] + posInView[i] - lastPosInView[i]
    )
  }

  ////////////////////////////////////////////////////

  incrementMainDimension(direction) {
    const increment = 2;
    const sense = direction == "in" ? -1 : 1;
    const d = this.mainDimension;

    if (
      (direction == "in" && this.numCells[d] <= this.mincells) ||
      (direction == "out" && this.numCells[d] >= this.maxcells)
    ) return;

    this.numCells[d] += increment * sense;
    return true;
  }

  updateScaleVector(direction, Player = this.Player()) {
    const cS1 = this.lastCellSize;
    const cS2 = this.cellSize;
    const dCs = (cS1 - cS2) * this.numOffscreen;

    this.scale.factor = Math.round(1000 * cS2 / cS1) / 1000;

    this.scale.translation = [0, 1].map((e, i) => {
      const oX = this.getScaleTranslation(i, dCs, cS2);
      return `${Math.round(oX * 2) / 2}px`
    });
  }

  getScaleTranslation(dimension, dCs, cS2, Player = this.Player()) {
    const cO = this.canvasOrigin[dimension];
    const pX1 = Player.lastPosInView[dimension];
    const pX2 = Player.posInView[dimension];
    return dCs + (pX2 - pX1) * cS2 + cO;
  }

  zoom() {
    this.canvas.forEach(canvas => {
      canvas.style.transitionDuration = "0.2s";
      canvas.style.transform =
        `translate(${this.scale.translation.join(', ')}) scale(${this.scale.factor}) `;
    });
  }
}
