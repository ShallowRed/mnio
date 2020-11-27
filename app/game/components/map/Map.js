export default class Map {

  constructor(Game) {
    this.Game = () => Game;
    this.Player = () => Game.Player;
    this.maxcells = 20;
    this.startcells = 8;
    this.mincells = 5;
    this.margin = {};
    this.shift = {};
    this.scale = {};
    this.master = document.getElementById('master');
    this.canvas = document.querySelectorAll('.mapcanvas');

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

    // this.Directions = [
    //   ["right", "left"],
    //   ["down", "up"]
    // ];
  }

  update() {
    this.getWindowDimensions();
    this.ensureLimits();
    this.getCanvasDimensions();
    this.getCellProps();
  }

  getWindowDimensions() {
    this.windowWidth = Math.max(window.innerWidth, document
      .documentElement.clientWidth);
    this.windowHeight = Math.max(window.innerHeight, document
      .documentElement.clientHeight);
  }

  ensureLimits() {
    const { startcells, maxcells, mincells } = this;
    if (!this.cols) this.cols = startcells;
    if (!this.rows) this.rows = startcells;
    if (this.cols <= mincells) this.cols = mincells;
    if (this.rows <= mincells) this.rows = mincells;
    if (this.cols >= maxcells) this.cols = maxcells;
    if (this.rows >= maxcells) this.rows = maxcells;
  }

  getCanvasDimensions() {
    const { windowWidth, windowHeight } = this;
    this.ratio = (windowWidth > windowHeight);

    if (this.ratio) {
      this.sMargin = Math.round(0.02 * windowWidth);
      this.lMargin = Math.round(0.1 * windowWidth);
      this.width = windowWidth - this.lMargin - this.sMargin;
      this.height = windowHeight - this.sMargin * 2;
      this.margin.right = this.lMargin;
      this.margin.bottom = this.sMargin;
    } else {
      this.sMargin = Math.round(0.01 * windowHeight);
      this.lMargin = Math.round(0.11 * windowHeight);
      this.width = windowWidth - this.sMargin * 2;
      this.height = windowHeight - this.lMargin - this.sMargin;
      this.margin.right = this.sMargin;
      this.margin.bottom = this.lMargin;
    }
    this.margin.left = this.margin.top = this.sMargin;
  }

  getCellProps() {
    const { width, height } = this;
    if (this.ratio) {
      this.cols = Math.round(this.rows * width / height);
      this.cellSize = Math.round(width / this.cols);
    } else {
      this.rows = Math.round(this.cols * height / width);
      this.cellSize = Math.round(height / this.rows);
    }
  }

  setSize() {
    const { cols, rows, cellSize, margin } = this;
    this.master.style.width = `${cellSize * cols}px`;
    this.master.style.height = `${cellSize * rows}px`;
    this.master.style.marginTop = `${margin.top}px`;
    this.master.style.marginLeft = `${margin.left}px`;
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

  setDirectionShift({dimension, sense}, Player = this.Player()) {
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

  zoom(Game = this.Game(), Player = this.Player()) {
    Game.update(true);

    const { cellSize, canvas } = this;
    const { posInView, is } = Player;
    const startPos = posInView.map(e => e);
    const startSize = Object.assign({}, { cellSize })
      .cellSize;

    const delta = startSize - this.cellSize;

    const origin = [(
      is.left ? this.cellSize :
      is.right ?
      canvas[0].width - this.cellSize :
      (canvas[0].width + this.cellSize) / 2
    ), (
      is.up ? this.cellSize :
      is.down ?
      canvas[0].height - this.cellSize :
      (canvas[0].height + this.cellSize) / 2
    )];

    // const scaleOrigin = [
    //   (posInView[0] + shiftLeft * 3) * this.cellSize,
    //   (posInView[1] + shiftUp * 3) * this.cellSize
    // ]

    const factor = this.cellSize / startSize;

    this.setScaleVector(origin, factor);
    this.scaleCanvas();
    setTimeout(() => {
      this.setSize();
      Game.render();
    }, 200)
  }

  setScaleVector(origin, factor) {
    this.scale.factor = factor;
    this.scale.origin = origin.map(e => e + "px")
      .join(" ");
  }

  scaleCanvas() {
    const { duration } = this.Game();
    const { canvas, scale: origin, factor } = this;
    canvas.forEach(c => {
      c.style.transitionDuration = `${duration}s`;
      c.style.transformOrigin = origin;
      c.style.transform = `scale(${factor}) `;
    });
  }
}
