export default class Map {

  constructor(Game) {
    this.Game = () => Game;
    this.Player = () => Game.Player;
    this.mincells = 5;
    this.startcells = 8;
    this.maxcells = 16;
    this.numOffscreen = 1.5;
    this.numCells = [0, 0];
    this.size = [0, 0];
    this.translateCoef = [0, 0];
    this.deltaFromView = [0, 0];
    this.view = document.getElementById('view');
    this.canvas = document.querySelectorAll('canvas');
    this.ctx = [...this.canvas].map(canvas => canvas.getContext('2d'));
    this.Directions = {
      right: { dimension: 0, sense: 0 },
      left: { dimension: 0, sense: 1 },
      down: { dimension: 1, sense: 0 },
      up: { dimension: 1, sense: 1 }
    };
  }

  ////////////////////////////////////////////////////

  setView() {
    this.getMainDimension();
    this.setViewPosition();
    this.setViewSize();
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

  ////////////////////////////////////////////////////

  updateCanvas() {
    this.updateCanvasSize();
    this.updateCellSizeFromMainDimension();
    this.updateSecDimensionFromCellSize();
  }

  updateCanvasSize() {
    ////// Math.max( window.innerHeight, document.documentElement.clientHeight);
    // window.innerWidth && document.documentElement.clientWidth ?
    // Math.min(window.innerWidth, document.documentElement.clientWidth) :
    // window.innerWidth ||
    // document.documentElement.clientWidth ||
    // document.getElementsByTagName('body')[0].clientWidth;
    const windowSize = ["innerWidth", "innerHeight"];
    const { mainDimension: mD, secDimension: sD } = this;
    this.size[mD] = Math.round(0.85 * window[windowSize[mD]]);
    this.size[sD] = Math.round(0.95 * window[windowSize[sD]]);
  }

  updateCellSizeFromMainDimension() {
    const { mainDimension: mD } = this;
    if (!this.numCells[mD])
      this.numCells[mD] = this.startcells;
    this.cellSize = Math.round(this.size[mD] / this.numCells[mD]);
  }

  updateSecDimensionFromCellSize() {
    const { secDimension: sD } = this;
    this.numCells[sD] = Math.round(this.size[sD] / this.cellSize);
  }

  ////////////////////////////////////////////////////

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

  resetTranslateCoef() {
    this.translateCoef[0] = 0;
    this.translateCoef[1] = 0;
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
    this.updateTranslateValue();
    this.canvas.forEach(canvas => {
      canvas.style.transitionDuration = `${duration}s`;
      canvas.style.transform = `translate(${this.translateValue})`;
    });
  }

  updateTranslateValue() {
    this.updateDelta();
    this.translateValue = this.translateCoef.map((translateCoef, i) =>
        // `${translateCoef * this.cellSize}px`
        `${translateCoef * this.cellSize + this.deltaFromView[i]}px`
      )
      .join(', ');
  }

  updateDelta(Game = this.Game()) {
    this.deltaFromView = this.numCells.map((numCells, dimension) => {
      const { pX, gX, hX } = Game.getCoords(dimension);
      const viewCanvasDelta = this.size[dimension] - numCells * this
        .cellSize;

      const posInViewCoef =
        pX <= hX ? 0 :
        pX >= gX - hX - 1 ? 1 :
        1 / 2;

      return viewCanvasDelta * posInViewCoef;
    });
  }

  translateAnimation(Game = this.Game()) {
    const direction = this.Directions[Game.Player.lastdir];
    const { duration } = Game;
    this.updateTranslateCoef(direction);
    this.translateCanvas({ duration });
  }

  updateTranslateCoef({ dimension, sense }, Game = this.Game()) {
    const { pX, gX, hX } = Game.getCoords(dimension);
    this.updateCenter(gX, hX, sense)
    if (pX > this.center.start && pX < this.center.end) {
      this.updateSenseCoef(sense);
      this.updateEvenCoef(pX);
      this.translateCoef[dimension] = this.senseCoef * this.evenCoef;
    }
  }

  updateCenter(gX, hX, sense) {
    this.center = { start: hX - sense, end: gX - hX - sense };
  }

  updateSenseCoef(sense) {
    this.senseCoef = [-1, 1][sense]
  }

  updateEvenCoef(pX) {
    const { start, end } = this.center;
    this.evenCoef = (pX == Math.ceil(start) ||
      pX == Math.floor(start) ||
      pX == Math.ceil(end) ||
      pX == Math.floor(end)) ? 0.5 : 1;
  }

  ////////////////////////////////////////////////////

  incrementMainDimension(direction) {
    const increment = direction == "in" ? -1 : 1;
    const d = this.mainDimension;

    if (
      (direction == "in" && this.numCells[d] <= this.mincells) ||
      (direction == "out" && this.numCells[d] >= this.maxcells)
    ) return;

    this.numCells[d] += increment;
    return true;
  }
}
