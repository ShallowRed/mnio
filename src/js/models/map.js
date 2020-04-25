import Render from '../controlers/render'

const MAP = {

  maxcells: 71,

  startcells: 21,

  mincells: 11,

};

MAP.init = () => {
  MAP.master = document.getElementById('master');
  MAP.canvas = document.querySelectorAll('.mapcanvas');
  MAP.ctx1 = MAP.canvas[0].getContext('2d');
  MAP.ctx2 = MAP.canvas[1].getContext('2d');
  MAP.ctx3 = MAP.canvas[2].getContext('2d');
  MAP.ctx1.imageSmoothingEnabled = MAP.ctx2.imageSmoothingEnabled = MAP.ctx3.imageSmoothingEnabled = false;
  MAP.topmask = document.getElementById('topmask');
  MAP.bottommask = document.getElementById('bottommask');
  MAP.leftmask = document.getElementById('leftmask');
  MAP.rightmask = document.getElementById('rightmask');
};

MAP.setup = () => { // Set params based on device width and height

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
  if (w > h) {
    MAP.Smargin = Math.round(0.01 * w);
    MAP.Lmargin = Math.round(0.05 * w);
    w -= MAP.Lmargin;
    MAP.cols = Math.round(MAP.rows * h / w);
    MAP.CellSize = Math.round(w / (MAP.rows - 2));
    MAP.marginLeft = MAP.Smargin;
    MAP.marginRight = MAP.Smargin + MAP.Lmargin;
    MAP.marginTop = MAP.Smargin;
    MAP.marginBottom = MAP.Smargin;
  } else {
    MAP.Smargin = Math.round(0.01 * h);
    MAP.Lmargin = Math.round(0.075 * h);
    h -= MAP.Lmargin;
    MAP.rows = Math.round(MAP.cols * w / h);
    MAP.CellSize = Math.round(h / (MAP.cols - 2));
    MAP.marginLeft = MAP.Smargin;
    MAP.marginRight = MAP.Smargin;
    MAP.marginTop = MAP.Smargin;
    MAP.marginBottom = MAP.Smargin + MAP.Lmargin;
  }

  if (MAP.cols % 2 == 0) MAP.cols++;
  if (MAP.rows % 2 == 0) MAP.rows++;

  // Set variables used later
  MAP.hrows = (MAP.rows - 1) / 2;
  MAP.hcols = (MAP.cols - 1) / 2;
  MAP.lw = Math.round(MAP.CellSize / 6);
  MAP.width = MAP.CellSize * (MAP.rows - 2);
  MAP.height = MAP.CellSize * (MAP.cols - 2);
  MAP.shift = Math.round(MAP.CellSize / 8);

  //Set master dimensions
  MAP.master.style.width = MAP.width + 'px';
  MAP.master.style.height = MAP.height + 'px';

  //Set all canvas dimensions
  for (let i = 0; i < 3; i++) {
    MAP.canvas[i].width = MAP.width + MAP.CellSize * 2;
    MAP.canvas[i].height = MAP.height + MAP.CellSize * 2;
  }

  //Set masks dimensions
  MAP.topmask.style.height = MAP.marginTop + "px";
  MAP.bottommask.style.height = MAP.marginBottom + "px";
  MAP.leftmask.style.width = MAP.marginLeft + "px";
  MAP.rightmask.style.width = MAP.marginRight + "px";
};

MAP.update = (animated, PLAYER, GAME) => { // Set params based on player position

  // Set instant or animation mode
  if (!animated) MAP.master.style.transitionDuration = '0s';
  else MAP.master.style.transitionDuration = GAME.duration + 's';

  // Set master's top margin
  if (PLAYER.coefx == 0) MAP.master.style.marginTop = MAP.marginTop + "px";
  else if (PLAYER.coefx == 2) MAP.master.style.marginTop = MAP.windowHeight - MAP.height - MAP.marginBottom + "px";
  else if (MAP.windowHeight < MAP.windowWidth) MAP.master.style.marginTop = Math.round((MAP.windowHeight - MAP.height) / 2) + 'px ';
  else MAP.master.style.marginTop = 0 + 'px ';

  // Set master's left margin
  if (PLAYER.coefy == 0) MAP.master.style.marginLeft = MAP.marginLeft + "px";
  else if (PLAYER.coefy == 2) MAP.master.style.marginLeft = MAP.windowWidth - MAP.width - MAP.marginRight + "px";
  else if (MAP.windowHeight > MAP.windowWidth) MAP.master.style.marginLeft = Math.round((MAP.windowWidth - MAP.width) / 2) + 'px ';
  else MAP.master.style.marginLeft = 0 + 'px ';

  // Eventually translate canvas with animation
  if (!animated) return;
  let amount = [null, null];

  // else if (PLAYER.lastdir == 'down' && PLAYER.x >= MAP.hcols  && PLAYER.x <= GAME.cols - MAP.hcols) amount[0] = -2 * MAP.CellSize;

  if (PLAYER.lastdir == 'up' && PLAYER.x + 1 >= MAP.hcols && PLAYER.x < GAME.cols - MAP.hcols) amount[0] = 0;
  else if (PLAYER.lastdir == 'left' && PLAYER.y + 1 >= MAP.hrows && PLAYER.y < GAME.rows - MAP.hrows) amount[1] = 0;
  else if (PLAYER.lastdir == 'down') {
    if (PLAYER.x == MAP.hcols) amount[0] = -1;
    else if (PLAYER.x > MAP.hcols && PLAYER.x <= GAME.cols - MAP.hcols) amount[0] = -2;
  }
  else if (PLAYER.lastdir == 'right') {
    if (PLAYER.y == MAP.hrows) amount[1] = -1;
    else if (PLAYER.y > MAP.hrows && PLAYER.y <= GAME.rows - MAP.hrows) amount[1] = -2;
  }

  for (let i = 0; i < 3; i++) {
    MAP.canvas[i].style.transitionDuration = GAME.duration + 's';
    if (amount[0] !== null) MAP.canvas[i].style.top = amount[0] * MAP.CellSize + 'px';
    if (amount[1] !== null) MAP.canvas[i].style.left = amount[1] * MAP.CellSize + 'px';
  }
};

MAP.render = (PLAYER, GAME) => { // Renders the grid based on device and player position

  // Clear all canvas
  MAP.ctx1.clearRect(0, 0, MAP.canvas[1].width, MAP.canvas[1].height);
  MAP.ctx2.clearRect(0, 0, MAP.canvas[1].width, MAP.canvas[1].height);
  MAP.ctx3.clearRect(0, 0, MAP.canvas[1].width, MAP.canvas[1].height);

  // Get canvas back to origin
  for (let i = 0; i < 3; i++) {
    MAP.canvas[i].style.transitionDuration = '0s';
    MAP.canvas[i].style.top = '-' + MAP.CellSize * PLAYER.coefx + 'px';
    MAP.canvas[i].style.left = '-' + MAP.CellSize * PLAYER.coefy + 'px';
  }

  // Draw all allowed cells
  GAME.allowed.forEach(function(position) {
    Render.allowed(position, PLAYER, GAME, MAP);
  });

  // Draw all colored cells
  let len = GAME.colors.length;
  for (let i = 0; i < len; i++)
    if (GAME.colors[i] !== null) Render.color(i, GAME.colors[i], PLAYER, GAME, MAP);

  // Draw all positions
  GAME.positions.forEach(function(position) {
    Render.position(position, PLAYER, GAME, MAP);
  });

};

export default MAP
