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
  MAP.ctx = Array.from(MAP.canvas).map(canvas => canvas.getContext('2d'));
  MAP.ctx.forEach(ctx => ctx.imageSmoothingEnabled = false);
  MAP.masks = {
    top: document.getElementById('topmask'),
    bottom: document.getElementById('bottommask'),
    right: document.getElementById('rightmask'),
    left: document.getElementById('leftmask')
  };
  MAP.half = new Array(2);
};

MAP.update = () => {
  let w = MAP.windowWidth = Math.max(window.innerWidth, document.documentElement.clientWidth);
  let h = MAP.windowHeight = Math.max(window.innerHeight, document.documentElement.clientHeight);
  Update.init();
  Update.ratio(w, h);
  Update.utils();
  Update.dimensions();
};

MAP.render = (animated, PLAYER, GAME) => {
  MAP.master.style.transitionDuration = (animated) ? GAME.duration + 's' : '0s';
  SetMargin.master(PLAYER);
  if (animated) SetMargin.canvas(PLAYER.lastdir, PLAYER.coord, GAME.rc, GAME.duration);
};

MAP.draw = (PLAYER, GAME) => {
  MAP.ctx.forEach(ctx => ctx.clearRect(0, 0, MAP.canvas[1].width, MAP.canvas[1].height));
  MAP.canvas.forEach(canvas => {
    canvas.style.transitionDuration = '0s';
    canvas.style.top = '-' + MAP.cellSize * (PLAYER.is.up ? 0 : PLAYER.is.down ? 2 : 1) + 'px';
    canvas.style.left = '-' + MAP.cellSize * (PLAYER.is.left ? 0 : PLAYER.is.right ? 2 : 1) + 'px';
  });
  GAME.allowed.forEach(position => Render.allowed(position, PLAYER, GAME, MAP));
  GAME.positions.forEach(position => Render.position(position, PLAYER, GAME, MAP));
  GAME.colors.map((color, i) => color ? i : null).filter(color => color).forEach((position) => Render.color(position, PLAYER, GAME, MAP))
};

const Update = {

  init: () => {
    if (!MAP.rc) MAP.rc = [MAP.startcells, MAP.startcells];
    if (MAP.rc[1] <= MAP.mincells) MAP.rc[1] = MAP.mincells;
    if (MAP.rc[0] <= MAP.mincells) MAP.rc[0] = MAP.mincells;
    if (MAP.rc[1] >= MAP.maxcells) MAP.rc[1] = MAP.maxcells;
    if (MAP.rc[0] >= MAP.maxcells) MAP.rc[0] = MAP.maxcells;
  },

  ratio: (w, h) => {
    MAP.ratio = (w > h);
    MAP.Smargin = MAP.ratio ? Math.round(0.01 * w) : Math.round(0.01 * h);
    MAP.Lmargin = MAP.ratio ? Math.round(0.05 * w) : Math.round(0.075 * h);
    if (MAP.ratio) w -= MAP.Lmargin;
    else h -= MAP.Lmargin;
    MAP.rc = MAP.ratio ? [Math.round(MAP.rc[1] * h / w) + 2, MAP.rc[0]] : [MAP.rc[1], Math.round(MAP.rc[0] * w / h) + 2];
    MAP.cellSize = MAP.ratio ? Math.round(w / (MAP.rc[1] - 2)) : Math.round(h / (MAP.rc[0] - 2));
    MAP.margin.right = MAP.ratio ? MAP.Smargin + MAP.Lmargin : MAP.Smargin;
    MAP.margin.bottom = MAP.ratio ? MAP.Smargin : MAP.Smargin + MAP.Lmargin;
    MAP.margin.left = MAP.margin.top = MAP.Smargin;
  },

  utils: () => {
    if (MAP.rc[0] % 2 == 0) MAP.rc[0]++;
    if (MAP.rc[1] % 2 == 0) MAP.rc[1]++;
    MAP.half = [(MAP.rc[0] - 1) / 2, (MAP.rc[1] - 1) / 2];
    MAP.lw = Math.round(MAP.cellSize / 6);
    MAP.width = MAP.cellSize * (MAP.rc[1] - 2);
    MAP.height = MAP.cellSize * (MAP.rc[0] - 2);
    MAP.shift = Math.round(MAP.cellSize / 8);
    MAP.sup = 0;
  },

  dimensions: () => {
    MAP.master.style.width = MAP.width + 'px';
    MAP.master.style.height = MAP.height + 'px';
    MAP.canvas.forEach(canvas => {
      canvas.width = MAP.width + MAP.cellSize * 2;
      canvas.height = MAP.height + MAP.cellSize * 2;
    });
    MAP.masks.top.style.height = MAP.margin.top + "px";
    MAP.masks.bottom.style.height = MAP.margin.bottom + "px";
    MAP.masks.left.style.width = MAP.margin.left + "px";
    MAP.masks.right.style.width = MAP.margin.right + "px";
  }

};

const SetMargin = {

  master: PLAYER => {
    MAP.master.style.marginTop =
      PLAYER.is.up ? MAP.margin.top + "px" :
      PLAYER.is.down ? MAP.windowHeight - MAP.height - MAP.margin.bottom + "px" :
      MAP.ratio ? Math.round((MAP.windowHeight - MAP.height) / 2) + 'px ' : '0px ';
    MAP.master.style.marginLeft =
      PLAYER.is.left ? MAP.margin.left + "px" :
      PLAYER.is.right ? MAP.windowWidth - MAP.width - MAP.margin.right + "px" :
      MAP.ratio ? Math.round((MAP.windowWidth - MAP.width) / 2) + 'px ' : '0px ';
  },

  canvas: (lastdir, coord, rowcol, duration) => {
    let amount = [
      (lastdir == 'up' && coord[0] + 1 >= MAP.half[0] && coord[0] < rowcol[0] - MAP.half[0]) ? 0 :
      (lastdir == 'down') ? (coord[0] == MAP.half[0]) ? -1 : (coord[0] > MAP.half[0] && coord[0] <= rowcol[0] - MAP.half[0]) ? -2 : null : null,
      (lastdir == 'left' && coord[1] + 1 >= MAP.half[1] && coord[1] < rowcol[1] - MAP.half[1]) ? 0 :
      (lastdir == 'right') ? (coord[1] == MAP.half[1]) ? -1 : (coord[1] > MAP.half[1] && coord[1] <= rowcol[1] - MAP.half[1]) ? -2 : null : null
    ];
    MAP.canvas.forEach(canvas => {
      canvas.style.transitionDuration = duration + 's';
      if (amount[0] !== null) canvas.style.top = amount[0] * MAP.cellSize + 'px';
      if (amount[1] !== null) canvas.style.left = amount[1] * MAP.cellSize + 'px';
    });
  }
}

export default MAP
