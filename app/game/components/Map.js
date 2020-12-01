export default class Map {

  constructor(Game) {
    this.Game = () => Game;
    this.Player = () => Game.Player;
    this.maxcells = 16;
    this.startcells = 8;
    this.mincells = 5;
    this.shift = {};
    this.delta = {};
    this.scale = {};
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

    const mainDimension = this.ratio ? 0 : 1;

    const { position, size, numCells, windowSize } =
    this.getDimensionKeys(mainDimension);

    this.setViewPosition(position);
    this.setViewSize(size);
    this.updateCanvasSize(size, windowSize);
    this.updateCellSizeFromMainDim(size, numCells);
    this.updateSecDimFromCellSize(size, numCells);
  }

  getDimensionKeys(d) {
    return {
      position: {
        main: ["left", "top"][d],
        sec: ["top", "left"][d]
      },
      size: {
        main: ["width", "height"][d],
        sec: ["height", "width"][d]
      },
      numCells: {
        main: ["cols", "rows"][d],
        sec: ["rows", "cols"][d]
      },
      windowSize: {
        main: ["innerWidth", "innerHeight"][d],
        sec: ["innerHeight", "innerWidth"][d]
      }
    };
  }

  setViewPosition(position) {
    this.view.style[position.main] = "45%";
    this.view.style[position.sec] = "50%";
  }

  setViewSize(size) {
    this.view.style[size.main] = "85%";
    this.view.style[size.sec] = "95%";
  }

  updateCanvasSize(size, windowSize) {
    ////// Math.max( window.innerHeight, document.documentElement.clientHeight);
    // window.innerWidth && document.documentElement.clientWidth ?
    // Math.min(window.innerWidth, document.documentElement.clientWidth) :
    // window.innerWidth ||
    // document.documentElement.clientWidth ||
    // document.getElementsByTagName('body')[0].clientWidth;

    this[size.main] = Math.round(0.85 * window[windowSize.main]);
    this[size.sec] = Math.round(0.95 * window[windowSize.sec]);
  }

  updateCellSizeFromMainDim(size, numCells) {
    if (!this[numCells.main])
      this[numCells.main] = this.startcells;
    this.cellSize = Math.round(this[size.main] / this[numCells.main]);
  }

  updateSecDimFromCellSize(size, numCells) {
    this[numCells.sec] = Math.round(this[size.sec] / this.cellSize);
  }

  ////////////////////////////////////////////////////

  setCanvasSizeAndPos() {
    const { cols, rows, cellSize } = this;
    this.canvas.forEach(canvas => {
      canvas.width = cellSize * (cols + 2);
      canvas.height = cellSize * (rows + 2);
      canvas.style.top = `-${1 * cellSize}px`;
      canvas.style.left = `-${1 * cellSize}px`;
    });
  }

  ////////////////////////////////////////////////////

  render(Game = this.Game()) {
    const { Cell } = Game;

    this.resetShift();
    this.translateCanvas({ duration: 0 })
    this.clearAllCanvas();

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

  resetShift() {
    this.shift.top = 0;
    this.shift.left = 0;
  }

  clearAllCanvas() {
    this.ctx.forEach(ctx =>
      ctx.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height)
    );
  }

  ////////////////////////////////////////////////////

  translateCanvas({ duration }, Player = this.Player(), Game = this
    .Game()) {

    const { is } = Player;
    const deltaX = this.width - this.cellSize * this.cols;
    const deltaY = this.height - this.cellSize * this.rows;

    const { pX, gX, hX } = Player.getCoords(0);
    const { pX: pY, gX: gY, hX: hY } = Player.getCoords(1);

    this.delta.left = pX <= hX ? 0 : pX >= hX - 1 ? deltaX : deltaX / 2;
    this.delta.top = pY <= hY ? 0 : pY >= gY - hY - 1 ? deltaY : deltaY /
      2;

    this.canvas.forEach(c => {
      c.style.transitionDuration = `${duration}s`;
      c.style.transform =
        `translate(${this.shift.left * this.cellSize + this.delta.left}px, ${this.shift.top * (this.cellSize) + this.delta.top}px)`;
    });
  }

  translateAnimation(Game = this.Game()) {
    const direction = this.Directions[Game.Player.lastdir];
    const { duration } = Game;
    this.setDirectionShift(direction);
    this.translateCanvas({ duration });
  }

  setDirectionShift({ dimension, sense },
    Player = this.Player()) {
    const { pX, gX, hX } = Player.getCoords(dimension);
    const centerStart = hX - sense;
    const centerEnd = gX - hX - sense;
    if (pX > centerStart && pX < centerEnd) {
      const dimensionKey = ["left", "top"][dimension];
      const senseCoef = [-1, 1][sense];
      const isEvenCoef = this.getEvenCoef(pX, centerStart, centerEnd);
      this.shift[dimensionKey] = senseCoef * isEvenCoef;
    }
  }

  getEvenCoef(pX, centerStart, centerEnd, coef = 1) {
    if (pX == Math.ceil(centerStart) ||
      pX == Math.floor(centerStart) ||
      pX == Math.ceil(centerEnd) ||
      pX == Math.floor(centerEnd)) coef = 0.5;
    return coef
  }

  ////////////////////////////////////////////////////

  zoom2(dir, Game = this.Game(), Player = this.Player()) {
    this.incrementMainDimension(dir);
    //todo return if not possible
    Game.update(true);
    this.setCanvasSizeAndPos();
    Game.render();
  }

  ////////////////////////////////////////////////////

  zoom(dir, Game = this.Game(), Player = this.Player()) {
    if (Game.flag.zoom) return;
    Game.flag.zoom = true;
    const { cS1 } = Object.assign({}, { cS1: this.cellSize })
    const pX1 = Player.posInView.map(pvX => (pvX + 1.5) * cS1);
    const mX1 = [this.cols, this.rows].map(mX => mX * cS1);
    this.incrementMainDimension(dir);
    Game.update(true);
    const { cS2 } = Object.assign({}, { cS2: this.cellSize })
    const pX2 = Player.posInView.map(pvX => (pvX + 1.5) * cS2);
    const mX2 = [this.cols, this.rows].map(mX => mX * cS2);
    const factor = cS2 / cS1;
    const dCs = cS1 - cS2;
    const dX = mX1.map((e, i) => (mX1[i] - mX2[i]) / 2);
    const origin = pX1.map((e, i) => (pX1[i] * factor - pX2[i] - dCs) / (
      factor - 1));
    this.setScaleVector(origin, factor);
    this.scaleCanvas();
    setTimeout(() => {
      Game.flag.zoom = false;
      this.setCanvasSizeAndPos();
      Game.render();
    }, 600)
  }

  incrementMainDimension(dir, Game = this.Game()) {
    const coef = dir == "in" ? -2 : 2;
    if (this.ratio) {
      if (this.cols > this.mincells && dir == "in")
        this.cols += coef;
      else if (this.cols < this.maxcells && dir == "out")
        this.cols += coef;
      else {
        Game.flag.zoom = false;
        return;
      }
    } else {
      if (this.rows > this.mincells && dir == "in")
        this.rows += coef;
      else if (this.rows < this.maxcells && dir == "out")
        this.cols += coef;
      else {
        Game.flag.zoom = false;
        return;
      }
    }
  }

  setScaleVector(origin, factor) {
    this.scale.factor = factor;
    this.scale.origin = origin.map(e => e + "px")
      .join(" ");
  }

  scaleCanvas() {
    const { duration } = this.Game();
    const { canvas, scale } = this;

    canvas.forEach(c => {
      c.style.transitionDuration = `${duration}s`;
      c.style.transformOrigin = scale.origin;
      c.style.transform = `scale(${scale.factor}) `;
    });
  }
}
