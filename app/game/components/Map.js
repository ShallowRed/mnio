export default class Map {

  constructor(Game) {
    this.Game = () => Game;
    this.Player = () => Game.Player;
    this.maxcells = 16;
    this.startcells = 8;
    this.mincells = 5;
    this.numCells = [0, 0];
    this.size = [0, 0];
    this.shift = [0, 0];
    this.delta = [0, 0];
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

  update() {
    this.ratio = (window.innerWidth >= window.innerHeight);
    this.getMainDimension();
    this.setViewPosition();
    this.setViewSize();
    this.updateCanvasSize();
    this.updateCellSizeFromMainDim();
    this.updateSecDimFromCellSize();
  }

  getMainDimension() {
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

  updateCellSizeFromMainDim() {
    const { mainDimension: mD } = this;
    if (!this.numCells[mD])
      this.numCells[mD] = this.startcells;
    this.cellSize = Math.round(this.size[mD] / this.numCells[mD]);
  }

  updateSecDimFromCellSize() {
    const { secDimension: sD } = this;
    this.numCells[sD] = Math.round(this.size[sD] / this.cellSize);
    console.log("numCells", this.numCells);
  }

  ////////////////////////////////////////////////////

  setCanvasSizeAndPos() {
    const { cellSize, numCells: [mX, mY] } = this;
    this.canvas.forEach(canvas => {
      canvas.width = cellSize * (mX + 2);
      canvas.height = cellSize * (mY + 2);
      canvas.style.top = `-${cellSize}px`;
      canvas.style.left = `-${cellSize}px`;
    });
  }

  ////////////////////////////////////////////////////

  render() {
    this.resetShift();
    this.translateCanvas({ duration: 0 })
    this.clearAllCanvas();
    this.drawAllCells();
  }

  resetShift() {
    this.shift[0] = 0;
    this.shift[1] = 0;
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
    this.getDelta();
    const translateValue = this.getTranslateValue();
    this.canvas.forEach(canvas => {
      canvas.style.transitionDuration = `${duration}s`;
      canvas.style.transform = `translate(${translateValue})`;
    });
  }

  getDelta(Player = this.Player()) {

    this.delta = this.numCells.map((numCells, i) => {
      const { pX, gX, hX } = Player.getCoords(i);

      const viewCanvasDelta = this.size[i] - numCells * this.cellSize;

      const posInViewCoef =
        pX <= hX ? 0 :
        pX >= gX - hX - 1 ? 1 :
        (1 / 2) + 0.5;

      return viewCanvasDelta * posInViewCoef;
    });
  }

  getTranslateValue() {
    return [0, 1].map(i =>
        `${this.shift[i] * this.cellSize + this.delta[i]}px`
      )
      .join(', ');
  }

  translateAnimation(Game = this.Game()) {
    const direction = this.Directions[Game.Player.lastdir];
    const { duration } = Game;
    this.setDirectionShift(direction);
    this.translateCanvas({ duration });
  }

  setDirectionShift({ dimension, sense }, Player = this.Player()) {
    const { pX, gX, hX } = Player.getCoords(dimension);
    const center = {
      start: hX - sense,
      end: gX - hX - sense
    };
    if (pX > center.start && pX < center.end) {
      const senseCoef = [-1, 1][sense];
      const isEvenCoef = this.getEvenCoef(pX, center);
      this.shift[dimension] = senseCoef * isEvenCoef;
    }
  }

  getEvenCoef(pX, { start, end }, coef = 1) {
    if (pX == Math.ceil(start) ||
      pX == Math.floor(start) ||
      pX == Math.ceil(end) ||
      pX == Math.floor(end)) coef = 0.5;
    return coef
  }

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
