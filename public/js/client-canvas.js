const GAME = {

  init: function(data) {
    PLAYER.init(data);
    MAP.init();

    this.colors = data.ColorList;
    this.positions = data.PositionList;
    this.allowed = data.allowedlist;
    this.rows = data.uiparams[0];
    this.cols = data.uiparams[1];
    this.duration = 0.2;

    c1.style.background = PLAYER.color1;
    c1.style.border = 'solid 2px black';
    c2.style.background = PLAYER.color2;
    c3.style.background = PLAYER.color3;

    this.render();
    HideLobby();
    this.flag = true;
  },

  update: function(animated) {
    PLAYER.update(animated);
    MAP.update(animated);

  },

  render: function() {
    MAP.setup();
    GAME.update();
    PLAYER.render();
    MAP.render();
  },

  zoomin: function() {
    MAP.rows -= 2;
    MAP.cols -= 2;
    this.render();
  },

  zoomout: function() {
    MAP.rows += 2;
    MAP.cols += 2;
    this.render();
  }

};

const PLAYER = {

  init: function(data) {
    this.position = data.position;
    this.color1 = data.colors[0];
    this.color2 = data.colors[1];
    this.color3 = data.colors[2];
    this.selectedcolor = data.colors[0];
    this.canvas = document.getElementById('playercanvas');
    this.shadow = document.getElementById('shadow');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  },

  update: function(animated) {

    // Get player's absolute position
    PLAYER.x = Cell.indextocoord(PLAYER.position)[0];
    PLAYER.y = Cell.indextocoord(PLAYER.position)[1];

    // Calculate player X position in view
    if (PLAYER.x < MAP.hcols) {
      PLAYER.coefx = 0;
      PLAYER.vx = PLAYER.x;
    } else if (PLAYER.x > GAME.cols - MAP.hcols) {
      PLAYER.coefx = 2;
      PLAYER.vx = PLAYER.x + MAP.cols - GAME.cols - 2;
    } else {
      PLAYER.coefx = 1;
      PLAYER.vx = MAP.hcols - 1;
    }

    // Calculate player Y position in view
    if (PLAYER.y < MAP.hrows) {
      PLAYER.coefy = 0;
      PLAYER.vy = PLAYER.y;
    } else if (PLAYER.y > GAME.rows - MAP.hrows) {
      PLAYER.coefy = 2;
      PLAYER.vy = PLAYER.y + MAP.rows - GAME.rows - 2;
    } else {
      PLAYER.coefy = 1;
      PLAYER.vy = MAP.hrows - 1;
    }

    // Set player position in view, eventually with animation
    if (!animated) PLAYER.shadow.style.transitionDuration = PLAYER.canvas.style.transitionDuration = '0s';
    else PLAYER.shadow.style.transitionDuration = PLAYER.canvas.style.transitionDuration = GAME.duration + 's';
    PLAYER.shadow.style.top = PLAYER.canvas.style.top = PLAYER.vx * MAP.CellSize + MAP.shift + 'px';
    PLAYER.shadow.style.left = PLAYER.canvas.style.left = PLAYER.vy * MAP.CellSize + MAP.shift + 'px';

    // Eventually set player size
    if (animated) return;
    PLAYER.canvas.width = PLAYER.canvas.height = MAP.CellSize - MAP.shift * 4;
    PLAYER.shadow.style.width = PLAYER.shadow.style.height = MAP.CellSize - MAP.shift * 2 - 2 + 'px';
    PLAYER.shadow.style.borderRadius = PLAYER.canvas.style.borderWidth = PLAYER.canvas.style.borderRadius = MAP.shift + 'px';
  },

  render: function() {
    PLAYER.canvas.style.background = PLAYER.selectedcolor;
  }

};

const MAP = {

  maxcells: 23,

  startcells: 15,

  mincells: 7,

  Smargin: 30,

  Lmargin: 120,

  init: function() {
    this.master = document.getElementById('master');
    this.canvas = document.querySelectorAll('.mapcanvas');
    this.ctx1 = this.canvas[0].getContext('2d');
    this.ctx2 = this.canvas[1].getContext('2d');
    this.ctx3 = this.canvas[2].getContext('2d');
    this.ctx1.imageSmoothingEnabled = this.ctx2.imageSmoothingEnabled = this.ctx3.imageSmoothingEnabled = false;
    this.topmask = document.getElementById('topmask');
    this.bottommask = document.getElementById('bottommask');
    this.leftmask = document.getElementById('leftmask');
    this.rightmask = document.getElementById('rightmask');
  },

  // Set params based on device width and height
  setup: function() {
    let w = window.innerWidth;
    let h = window.innerHeight;

    // Set number of visible rows/cols
    if (!MAP.rows) MAP.rows = MAP.startcells;
    if (!MAP.cols) MAP.cols = MAP.startcells;
    if (MAP.rows <= MAP.mincells) MAP.rows = MAP.mincells;
    if (MAP.cols <= MAP.mincells) MAP.cols = MAP.mincells;
    if (MAP.rows >= MAP.maxcells) MAP.rows = MAP.maxcells;
    if (MAP.cols >= MAP.maxcells) MAP.cols = MAP.maxcells;

    // Ajust variables depending on width/height ratio
    if (w > h) {
      w -= MAP.Lmargin;
      MAP.cols = Math.round(MAP.rows * h / w);
      MAP.CellSize = Math.round(w / (MAP.rows - 2));
      MAP.marginLeft = MAP.Smargin;
      MAP.marginRight = MAP.Smargin + MAP.Lmargin;
      MAP.marginTop = MAP.Smargin;
      MAP.marginBottom = MAP.Smargin;
    } else {
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
  },

  // Set params based on player position
  update: function(animated) {

    // Set instant or animation mode
    if (!animated) MAP.master.style.transitionDuration = '0s';
    else MAP.master.style.transitionDuration = GAME.duration + 's';

    // Set master's top margin
    if (PLAYER.coefx == 0) MAP.master.style.marginTop = MAP.marginTop + "px";
    else if (PLAYER.coefx == 2) MAP.master.style.marginTop = window.innerHeight - MAP.height - MAP.marginBottom + "px";
    else if (window.innerHeight < window.innerWidth) MAP.master.style.marginTop = Math.round((window.innerHeight - MAP.height) / 2) + 'px ';
    else MAP.master.style.marginTop = 0 + 'px ';

    // Set master's left margin
    if (PLAYER.coefy == 0) MAP.master.style.marginLeft = MAP.marginLeft + "px";
    else if (PLAYER.coefy == 2) MAP.master.style.marginLeft = window.innerWidth - MAP.width - MAP.marginRight + "px";
    else if (window.innerHeight > window.innerWidth) MAP.master.style.marginLeft = Math.round((window.innerWidth - MAP.width) / 2) + 'px ';
    else MAP.master.style.marginLeft = 0 + 'px ';

    // Eventually translate canvas with animation
    if (!animated) return;
    let axis;
    if (PLAYER.lastdir == 'up' && PLAYER.x + 1 >= MAP.hcols && PLAYER.x + 1 <= GAME.cols - MAP.hcols) axis = 'Y(';
    else if (PLAYER.lastdir == 'down' && PLAYER.x >= MAP.hcols && PLAYER.x <= GAME.cols - MAP.hcols) axis = 'Y(-';
    else if (PLAYER.lastdir == 'left' && PLAYER.y + 1 >= MAP.hrows && PLAYER.y + 1 <= GAME.rows - MAP.hrows) axis = 'X(';
    else if (PLAYER.lastdir == 'right' && PLAYER.y >= MAP.hrows && PLAYER.y <= GAME.rows - MAP.hrows) axis = 'X(-';
    if (!axis) return;
    for (let i = 0; i < 3; i++) {
      MAP.canvas[i].style.transitionDuration = GAME.duration + 's';
      MAP.canvas[i].style.transform = 'translate' + axis + MAP.CellSize + 'px)';
    };
  },

  // Renders the grid based on device and player position
  render: function() {

    // Clear all canvas
    MAP.ctx1.clearRect(0, 0, MAP.canvas[1].width, MAP.canvas[1].height);
    MAP.ctx2.clearRect(0, 0, MAP.canvas[1].width, MAP.canvas[1].height);
    MAP.ctx3.clearRect(0, 0, MAP.canvas[1].width, MAP.canvas[1].height);

    // Get canvas back to origin
    for (let i = 0; i < 3; i++) {
      MAP.canvas[i].style.transitionDuration = '0s';
      MAP.canvas[i].style.transform = 'translate(0, 0)';
      MAP.canvas[i].style.top = '-' + MAP.CellSize * PLAYER.coefx + 'px';
      MAP.canvas[i].style.left = '-' + MAP.CellSize * PLAYER.coefy + 'px';
    }

    // Draw all allowed cells
    GAME.allowed.forEach(function(position) {
      Cell.allow(position);
    });

    // Draw all colored cells
    let len = GAME.colors.length;
    for (let i = 0; i < len; i++)
      if (GAME.colors[i] !== null) Cell.render(i, GAME.colors[i]);

    // Draw all positions
    GAME.positions.forEach(function(position) {
      Cell.position(position);
    });

  },

};

const Cell = {

  posinview: function(position) {
    let cell = this.indextocoord(position);
    if (PLAYER.coefx == 2) cell[0] -= GAME.cols - MAP.cols;
    else if (PLAYER.coefx == 1) cell[0] -= PLAYER.x - MAP.hcols;
    if (PLAYER.coefy == 2) cell[1] -= GAME.rows - MAP.rows;
    else if (PLAYER.coefy == 1) cell[1] -= PLAYER.y - MAP.hrows;
    return [cell[0], cell[1]];
  },

  check: function(position) {
    let cell = this.posinview(position);
    if (cell[0] >= 0 && cell[0] <= MAP.cols && cell[1] >= 0 && cell[1] <= MAP.rows) return [cell[0], cell[1]];
  },

  render: function(position, color) {
    let cell = this.check(position);
    if (!cell) return;
    MAP.ctx2.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
    MAP.ctx2.fillStyle = color;
    MAP.ctx2.fillRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  },

  position: function(position) {
    let cell = this.check(position);
    if (cell) this.roundRect(MAP.ctx3, MAP.CellSize * cell[1] + MAP.shift * 1.5, MAP.CellSize * cell[0] + MAP.shift * 1.5, MAP.CellSize - MAP.shift * 3, MAP.CellSize - MAP.shift * 3, MAP.shift);

  },

  roundRect: function(ctx, x, y, width, height, radius) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = MAP.shift;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
  },

  clear: function(position, ctx) {
    let cell = this.check(position);
    if (cell) ctx.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  },

  allow: function(position) {
    let cell = this.check(position);
    if (!cell) return;
    MAP.ctx1.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
    MAP.ctx1.fillStyle = '#e9e9e9';
    MAP.ctx1.fillRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  },

  indextocoord: function(index) {
    let coordx = (index - (index % GAME.rows)) / GAME.cols;
    let coordy = (index % GAME.cols);
    return [coordx, coordy];
  },

};

Fill = {

  init: function(cell, color) {
    GAME.flag = false;
    this.divx = 0;
    this.divy = 0;
    this.posx = MAP.CellSize * cell[1];
    this.posy = MAP.CellSize * (cell[0] + 1);
    this.lw = MAP.lw;
    MAP.ctx2.strokeStyle = color;
    MAP.ctx2.lineWidth = MAP.lw;
    this.frame();
  },

  frame: function() {
    if (Fill.divx == MAP.CellSize) {
      Fill.divy += Fill.lw;
      Fill.divx = 0;
    }
    Fill.divx += Math.round(MAP.CellSize / 8);
    if (Fill.divx >= MAP.CellSize * 0.65) {
      Fill.divx = MAP.CellSize;
    }
    if (Fill.divy > MAP.CellSize * 4.5 / 6) {
      Fill.lw = MAP.CellSize - Fill.divy;
      MAP.ctx2.lineWidth = Fill.lw;
      Fill.divy = MAP.CellSize - Fill.lw;
    }
    MAP.ctx2.strokeStyle = Fill.color;
    MAP.ctx2.beginPath();
    MAP.ctx2.moveTo(Fill.posx, Fill.posy - Fill.divy - Fill.lw / 2);
    MAP.ctx2.lineTo(Fill.posx + Fill.divx, Fill.posy - Fill.divy - Fill.lw / 2);
    MAP.ctx2.stroke();
    if (Fill.divy > MAP.CellSize * 4.5 / 6 && Fill.divx == MAP.CellSize) {
      GAME.flag = true;
      return;
    };
    Fill.animationFrame = window.requestAnimationFrame(Fill.frame);
  }

};

Translate = {

  init: function() {
    GAME.flag = false;
    GAME.update(true);
    this.start = Date.now();
    this.frame();
  },

  frame: function() {
    Translate.delta = (Date.now() - Translate.start) / 1000;
    if (Translate.delta >= GAME.duration) {
      MAP.render();
      GAME.flag = true;
      return;
    }
    Translate.animationFrame = window.requestAnimationFrame(Translate.frame);
  }

};

// TODO: fix xy inversion
// TODO: fix can't access cell 0,0
// TODO: startcell according to device
// TODO: button position according to w h ratio
// TODO: margin for ui right, left or bottom
// TODO: fix margins
// TODO: erase color ?
// TODO: darken /lighten selected color
// TODO: use prepared palettes
// TODO: add tutorial
// TODO: eventually animate other's move
