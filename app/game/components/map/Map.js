export default class Map {

  constructor() {
    this.maxcells = 20;
    this.startcells = 10;
    this.mincells = 5;
    this.margin = {};

    this.master = document.getElementById('master');
    this.canvas = document.querySelectorAll('.mapcanvas');

    this.masks = {
      top: document.getElementById('topmask'),
      bottom: document.getElementById('bottommask'),
      right: document.getElementById('rightmask'),
      left: document.getElementById('leftmask')
    };

    this.ctx = Array.from(this.canvas)
      .map(canvas => canvas.getContext('2d'));

    this.ctx.forEach(ctx => ctx.imageSmoothingEnabled = false);
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
        this.sMargin = Math.round(0.05 * windowWidth);
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

    const ensureEven = () => {
      if (this.rows % 2 == 0) {
        this.rows++;
      }
      if (this.cols % 2 == 0) {
        this.cols++;
      }
    };

    const setProps = () => {
      const { cols, rows, cellSize } = this;
      this.half = [cols / 2, rows / 2];
      this.lw = Math.round(cellSize / 6);
      this.height = cellSize * rows;
      this.width = cellSize * cols;
      this.shift = Math.round(cellSize / 8);
    };

    setWindow();
    ensureLimits();
    setDimensions();
    setRowColCell();
    // ensureEven();
    setProps();
  }

  setSize() {

    const setCanvasSize = () => {
      const { width, height, cellSize, margin } = this;

      this.master.style.width = `${width}px`;
      this.master.style.height = `${height}px`;
      this.master.style.marginTop = `${margin.top}px`;
      this.master.style.marginLeft = `${margin.left}px`;

      this.canvas.forEach(c => {
        // c.width = width;
        c.width = width + cellSize * 2;
        // c.height = height;
        c.height = height + cellSize * 2;
        c.style.top = `-${cellSize}px`;
        c.style.left = `-${cellSize}px`;
      });
    };

    const setMasksSize = () => {
      const { margin } = this;
      this.masks.top.style.height = `${margin.top}px`;
      this.masks.bottom.style.height = `${margin.bottom}px`;
      this.masks.left.style.width = `${margin.left}px`;
      this.masks.right.style.width = `${margin.right}px`;
    };

    setCanvasSize();
    setMasksSize();
  }

  render(Game) {

    this.ctx.forEach(ctx =>
      ctx.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height)
    );

    const { is } = Game.Player;

    this.mapShift = this.getShift(Game.Player);

    this.translateCanvas(0)

    Game.allowed.forEach(position =>
      Game.Cell.render.allowed(position, Game)
    );

    Game.positions.forEach(position =>
      Game.Cell.render.position(position, Game)
    );

    Game.colors.map((color, i) => color ? i : null)
      .filter(color => color)
      .forEach((position) =>
        Game.Cell.render.color(position, Game)
      )
  }

  translate(Game, animated) {
    if (!animated) return;

    const { Player, Map, cols, rows, duration } = Game;
    const { coord: [x, y], is, lastdir } = Player;
    const { half: [halfWidth, halfHeight] } = Map;

    const isGoing = direction =>
      lastdir == direction;

    this.mapShift = this.getShift(Player);

    if (
      isGoing("right") &&
      x !== Math.floor(cols / 2) + 1
    ) {
      if (x == cols - halfWidth + 1)
        this.mapShift.left = 0;
      else if (x > halfWidth)
        this.mapShift.left = -1;
    }

    else if (
      isGoing("left") &&
      x !== Math.floor(cols / 2)
    ) {
      if (x == cols - halfWidth)
        this.mapShift.left = -1;
      else if (x < cols - halfWidth)
        this.mapShift.left = 1;
    }

    else if (isGoing("down") &&
      y !== Math.floor(rows / 2) + 1
    ) {
      if (y == rows - halfHeight + 1)
        this.mapShift.top = 0;
      else if (y > halfHeight)
        this.mapShift.top = -1;
    }

    else if (
      isGoing("up") &&
      y !== Math.floor(rows / 2)
    ) {
      if (y == rows - halfHeight)
        this.mapShift.top = -1;
      else if (y < rows - halfHeight)
        this.mapShift.top = 1;
    }

    this.translateCanvas(duration);

    // console.log("Map rowCols :", [this.cols, this.rows]);
    console.log("Map half    :", this.half);
    console.log("Player pos  :", Player.coord);
    console.log(y);
    console.log(y == rows - halfHeight);

  }

  getShift(Player) {
    const { is } = Player;
    return {
      top: is.up ? 1 : is.down ? -1 : 0,
      left: is.left ? 1 : is.right ? -1 : 0
    };
  }

  translateCanvas(duration) {
    console.log("map shift   :", this.mapShift);
    this.canvas.forEach(c => {
      c.style.transitionDuration = `${duration}s`;
      c.style.transform =
        `translate(${this.mapShift.left * this.cellSize}px, ${this.mapShift.top * this.cellSize}px)`;
    });
  }
};
