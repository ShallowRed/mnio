import Render from '../views/render'

const MAP = {
  maxcells: 31,
  startcells: 21,
  mincells: 11,
  margin: {},
};

MAP.init = () => {
  MAP.master = document.getElementById('master');
  MAP.canvas = document.querySelectorAll('.mapcanvas');
  MAP.ctx = [
    MAP.canvas[0].getContext('2d'),
    MAP.canvas[1].getContext('2d'),
    MAP.canvas[2].getContext('2d'),
  ];
  MAP.ctx.forEach(ctx => ctx.imageSmoothingEnabled = false);
  MAP.masks = {
    top: document.getElementById('topmask'),
    bottom: document.getElementById('bottommask'),
    right: document.getElementById('rightmask'),
    left: document.getElementById('leftmask')
  };
  MAP.sup = 0;
};

MAP.update = () => { // Set params based on device width and height

  let w = MAP.windowWidth = Math.max(window.innerWidth, document.documentElement.clientWidth);
  let h = MAP.windowHeight = Math.max(window.innerHeight, document.documentElement.clientHeight);

  // Set number of visible rows/cols
  if (!MAP.rows) MAP.rows = MAP.startcells;
  if (!MAP.cols) MAP.cols = MAP.startcells;
  if (MAP.rows <= MAP.mincells) MAP.rows = MAP.mincells;
  if (MAP.cols <= MAP.mincells) MAP.cols = MAP.mincells;
  if (MAP.rows >= MAP.maxcells) MAP.rows = MAP.maxcells;
  if (MAP.cols >= MAP.maxcells) MAP.cols = MAP.maxcells;

  // Ajust variables depending on width/height ratio
  MAP.wh = (w > h);
  MAP.Smargin = MAP.wh ? Math.round(0.01 * w) : Math.round(0.01 * h);
  MAP.Lmargin = MAP.wh ? Math.round(0.05 * w) : Math.round(0.075 * h);
  w = MAP.wh ? w - MAP.Lmargin : w;
  h = MAP.wh ? h : h - MAP.Lmargin;
  MAP.cols = MAP.wh ? Math.round(MAP.rows * h / w) + MAP.sup : MAP.cols;
  MAP.rows = MAP.wh ? MAP.rows : Math.round(MAP.cols * w / h) + MAP.sup;
  MAP.CellSize = MAP.wh ? Math.round(w / (MAP.rows - 2)) : Math.round(h / (MAP.cols - 2));
  MAP.margin.right = MAP.wh ? MAP.Smargin + MAP.Lmargin : MAP.Smargin ;
  MAP.margin.bottom = MAP.wh ? MAP.Smargin : MAP.Smargin + MAP.Lmargin;
  MAP.margin.left = MAP.margin.top = MAP.Smargin;

  if (MAP.cols % 2 == 0) MAP.cols++;
  if (MAP.rows % 2 == 0) MAP.rows++;

  // Set variables used later
  MAP.hrows = (MAP.rows - 1) / 2;
  MAP.hcols = (MAP.cols - 1) / 2;
  MAP.lw = Math.round(MAP.CellSize / 6);
  MAP.width = MAP.CellSize * (MAP.rows - 2);
  MAP.height = MAP.CellSize * (MAP.cols - 2);
  MAP.shift = Math.round(MAP.CellSize / 8);
  MAP.sup = 0;

  //Set master dimensions
  MAP.master.style.width = MAP.width + 'px';
  MAP.master.style.height = MAP.height + 'px';

  //Set all canvas dimensions
  MAP.canvas.forEach(canvas => {
    canvas.width = MAP.width + MAP.CellSize * 2;
    canvas.height = MAP.height + MAP.CellSize * 2;
  });

  //Set masks dimensions
  MAP.masks.top.style.height = MAP.margin.top + "px";
  MAP.masks.bottom.style.height = MAP.margin.bottom + "px";
  MAP.masks.left.style.width = MAP.margin.left + "px";
  MAP.masks.right.style.width = MAP.margin.right + "px";
};

MAP.render = (animated, PLAYER, GAME) => { // Set params based on player position

  // Set instant or animation mode
  MAP.master.style.transitionDuration = (animated) ? GAME.duration + 's' : '0s';

  // Set master's top margin
  if (PLAYER.coefx == 0) MAP.master.style.marginTop = MAP.margin.top + "px";
  else if (PLAYER.coefx == 2) MAP.master.style.marginTop = MAP.windowHeight - MAP.height - MAP.margin.bottom + "px";
  else if (MAP.wh) MAP.master.style.marginTop = Math.round((MAP.windowHeight - MAP.height) / 2) + 'px ';
  else MAP.master.style.marginTop = 0 + 'px ';

  // Set master's left margin
  if (PLAYER.coefy == 0) MAP.master.style.marginLeft = MAP.margin.left + "px";
  else if (PLAYER.coefy == 2) MAP.master.style.marginLeft = MAP.windowWidth - MAP.width - MAP.margin.right + "px";
  else if (MAP.wh) MAP.master.style.marginLeft = Math.round((MAP.windowWidth - MAP.width) / 2) + 'px ';
  else MAP.master.style.marginLeft = 0 + 'px ';

  let checkmargin = MAP.wh ? parseInt(MAP.master.style.marginTop, 10) : parseInt(MAP.master.style.marginleft, 10);
  if (checkmargin > MAP.Smargin) {
    MAP.sup = 2;
    PLAYER.sup = MAP.wh ? [1, 0] : [0, 1];
    MAP.update();
    MAP.render(animated, PLAYER, GAME);
    return;
  }

  // Eventually translate canvas with animation
  if (!animated) return;
  let amount = new Array(2);
  if (PLAYER.lastdir == 'up' && PLAYER.x + 1 >= MAP.hcols && PLAYER.x < GAME.cols - MAP.hcols) amount[0] = 0;
  else if (PLAYER.lastdir == 'left' && PLAYER.y + 1 >= MAP.hrows && PLAYER.y < GAME.rows - MAP.hrows) amount[1] = 0;
  else if (PLAYER.lastdir == 'down') {
    if (PLAYER.x == MAP.hcols) amount[0] = -1;
    else if (PLAYER.x > MAP.hcols && PLAYER.x <= GAME.cols - MAP.hcols) amount[0] = -2;
  } else if (PLAYER.lastdir == 'right') {
    if (PLAYER.y == MAP.hrows) amount[1] = -1;
    else if (PLAYER.y > MAP.hrows && PLAYER.y <= GAME.rows - MAP.hrows) amount[1] = -2;
  }

  MAP.canvas.forEach(canvas => {
    canvas.style.transitionDuration = GAME.duration + 's';
    if (amount[0] !== undefined) canvas.style.top = amount[0] * MAP.CellSize + 'px';
    if (amount[1] !== undefined) canvas.style.left = amount[1] * MAP.CellSize + 'px';
  });
};

MAP.draw = (PLAYER, GAME) => { // Renders the grid based on device and player position

  // Clear all canvas
  MAP.ctx.forEach(ctx => ctx.clearRect(0, 0, MAP.canvas[1].width, MAP.canvas[1].height));

  // Get canvas back to origin
  MAP.canvas.forEach(canvas => {
    canvas.style.transitionDuration = '0s';
    canvas.style.top = '-' + MAP.CellSize * PLAYER.coefx + 'px';
    canvas.style.left = '-' + MAP.CellSize * PLAYER.coefy + 'px';
  });

  // Draw all allowed cells
  GAME.allowed.forEach(position => Render.allowed(position, PLAYER, GAME, MAP));

  // Draw all positions
  GAME.positions.forEach(position => Render.position(position, PLAYER, GAME, MAP));

  // Draw all colored cells
  GAME.colors.map((color, i) => color ? i : null).filter(color => color).forEach((position) => Render.color(position, PLAYER, GAME, MAP))
};

export default MAP
