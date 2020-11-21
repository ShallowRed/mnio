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

    setWindow();
    ensureLimits();
    setDimensions();
    setRowColCell();
    ensureEven();
    setProps();
  }

  setSize() {

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

    setCanvasSize();
    setMasksSize();
  }

  render(GAME) {
    const { is } = GAME.PLAYER;
    const { ctx, canvas, cellSize } = this;

    ctx.forEach(ctx =>
      ctx.clearRect(0, 0, canvas[1].width, canvas[1].height)
    );

    const shift = {
      top: is.up ? 0 : is.down ? 2 : 1,
      left: is.left ? 0 : is.right ? 2 : 1
    };

    canvas.forEach(c => {
      c.style.transitionDuration = '0s';
      c.style.top = `-${cellSize * shift.top}px`;
      c.style.left = `-${cellSize * shift.left}px`;
    });

    GAME.allowed.forEach(position =>
      GAME.Cell.render.allowed(position, GAME)
    );

    GAME.positions.forEach(position =>
      GAME.Cell.render.position(position, GAME)
    );

    GAME.colors.map((color, i) => color ? i : null)
      .filter(color => color)
      .forEach((position) =>
        GAME.Cell.render.color(position, GAME)
      )
  }

  translate(GAME, animated) {
    translate.master(GAME, animated);
    if (animated)
      translate.canvas(GAME);
  }
}

const translate = {

  master: (GAME, animated) => {
    const { PLAYER: { is }, MAP, duration } = GAME;
    const {
      master,
      margin,
      ratio,
      windowHeight,
      windowWidth,
      width,
      height
    } = MAP;

    master.style.transitionDuration = `${animated ? duration : 0}s`;

    /////////////// PROBLEM HERE

    const masterMargin = {
      top: is.up ?
        margin.top : is.down ?
        windowHeight - height - margin.bottom : ratio ?
        Math.round((windowHeight - height) / 2) : 0,

      left: is.left ?
        margin.left : is.right ?
        windowWidth - width -
        margin.right : ratio ?
        0 : Math.round((windowWidth - width) / 2)
    }

    master.style.marginTop = `${margin.top}px`;
    master.style.marginLeft = `${windowWidth - width -
    margin.right}px`;

    // master.style.marginLeft = `${masterMargin.left}px`;
    // master.style.marginLeft = `${masterMargin.left}px`;

    // master.style.marginLeft = `${masterMargin.left}px`;
    // master.style.marginLeft = `${masterMargin.left}px`;

  },

  canvas: (GAME) => {
    const { PLAYER, MAP, cols, rows, duration } = GAME;
    const { coord } = PLAYER;
    const { half } = MAP;

    const isGoing = dir =>
      PLAYER.lastdir == dir;

    const rowcols = [rows, cols];

    const isPlayer = (condition, i) =>
      condition == "inCenter" ?
      coord[i] + 1 >= half[i] && coord[i] < rowcols[i] - half[i] :
      condition == "onLimit" ?
      coord[i] == half[i] :
      condition == "strictCenter" ?
      coord[i] > half[i] && coord[i] <= rowcols[i] - half[i] : null;

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

    MAP.canvas.forEach(c => {
      c.style.transitionDuration = `${duration}s`;
      if (shift.top !== null)
        c.style.top = `${shift.top * MAP.cellSize}px`;

      if (shift.left !== null)
        c.style.left = `${shift.left * MAP.cellSize}px`;
    });
  }
}
