import Render from './render'

export default class Map {

  constructor() {
    this.maxcells = 100;
    this.startcells = 31;
    this.mincells = 11;
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

    this.ratio = "null";
    this.cellSize = "null";
    this.sMargin = "null";
    this.lMargin = "null";
    this.half = "null";
    this.lw = "null";
    this.shift = "null";
    this.width = "null";
    this.height = "null";
    this.windowWidth = "null";
    this.windowHeight = "null";
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
        this.sMargin = Math.round(0.01 * windowWidth);
        this.lMargin = Math.round(0.075 * windowWidth);
        this.windowWidth -= this.lMargin;
        this.margin.right = this.sMargin + this.lMargin;
        this.margin.bottom = this.sMargin;
      } else {
        this.sMargin = Math.round(0.01 * windowHeight);
        this.lMargin = Math.round(0.11 * windowHeight);
        this.windowHeight -= this.lMargin;
        this.margin.right = this.sMargin;
        this.margin.bottom = this.sMargin + this.lMargin;
      }

      this.margin.left = this.margin.top = this.sMargin;
    };

    const setRowColCell = () => {
      const { cols, rows, windowWidth, windowHeight } = this;
      if (this.ratio) {
        this.cols = Math.round(rows * windowHeight / windowWidth) + 2;
        this.cellSize = Math.round(windowWidth / (cols - 2));
      } else {
        this.rows = Math.round(cols * windowWidth / windowHeight) + 2;
        this.cellSize = Math.round(windowHeight / (rows - 2));
      }
    };

    const ensureEven = () => {
      if (this.rows % 2 == 0) this.rows++;
      if (this.cols % 2 == 0) this.cols++;
    };

    const setProps = () => {
      const { cols, rows, cellSize } = this;
      this.half = [(cols - 1) / 2, (rows - 1) / 2];
      this.lw = Math.round(cellSize / 6);
      this.height = cellSize * (cols - 2);
      this.width = cellSize * (rows - 2);
      this.shift = Math.round(cellSize / 8);
    };

    const setCanvasSize = () => {
      const { width, height, cellSize } = this;
      this.master.style.width = `${width}px`;
      this.master.style.height = `${height}px`;
      this.canvas.forEach(c => {
        c.width = width + cellSize * 2;
        c.height = height + cellSize * 2;
      });
    };

    const setMasksSize = () => {
      const { margin } = this;
      this.masks.top.style.height = `${margin.top}px`;
      this.masks.bottom.style.height = `${margin.bottom}px`;
      this.masks.left.style.width = `${margin.left}px`;
      this.masks.right.style.width = `${margin.right}px`;
    };

    setWindow();
    ensureLimits();
    setDimensions();
    setRowColCell();
    ensureEven();
    setProps();
    setCanvasSize();
    setMasksSize();
  }

  render(animated, PLAYER, { cols, rows, duration }) {
    translate.master(this, PLAYER, duration, animated);
    if (animated)
      translate.canvas(this, PLAYER, { cols, rows, duration });
  }

  draw(PLAYER, GAME) {
    const { ctx, canvas, cellSize } = this;

    ctx.forEach(ctx =>
      ctx.clearRect(0, 0, canvas[1].width, canvas[1].height)
    );

    const shift = {
      top: PLAYER.is.up ? 0 : PLAYER.is.down ? 2 : 1,
      left: PLAYER.is.left ? 0 : PLAYER.is.right ? 2 : 1
    };

    canvas.forEach(c => {
      c.style.transitionDuration = '0s';
      c.style.top = `-${cellSize * shift.top}px`;
      c.style.left = `-${cellSize * shift.left}px`;
    });

    const context = { PLAYER, GAME, MAP: this };

    GAME.allowed.forEach(position =>
      Render.allowed(position, context)
    );

    GAME.positions.forEach(position =>
      Render.position(position, context)
    );

    GAME.colors.map((color, i) => color ? i : null)
      .filter(color => color)
      .forEach((position) => Render.color(position, context))
  }
}

const translate = {

  master: (MAP, PLAYER, duration, animated) => {
    MAP.master.style.transitionDuration = (animated) ? duration + 's' :
      '0s';

    MAP.master.style.marginTop = `${
      PLAYER.is.up ? MAP.margin.top :
      PLAYER.is.down ? MAP.windowHeight - MAP.height - MAP.margin.bottom :
      MAP.ratio ? Math.round((MAP.windowHeight - MAP.height) / 2) : 0
    }px`;

    MAP.master.style.marginLeft = `${
      PLAYER.is.left ? MAP.margin.left :
      PLAYER.is.right ? MAP.windowWidth - MAP.width - MAP.margin.right :
      MAP.ratio ? 0 : Math.round((MAP.windowWidth - MAP.width) / 2)
    }px`;
  },

  canvas: (MAP, PLAYER, { cols, rows, duration }) => {
    const isGoing = dir =>
      PLAYER.lastdir == dir;

    const rowcols = [rows, cols];

    const isPlayer = (condition, i) =>
      condition == "inCenter" ?
      PLAYER.coord[i] + 1 >= MAP.half[i] && PLAYER.coord[i] < rowcols[i] -
      MAP.half[i] :
      condition == "onLimit" ?
      PLAYER.coord[i] == MAP.half[i] :
      condition == "strictCenter" ?
      PLAYER.coord[i] > MAP.half[i] && PLAYER.coord[i] <= rowcols[i] - MAP
      .half[i] : null;


    const shift = {
      top: isPlayer("inCenter", 0) && isGoing("up") ?
        0 : isGoing("down") ? isPlayer("onLimit", 0) ?
        -1 : isPlayer("strictCenter", 0) ?
        -2 : null : null,
      left: isPlayer("inCenter", 1) && isGoing("left") ?
        0 : isGoing("right") ? isPlayer("onLimit", 1) ?
        -1 : isPlayer("strictCenter", 1) ?
        -2 : null : null
    };

    MAP.canvas.forEach(canvas => {
      canvas.style.transitionDuration = duration + 's';

      if (shift.top !== null)
        canvas.style.top = shift.top * MAP.cellSize + 'px';
      if (shift.left !== null)
        canvas.style.left = shift.left * MAP.cellSize + 'px';
    });
  }
}
