export default class Map {

  constructor(Game) {
    this.Game = () => Game;
    this.Player = () => Game.Player;
    this.maxcells = 16;
    this.startcells = 8;
    this.mincells = 5;
    this.margin = {};
    this.shift = {};
    this.scale = {};
    this.master = document.getElementById('map');
    this.canvas = document.querySelectorAll('canvas');
    this.ctx = [...this.canvas].map(canvas => {
      const context = canvas.getContext('2d');
      context.imageSmoothingEnabled = false;
      return context;
    });

    this.Directions = {
      right: { dimension: 0, sense: 0 },
      left: { dimension: 0, sense: 1 },
      down: { dimension: 1, sense: 0 },
      up: { dimension: 1, sense: 1 }
    };
  }

  update() {
    this.getWindowDimension();
    this.getCellProps();
  }

  getWindowDimension() { //////////// test
    this.Width = 0.95 * Math.max(
      window.innerWidth,
      document.documentElement.clientWidth
    );
    this.Height = 0.95 * Math.max(
      window.innerHeight,
      document.documentElement.clientHeight
    );
  }

  getCellProps() {
    this.ratio = (this.Width >= this.Height);

    if (this.ratio) {
      this.master.style.top = "50%";
      this.master.style.left = "45%";
      this.master.style.width = `85%`;
      this.master.style.height = `95%`;

      this.mainDim = 0;
      if (!this.cols)
        this.cols = this.startcells;
      this.Width = 0.9 * this.Width;
      this.cellSize = Math.round(this.Width / this.cols);
      this.rows = Math.round(this.Height / this.cellSize);

    } else {
      this.master.style.top = "45%";
      this.master.style.left = "50%";
      this.master.style.width = `95%`;
      this.master.style.height = `85%`;

      this.mainDim = 1;
      if (!this.rows)
        this.rows = this.startcells;
      this.Height = 0.9 * this.Height;
      this.cellSize = Math.round(this.Height / this.rows);
      this.cols = Math.round(this.Width / this.cellSize);
    }
  }

  setSize() {
    const { cols, rows, cellSize } = this;
    // this.master.style.width = `${cellSize * cols}px`;
    // this.master.style.height = `${cellSize * rows}px`;
    this.canvas.forEach(c => {
      c.width = cellSize * (cols + 2);
      c.height = cellSize * (rows + 2);
      c.style.top = `-${cellSize}px`;
      c.style.left = `-${cellSize}px`;
    });
  }

  render(Game = this.Game()) {
    const { Cell } = Game;

    this.resetShift();
    this.translateCanvas(0)
    this.clearCanvas();

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

  clearCanvas() {
    this.ctx.forEach(ctx =>
      ctx.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height)
    );
  }

  translateCanvas(duration) {

    // const { is } = this.Player();
    // const deltaY = this.master.offsetHeight - this.cellSize * this.rows;
    // const deltaX = this.master.offsetWidth - this.cellSize * this.cols;
    // this.delta = {};
    // this.delta.top = is.up ? 0 : is.down ? deltaY : deltaY/2;
    // this.delta.left = is.left ? 0 : is.right ? deltaX : deltaX/2;

    this.canvas.forEach(c => {
      c.style.transitionDuration = `${duration}s`;
      c.style.transform =
        `translate(${this.shift.left * this.cellSize}px, ${this.shift.top * this.cellSize}px)`;
    });
  }

  translateAnimation(Game = this.Game()) {
    const direction = this.Directions[Game.Player.lastdir];
    this.setDirectionShift(direction);
    this.translateCanvas(Game.duration);
  }

  setDirectionShift({ dimension, sense }, Player = this.Player()) {
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

  zoom(dir, Game = this.Game(), Player = this.Player()) {
    if (Game.flag.zoom) return;
    Game.flag.zoom = true;

    const { cS1 } = Object.assign({}, { cS1: this.cellSize })
    const pX1 = Player.posInView.map(pvX => (pvX + 1.5) * cS1);
    const mX1 = [this.cols, this.rows].map(mX => mX * cS1);

    this.incrementMainDimension(dir);
    //todo return if not possible

    Game.update(true);

    const { cS2 } = Object.assign({}, { cS2: this.cellSize })
    const pX2 = Player.posInView.map(pvX => (pvX + 1.5) * cS2);
    const mX2 = [this.cols, this.rows].map(mX => mX * cS2);

    const factor = cS2 / cS1;
    const dCs = cS1 - cS2;

    const dX = mX1.map((e, i) => {
      return (mX1[i] - mX2[i]) / 2
    })

    const origin = pX1.map((e, i) => {
      return (pX1[i] * factor - pX2[i] - dCs) / (factor - 1)
      // return (pX1[i] * factor - pX2[i] - dCs - dX[i]) / (factor - 1)
    })

    this.setScaleVector(origin, factor);
    this.scaleCanvas();

    setTimeout(() => {
      Game.flag.zoom = false;
      this.setSize();
      Game.render();
    }, 600)
  }

  incrementMainDimension(dir, Game = this.Game()){
    const coef = dir == "in" ? -2 : 2;
    if (this.mainDim == 0) {
      if (this.cols > this.mincells && dir == "in")
        this.cols += coef;
      else if (this.cols < this.maxcells && dir == "out")
        this.cols += coef;
      else {
        Game.flag.zoom = false;
        return;
      }
    } else if (this.mainDim == 1) {
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
