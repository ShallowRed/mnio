export default class Map {

  constructor() {
    this.maxcells = 40;
    this.startcells = 20;
    this.mincells = 10;
    this.margin = {};
    this.master = document.getElementById('master');
    this.canvas = document.querySelectorAll('.mapcanvas');
    this.ctx = [...this.canvas].map(canvas => {
      const context = canvas.getContext('2d');
      context.imageSmoothingEnabled = false;
      return context;
    });
  }

  update() {

    const setWindow = () => {
      this.windowWidth = Math.max(window.innerWidth, document
        .documentElement.clientWidth);
      this.windowHeight = Math.max(window.innerHeight, document
        .documentElement.clientHeight);
    };

    const ensureLimits = () => {
      const { startcells, maxcells, mincells } = this;
      if (!this.cols) this.cols = startcells;
      if (!this.rows) this.rows = startcells;
      if (this.cols <= mincells) this.cols = mincells;
      if (this.rows <= mincells) this.rows = mincells;
      if (this.cols >= maxcells) this.cols = maxcells;
      if (this.rows >= maxcells) this.rows = maxcells;
    };

    const setDimensions = () => {
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
    };

    const setRowColCell = () => {
      const { cols, rows, width, height } = this;
      if (this.ratio) {
        this.cols = Math.round(rows * width / height);
        this.cellSize = Math.round(width / this.cols);
      } else {
        this.rows = Math.round(cols * height / width);
        this.cellSize = Math.round(height / this.rows);
      }
    };

    const setProps = () => {
      const { cols, rows, cellSize } = this;
      this.height = cellSize * rows;
      this.width = cellSize * cols;
      this.half = [Math.floor((cols - 1) / 2), Math.floor((rows - 1) / 2)];
      this.lw = Math.round(cellSize / 6);
      this.shift = Math.round(cellSize / 8);
    };

    setWindow();
    ensureLimits();
    setDimensions();
    setRowColCell();
    setProps();
  }

  setSize() {
    const { width, height, cellSize, margin } = this;

    this.master.style.width = `${width}px`;
    this.master.style.height = `${height}px`;
    this.master.style.marginTop = `${margin.top}px`;
    this.master.style.marginLeft = `${margin.left}px`;

    this.canvas.forEach(c => {
      c.width = width + cellSize * 2;
      c.height = height + cellSize * 2;
      c.style.top = `-${cellSize}px`;
      c.style.left = `-${cellSize}px`;
    });
  }

  render(Game) {
    this.resetShift();
    this.translateCanvas(0)
    this.ctx.forEach(ctx =>
      ctx.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height)
    );
    const { render } = Game.Cell;
    Game.allowed.forEach(position =>
      render.allowed(position, Game)
    );
    Game.positions.forEach(position =>
      render.position(position, Game)
    );
    Game.colors.map((color, i) => color ? i : null)
      .filter(color => color)
      .forEach((position) =>
        render.color(position, Game)
      )
  }

  translate(Game, animated) {
    if (!animated) return;
    this.setTranslationShift(Game.Player, Game);
    this.translateCanvas(Game.duration, true);
  }

  translateCanvas(duration) {
    this.canvas.forEach(c => {
      c.style.transitionDuration = `${duration}s`;
      c.style.transform =
        `translate(${this.mapShift.left * this.cellSize}px, ${this.mapShift.top * this.cellSize}px)`;
    });
  }

  resetShift() {
    this.mapShift = {
      top: 0,
      left: 0
    };
  }

  setTranslationShift(Player, Game) {

    const directions = Object.entries({
      right: { key: "left", direction: -1, dimension: 0 },
      left: { key: "left", direction: 1, dimension: 0 },
      down: { key: "top", direction: -1, dimension: 1 },
      up: { key: "top", direction: 1, dimension: 1 }
    });

    for (const [directionName, { key, direction, dimension }] of directions) {
      if (
        Player.lastdir == directionName &&
        this.needTranslation(dimension, direction, Player, Game)
      ) this.mapShift[key] = direction;
    }
  }

  needTranslation(i, direction, Player, Game) {

    const pX = Player.coord;
    const gX = [Game.cols, Game.rows];
    const hgX = gX.map(x => Math.floor(x / 2) + 1)
    const mXisUneven = [this.cols, this.rows].map(e => e % 2 !== 0);
    const hmX = this.half;
    const shift = (direction + 1) / 2;

    if (
      pX[i] > hmX[i] - shift &&
      pX[i] < gX[i] - hmX[i] - shift &&
      (pX[i] !== hgX[i] - shift || mXisUneven[i])
    )
      return true;
  }
}
