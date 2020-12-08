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
    this.scale = {},
      this.translateCoef = [0, 0];
    this.deltaFromView = [0, 0];
    this.view = document.getElementById('view');
    this.canvas = document.querySelectorAll('canvas');
    this.ctx = [...this.canvas].map(canvas => canvas.getContext('2d'));
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
    const windowSize = ["innerWidth", "innerHeight"];
    const { mainDimension: mD, secDimension: sD } = this;
    this.size[mD] = Math.round(0.85 * window[windowSize[mD]]);
    this.size[sD] = Math.round(0.95 * window[windowSize[sD]]);
  }

  updateCellSizeFromMainDimension() {
    const { mainDimension: mD } = this;
    if (!this.numCells[mD])
      this.numCells[mD] = this.startcells;
    if (this.cellSize) {
      const { cellSize } = this;
      this.lastCellSize = cellSize
    }
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
    this.updateDelta();
    this.updateTranslateVector();
    this.canvas.forEach(canvas => {
      canvas.style.transitionDuration = `${duration}s`;
      canvas.style.transform = `translate(${this.translateVector})`;
    });
  }

  updateTranslateCoef() {
    const { lastCoord, coord, lastPosInView, posInView } = this.Player();
    this.translateCoef = lastCoord.map((x, i) =>
      x - coord[i] + posInView[i] - lastPosInView[i]
    )
  }

  updateTranslateVector() {
    this.translateVector = this.translateCoef.map((translateCoef, i) =>
        `${translateCoef * this.cellSize + this.deltaFromView[i]}px`
      )
      .join(', ');
  }

  updateDelta(Game = this.Game()) {
    // console.log("- UPDATE DELTA");
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

  ////////////////////////////////////////////////////

  incrementMainDimension(direction) {
    const increment = 1;
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
        const oX = this.getTranslation(i, dCs, cS2);
        return `${Math.round(oX * 2) / 2}px`
      })
      .join(', ');
  }

  getTranslation(dimension, dCs, cS2, Player = this.Player()) {
    const dV = this.deltaFromView[dimension];
    const pX1 = Player.lastPosInView[dimension];
    const pX2 = Player.posInView[dimension];
    return dCs + (pX2 - pX1) * cS2 + dV;
  }

  zoom() {
    this.canvas.forEach(canvas => {
      canvas.style.transitionDuration = "0.2s";
      canvas.style.transform =
        `translate(${this.scale.translation}) scale(${this.scale.factor}) `;
    });
  }
}
