import Render from '../utils/render'

const MAP = {

  maxcells: 100,
  startcells: 31,
  mincells: 11,
  margin: {},

  master: document.getElementById('master'),
  canvas: document.querySelectorAll('.mapcanvas'),

  masks: {
    top: document.getElementById('topmask'),
    bottom: document.getElementById('bottommask'),
    right: document.getElementById('rightmask'),
    left: document.getElementById('leftmask')
  }
};

MAP.init = () => {
  MAP.ctx = Array.from(MAP.canvas)
    .map(canvas =>
      canvas.getContext('2d')
    );
  MAP.ctx.forEach(ctx =>
    ctx.imageSmoothingEnabled = false
  );
};

MAP.update = () => {
  let w = MAP.windowWidth = Math.max(window.innerWidth, document
    .documentElement.clientWidth);
  let h = MAP.windowHeight = Math.max(window.innerHeight, document
    .documentElement.clientHeight);

  if (!MAP.rows) MAP.rows = MAP.startcells;
  if (!MAP.cols) MAP.cols = MAP.startcells;
  if (MAP.rows <= MAP.mincells) MAP.rows = MAP.mincells;
  if (MAP.cols <= MAP.mincells) MAP.cols = MAP.mincells;
  if (MAP.rows >= MAP.maxcells) MAP.rows = MAP.maxcells;
  if (MAP.cols >= MAP.maxcells) MAP.cols = MAP.maxcells;

  MAP.ratio = (w > h);
  MAP.Smargin = MAP.ratio ? Math.round(0.01 * w) : Math.round(0.01 * h);
  MAP.Lmargin = MAP.ratio ? Math.round(0.075 * w) : Math.round(0.11 * h);
  if (MAP.ratio) w -= MAP.Lmargin;
  else h -= MAP.Lmargin;

  MAP.rows = MAP.ratio ?
    Math.round(MAP.rows * h / w) + 2 :
    MAP.rows;
  MAP.cols = MAP.ratio ?
    MAP.cols :
    Math.round(MAP.cols * w / h) + 2;

  MAP.cellSize = MAP.ratio ? Math.round(w / (MAP.rows - 2)) : Math.round(h / (
    MAP.cols - 2));
  MAP.margin.right = MAP.ratio ? MAP.Smargin + MAP.Lmargin : MAP.Smargin;
  MAP.margin.bottom = MAP.ratio ? MAP.Smargin : MAP.Smargin + MAP.Lmargin;
  MAP.margin.left = MAP.margin.top = MAP.Smargin;

  if (MAP.cols % 2 == 0) MAP.cols++;
  if (MAP.rows % 2 == 0) MAP.rows++;
  MAP.half = [(MAP.cols - 1) / 2, (MAP.rows - 1) / 2];
  MAP.lw = Math.round(MAP.cellSize / 6);
  MAP.width = MAP.cellSize * (MAP.rows - 2);
  MAP.height = MAP.cellSize * (MAP.cols - 2);
  MAP.shift = Math.round(MAP.cellSize / 8);
  MAP.master.style.width = `${MAP.width}px`;
  MAP.master.style.height = `${MAP.height}px`;

  MAP.canvas.forEach(canvas => {
    canvas.width = MAP.width + MAP.cellSize * 2;
    canvas.height = MAP.height + MAP.cellSize * 2;
  });

  MAP.masks.top.style.height = `${MAP.margin.top}px`;
  MAP.masks.bottom.style.height = `${MAP.margin.bottom}px`;
  MAP.masks.left.style.width = `${MAP.margin.left}px`;
  MAP.masks.right.style.width = `${MAP.margin.right}px`;
};

MAP.render = (animated, PLAYER, GAME) => {
  translate.master(PLAYER, GAME.duration, animated);
  if (animated) translate.canvas(PLAYER, GAME);
};

MAP.draw = (PLAYER, GAME) => {

  MAP.ctx.forEach(ctx =>
    ctx.clearRect(0, 0, MAP.canvas[1].width, MAP.canvas[1].height)
  );

  const shift = {
    top: PLAYER.is.up ? 0 : PLAYER.is.down ? 2 : 1,
    left: PLAYER.is.left ? 0 : PLAYER.is.right ? 2 : 1
  };

  MAP.canvas.forEach(canvas => {
    canvas.style.transitionDuration = '0s';
    canvas.style.top = `-${MAP.cellSize * shift.top}px`;
    canvas.style.left = `-${MAP.cellSize * shift.left}px`;
  });

  GAME.allowed.forEach(position => Render.allowed(position, PLAYER, GAME,
    MAP));
  GAME.positions.forEach(position => Render.position(position, PLAYER, GAME,
    MAP));
  GAME.colors.map((color, i) => color ? i : null)
    .filter(color => color)
    .forEach((position) => Render.color(position, PLAYER, GAME, MAP))
};

const translate = {

  master: (PLAYER, duration, animated) => {
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

  canvas: (PLAYER, GAME) => {
    const isGoing = dir =>
      PLAYER.lastdir == dir;

    const rowcols = [GAME.cols, GAME.rows];

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
      canvas.style.transitionDuration = GAME.duration + 's';

      if (shift.top !== null)
        canvas.style.top = shift.top * MAP.cellSize + 'px';
      if (shift.left !== null)
        canvas.style.left = shift.left * MAP.cellSize + 'px';
    });
  }
}


export default MAP
