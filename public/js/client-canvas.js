// TODO: fix xy inversion
// TODO: fix can't access cell 0,0

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

    this.draw();
    HideLobby();
    flag = true;
  },

  draw: function() {
    MAP.update();
    PLAYER.update(false);
    PLAYER.draw();
    MAP.draw();
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

    let coord = Cell.indextocoord(this.position);
    this.vx = this.x = coord[0];
    this.vy = this.y = coord[1];
    this.isup = this.isdown = this.isleft = this.isright = false;

    if (this.x >= GAME.rows - MAP.hcols) {
      this.vx = this.x + MAP.cols - GAME.cols - 2;
      this.isdown = true;
    } else if (this.x >= MAP.hcols) {
      this.vx = MAP.hcols - 1;
      this.isup = true;
    }

    if (this.y >= GAME.cols - MAP.hrows) {
      this.vy = this.y + MAP.rows - GAME.rows - 2
      this.isright = true;
    } else if (this.y >= MAP.hrows) {
      this.isleft = true;
      this.vy = MAP.hrows - 1
    }

    if (!animated) this.shadow.style.transitionDuration = this.canvas.style.transitionDuration = '0s';
    else this.shadow.style.transitionDuration = this.canvas.style.transitionDuration = GAME.duration + 's';
    this.shadow.style.top = this.canvas.style.top = this.vx * MAP.CellSize + MAP.shift + 'px';
    this.shadow.style.left = this.canvas.style.left = this.vy * MAP.CellSize + MAP.shift + 'px';
  },

  draw: function() {
    this.canvas.style.background = PLAYER.selectedcolor;
  }

};

const MAP = {

  maxcells: 50,
  mincells: 15,

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

  update: function() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    if (w > 650) w -= 100;
    else h -= 100;
    this.setCellSize(w, h);
    this.setrowcol(w, h);
    this.lw = Math.round(this.CellSize / 6);
    this.setmaster(this.CellSize * this.rows, this.CellSize * this.cols);
    this.setcanvas();
    this.setplayer();
  },

  setCellSize: function(w, h) {
    if(!this.rows) this.rows = this.mincells;
    if(!this.cols) this.cols = this.mincells;
    if (w > h) this.CellSize = Math.round(w / this.rows);
    else this.CellSize = Math.round(h / this.cols);
    if (this.rows >= this.maxcells) this.CellSize = Math.round(w / this.maxcells);
    if (this.cols >= this.maxcells) this.CellSize = Math.round(h / this.maxcells);
    if (this.rows <= this.mincells) this.CellSize = Math.round(w / this.mincells);
    if (this.cols <= this.mincells) this.CellSize = Math.round(h / this.mincells);
  },

  setrowcol: function(w, h) {
    this.cols = Math.round(h / this.CellSize);
    this.rows = Math.round(w / this.CellSize);
    if (this.rows % 2 == 0) this.rows--;
    if (this.cols % 2 == 0) this.cols--;
    this.hrows = (this.rows - 1) / 2;
    this.hcols = (this.cols - 1) / 2;
    this.lw = Math.round(this.CellSize / 6);
  },

  setmaster: function(w, h) {
    this.master.style.width = this.CellSize * (this.rows - 2) + 'px';
    this.master.style.height = this.CellSize * (this.cols - 2) + 'px';
    this.master.style.margin = this.CellSize + 'px ' + this.CellSize + 'px';

    this.topmask.style.height = this.CellSize + 'px ';
    this.bottommask.style.height = this.CellSize + 'px ';
    this.leftmask.style.width = this.CellSize + 'px ';
    this.rightmask.style.width = this.CellSize + 'px ';
    if (w > 650) this.rightmask.style.width = 100 + (w - this.CellSize * (this.rows - 2)) / 2 + 'px ';
    else this.bottommask.style.height = 100 + (h - this.CellSize * (this.cols - 2)) / 2 + 'px ';
  },

  setcanvas: function() {
    for (let i = 0; i < 3; i++) {
      this.canvas[i].width = this.CellSize * this.rows;
      this.canvas[i].height = this.CellSize * this.cols;
    }
  },

  setplayer: function() {
    this.shift = Math.round(this.CellSize / 8);
    PLAYER.canvas.width = this.CellSize - this.shift * 4;
    PLAYER.canvas.height = this.CellSize - this.shift * 4;
    PLAYER.shadow.style.width = this.CellSize - this.shift * 2 - 2 + 'px';
    PLAYER.shadow.style.height = this.CellSize - this.shift * 2 - 2 + 'px';
    PLAYER.shadow.style.borderRadius = this.shift + 'px';
    PLAYER.canvas.style.borderWidth = this.shift + 'px';
    PLAYER.canvas.style.borderRadius = this.shift + 'px';
  },

  draw: function() {
    this.clear();
    this.origin();

    // Draw all allowed cells
    GAME.allowed.forEach(function(position) {
      Cell.allow(position);
    });

    // Draw all colored cells
    let len = GAME.colors.length;
    for (let i = 0; i < len; i++)
      if (GAME.colors[i] !== null) Cell.fill(i, GAME.colors[i]);

    // Draw all positions
    GAME.positions.forEach(function(position) {
      Cell.position(position, 'grey');
    });

  },

  move: function(dir) {
    if (!dir) return;
    let axis;
    if (dir == 'up' && PLAYER.x >= this.hcols - 1 && PLAYER.x <= GAME.rows - this.hcols - 1) axis = 'Y(';
    else if (dir == 'down' && PLAYER.x >= this.hcols && PLAYER.x <= GAME.rows - this.hcols) axis = 'Y(-';
    else if (dir == 'right' && PLAYER.y >= this.hrows && PLAYER.y <= GAME.cols - this.hrows) axis = 'X(-';
    else if (dir == 'left' && PLAYER.y >= this.hrows - 1 && PLAYER.y <= GAME.cols - this.hrows - 1) axis = 'X(';
    if (!axis) return;
    for (let i = 0; i < 3; i++) {
      this.canvas[i].style.transitionDuration = GAME.duration + 's';
      this.canvas[i].style.transform = 'translate' + axis + this.CellSize + 'px)';
    };
  },

  origin: function() {
    let coefx = 0;
    let coefy = 0;

    if (PLAYER.isdown) coefx = 2;
    else if (PLAYER.isup) coefx = 1;
    if (PLAYER.isright) coefy = 2;
    else if (PLAYER.isleft) coefy = 1;

    for (let i = 0; i < 3; i++) {
      this.canvas[i].style.transitionDuration = '0s';
      this.canvas[i].style.transform = 'translate(0, 0)';
      this.canvas[i].style.position = 'absolute';
      this.canvas[i].style.top = '-' + this.CellSize * coefx + 'px';
      this.canvas[i].style.left = '-' + this.CellSize * coefy + 'px';
    }
  },

  clear: function() {
    this.ctx1.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height);
    this.ctx2.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height);
    this.ctx3.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height);
  },

  zoomin: function() {
    this.rows -= 2;
    this.cols -= 2;
    GAME.draw();
  },

  zoomout: function() {
    this.rows += 2;
    this.cols += 2;
    GAME.draw();
  }

};

const Cell = {

  check: function(position) {
    let cell = this.indextocoord(position);

    if (PLAYER.isdown) cell[0] -= GAME.cols - MAP.cols;
    else if (PLAYER.isup) cell[0] -= PLAYER.x - MAP.hcols;
    if (PLAYER.isright) cell[1] -= GAME.rows - MAP.rows;
    else if (PLAYER.isleft) cell[1] -= PLAYER.y - MAP.hrows;

    if (cell[0] < 0 || cell[0] > MAP.cols || cell[1] < 0 || cell[1] > MAP.rows) return;
    else return [cell[0], cell[1]];
  },

  fill: function(position, color) {
    let cell = this.check(position, this.position);
    if (!cell) return;

    MAP.ctx2.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
    MAP.ctx2.fillStyle = color;
    MAP.ctx2.fillRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  },

  position: function(position, color) {
    let cell = Cell.check(position, PLAYER.position);
    if (!cell) return;
    MAP.ctx3.lineWidth = 2;
    MAP.ctx3.strokeStyle = color;
    MAP.ctx3.strokeRect(MAP.CellSize * cell[1] + 9, MAP.CellSize * cell[0] + 9, MAP.CellSize - 18, MAP.CellSize - 18);
    MAP.ctx3.lineWidth = 8;
    MAP.ctx3.strokeStyle = 'white';
    MAP.ctx3.strokeRect(MAP.CellSize * cell[1] + 14, MAP.CellSize * cell[0] + 14, MAP.CellSize - 28, MAP.CellSize - 28);
    MAP.ctx3.lineWidth = 2;
    MAP.ctx3.strokeStyle = color;
    MAP.ctx3.strokeRect(MAP.CellSize * cell[1] + 18, MAP.CellSize * cell[0] + 18, MAP.CellSize - 36, MAP.CellSize - 36);
  },

  clear: function(position) {
    let cell = Cell.check(position, PLAYER.position);
    if (!cell) return;
    MAP.ctx3.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  },

  allow: function(position) {
    let cell = this.check(position, PLAYER.position);
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

  draw: function(position, color) {
    let cell = this.check(position, this.position);
    if (!cell) return;
    flag = false;
    window.Fill.init(cell, color);
  }

};

Fill = {

  init: function(cell, color) {
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
      flag = true;
      return;
    };
    Fill.animationFrame = window.requestAnimationFrame(Fill.frame);
  }

};

Translate = {

  init: function() {
    PLAYER.update(true);
    MAP.move(lastdir);
    this.start = Date.now();
    this.frame();
  },

  frame: function() {
    Translate.delta = (Date.now() - Translate.start) / 1000;
    if (Translate.delta >= GAME.duration) {
      MAP.draw();
      flag = true;
      return;
    }
    Translate.animationFrame = window.requestAnimationFrame(Translate.frame);
  }

};
