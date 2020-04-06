// TODO: fix xy inversion
// TODO: improve scaling of player
// TODO: fix can't access cell 0,0

var GAME = {
  setup : function(data) {
    this.colors = data.ColorList;
    this.positions = data.PositionList;
    this.allowed = data.allowedlist;
    this.rows = data.uiparams[0];
    this.cols = data.uiparams[1];
    this.duration = 0.2;
    this.player = new PLAYER(data)
    this.map = new MAP(this.rows, this.cols)
    this.init();
  },

  init : function(){
    this.player.init();
    this.map.init();
    c1.style.background = PLAYER.color1;
    c1.style.border = 'solid 2px black';
    c2.style.background = PLAYER.color2;
    c3.style.background = PLAYER.color3;
    this.draw();
    HideLobby();
    flag = true;
  },

  draw : function(){
    this.map.update(this.player);
    this.player.update(this, false);
    this.map.draw(this);
    this.player.draw();
  }
};

class PLAYER {
  constructor(data) {
    this.position = data.position;
    this.color1 = data.colors[0];
    this.color2 = data.colors[1];
    this.color3 = data.colors[2];
    this.selectedcolor = data.colors[0];
    this.canvas = document.getElementById('playercanvas');
    this.shadow = document.getElementById('shadow');
    this.ctx = this.canvas.getContext('2d');
  }

  init() {
    this.ctx.imageSmoothingEnabled = false;
  }

  update(GAME, animated) {

    let coord = CELL.indextocoord(GAME, this.position);
    this.vx = this.x = coord[0];
    this.vy = this.y = coord[1];
    this.isup = this.isdown = this.isleft = this.isright = false;
    if (this.x >= GAME.rows - GAME.map.hcols) {
      this.vx = this.x + GAME.map.cols - GAME.cols - 2;
      this.isdown = true;
    } else if (this.x >= GAME.map.hcols) {
      this.vx = GAME.map.hcols - 1;
      this.isup = true;
    }
    if (this.y >= GAME.cols - GAME.map.hrows) {
      this.vy = this.y + GAME.map.rows - GAME.rows - 2
      this.isright = true;
    } else if (this.y >= GAME.map.hrows) {
      this.isleft = true;
      this.vy = GAME.map.hrows - 1
    }

    if (!animated) this.shadow.style.transitionDuration = this.canvas.style.transitionDuration = '0s';
    else this.shadow.style.transitionDuration = this.canvas.style.transitionDuration = GAME.duration + 's';
    this.shadow.style.top = this.canvas.style.top = this.vx * GAME.map.CellSize + GAME.map.shift + 'px';
    this.shadow.style.left = this.canvas.style.left = this.vy * GAME.map.CellSize + GAME.map.shift + 'px';
  }

  draw() {
    this.canvas.style.background = this.selectedcolor;
  }
};

class MAP {
  constructor(rows, cols) {
    this.mincells = 5;
    this.CellSize = 50;
    this.master = document.getElementById('master');
    this.canvas = document.querySelectorAll('.mapcanvas');
    this.ctx1 = this.canvas[0].getContext('2d');
    this.ctx2 = this.canvas[1].getContext('2d');
    this.ctx3 = this.canvas[2].getContext('2d');
    this.topmask = document.getElementById('topmask');
    this.bottommask = document.getElementById('bottommask');
    this.leftmask = document.getElementById('leftmask');
    this.rightmask = document.getElementById('rightmask');
    this.maxcells = 14;
    this.hrows = (rows - 1) / 2;
    this.hcols = (cols - 1) / 2;
    this.lw = Math.round(this.CellSize / 6);
  }

  init() {
    this.ctx1.imageSmoothingEnabled = this.ctx2.imageSmoothingEnabled = this.ctx3.imageSmoothingEnabled = false;
  }

  update(PLAYER) {

    let w = window.innerWidth;
    let h = window.innerHeight;
    if (w > 650) w -= 100;
    else h -= 100;

    this.rows = Math.round(w / this.CellSize) + 1;
    this.cols = Math.round(h / this.CellSize) + 1;

    if (this.rows > this.maxcells) {
      this.rows = this.maxcells + 1;
      this.CellSize = Math.round(w / this.rows);
      this.cols = Math.round(h / this.CellSize) + 1;
    } else if (this.rows < this.mincells) {
      this.rows = this.mincells + 1;
      this.CellSize = Math.round(w / this.mincells);
      this.cols = Math.round(h / this.CellSize) + 1;
    }

    if (this.cols > this.maxcells) {
      this.cols = this.maxcells + 2;
      this.CellSize = Math.round(w / this.maxcells);
      this.rows = Math.round(w / this.CellSize) + 1;
    } else if (this.cols < this.mincells) {
      this.cols = this.mincells + 2;
      this.CellSize = Math.round(h / this.mincells);
      this.rows = Math.round(w / this.CellSize) + 1;
    }

    if (this.rows % 2 == 0) this.rows--;
    if (this.cols % 2 == 0) this.cols--;

    this.hrows = (this.rows - 1) / 2;
    this.hcols = (this.cols - 1) / 2;
    this.lw = Math.round(this.CellSize / 6);

    this.master.style.width = '' + this.CellSize * (this.rows - 2) + 'px';
    this.master.style.height = '' + this.CellSize * (this.cols - 2) + 'px';
    this.master.style.margin = (h - this.CellSize * (this.cols - 2)) / 2 + 'px ' + (w - this.CellSize * (this.rows - 2)) / 2 + 'px';

    this.topmask.style.height = (h - this.CellSize * (this.cols - 2)) / 2 + 'px ';
    this.bottommask.style.height = (h - this.CellSize * (this.cols - 2)) / 2 + 'px ';
    this.leftmask.style.width = (w - this.CellSize * (this.rows - 2)) / 2 + 'px ';
    this.rightmask.style.width = (w - this.CellSize * (this.rows - 2)) / 2 + 'px ';
    if (w > 650) this.rightmask.style.width = 100 + (w - this.CellSize * (this.rows - 2)) / 2 + 'px ';
    else this.bottommask.style.height = 100 + (h - this.CellSize * (this.cols - 2)) / 2 + 'px ';

    for (let i = 0; i < 3; i++) {
      this.canvas[i].width = this.CellSize * this.rows;
      this.canvas[i].height = this.CellSize * this.cols;
    }

    this.shift = Math.round(this.CellSize / 8);

    PLAYER.canvas.width = this.CellSize - this.shift * 4;
    PLAYER.canvas.height = this.CellSize - this.shift * 4;
    PLAYER.shadow.style.width = this.CellSize - this.shift * 2 - 2 + 'px';
    PLAYER.shadow.style.height = this.CellSize - this.shift * 2 - 2 + 'px';
    PLAYER.shadow.style.borderRadius = this.shift + 'px';
    PLAYER.canvas.style.borderWidth = this.shift + 'px';
    PLAYER.canvas.style.borderRadius = this.shift + 'px';

  }

  draw(GAME) {
    this.clear();
    this.origin(GAME.player);

    // Draw all allowed cells
    GAME.allowed.forEach(function(position) {
      CELL.allow(GAME, GAME.map, GAME.player, position);
    });

    // Draw all colored cells
    let len = GAME.colors.length;
    for (let i = 0; i < len; i++)
      if (GAME.colors[i] !== null) CELL.fill(GAME, GAME.map, GAME.player, i, GAME.colors[i]);
    // Draw all positions
    GAME.positions.forEach(function(position) {
      CELL.position(GAME, GAME.map, GAME.player, position, 'grey');
    });

  }

  move(GAME, dir) {
    if (!dir) return;
    let axis;
    if (dir == 'up' && GAME.player.x >= this.hcols - 1 && GAME.player.x <= GAME.rows - this.hcols - 1) axis = 'Y(';
    else if (dir == 'down' && GAME.player.x >= this.hcols && GAME.player.x <= GAME.rows - this.hcols) axis = 'Y(-';
    else if (dir == 'right' && GAME.player.y >= this.hrows && GAME.player.y <= GAME.cols - this.hrows) axis = 'X(-';
    else if (dir == 'left' && GAME.player.y >= this.hrows - 1 && GAME.player.y <= GAME.cols - this.hrows - 1) axis = 'X(';
    if (!axis) return;
    for (let i = 0; i < 3; i++) {
      this.canvas[i].style.transitionDuration = GAME.duration + 's';
      this.canvas[i].style.transform = 'translate' + axis + this.CellSize + 'px)';
    };
  }

  origin(PLAYER) {
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
  }

  clear() {
    this.ctx1.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height);
    this.ctx2.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height);
    this.ctx3.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height);
  }

  zoomin(GAME) {
    if (this.CellSize > 100) return;
    this.CellSize += 3;
    GAME.draw();
  }

  zoomout(GAME) {
    if (this.CellSize < 10) return;
    this.CellSize -= 3;
    GAME.draw();
  }

};

const CELL = {

  check: function(GAME, position) {
    let cell = this.indextocoord(GAME, position);

    if (GAME.player.isdown) cell[0] -= GAME.cols - GAME.map.cols;
    else if (GAME.player.isup) cell[0] -= GAME.player.x - GAME.map.hcols;
    if (GAME.player.isright) cell[1] -= GAME.rows - GAME.map.rows;
    else if (GAME.player.isleft) cell[1] -= GAME.player.y - GAME.map.hrows;

    if (cell[0] < 0 || cell[0] > GAME.map.cols || cell[1] < 0 || cell[1] > GAME.map.rows) return;
    else return [cell[0], cell[1]];
  },

  fill: function(GAME, position, color) {
    let cell = this.check(GAME, position);
    if (!cell) return;

    GAME.map.ctx2.fillStyle = color;
    GAME.map.ctx2.clearRect(GAME.map.CellSize * cell[1], GAME.map.CellSize * cell[0], GAME.map.CellSize, GAME.map.CellSize);
    GAME.map.ctx2.fillRect(GAME.map.CellSize * cell[1], GAME.map.CellSize * cell[0], GAME.map.CellSize, GAME.map.CellSize);
  },

  position: function(GAME, position, color) {
    let cell = CELL.check(GAME, position);
    if (!cell) return;
    GAME.map.ctx3.lineWidth = 2;
    GAME.map.ctx3.strokeStyle = color;
    GAME.map.ctx3.strokeRect(GAME.map.CellSize * cell[1] + 9, GAME.map.CellSize * cell[0] + 9, GAME.map.CellSize - 18, GAME.map.CellSize - 18);
    GAME.map.ctx3.lineWidth = 8;
    GAME.map.ctx3.strokeStyle = 'white';
    GAME.map.ctx3.strokeRect(GAME.map.CellSize * cell[1] + 14, GAME.map.CellSize * cell[0] + 14, GAME.map.CellSize - 28, GAME.map.CellSize - 28);
    GAME.map.ctx3.lineWidth = 2;
    GAME.map.ctx3.strokeStyle = color;
    GAME.map.ctx3.strokeRect(GAME.map.CellSize * cell[1] + 18, GAME.map.CellSize * cell[0] + 18, GAME.map.CellSize - 36, GAME.map.CellSize - 36);
  },

  clear: function(GAME, position) {
    let cell = CELL.check(GAME, position);
    if (!cell) return;
    GAME.map.ctx3.clearRect(GAME.map.CellSize * cell[1], GAME.map.CellSize * cell[0], GAME.map.CellSize, GAME.map.CellSize);
  },

  allow: function(GAME, position) {
    let cell = this.check(GAME, position);
    if (!cell) return;
    GAME.map.ctx1.clearRect(GAME.map.CellSize * cell[1], GAME.map.CellSize * cell[0], GAME.map.CellSize, GAME.map.CellSize);
    GAME.map.ctx1.fillStyle = '#e9e9e9';
    GAME.map.ctx1.fillRect(GAME.map.CellSize * cell[1], GAME.map.CellSize * cell[0], GAME.map.CellSize, GAME.map.CellSize);
  },

  indextocoord: function(GAME, index) {
    let coordx = (index - (index % GAME.rows)) / GAME.cols;
    let coordy = (index % GAME.cols);
    return [coordx, coordy];
  },

  draw: function(GAME) {
    flag = false;
    window.FILL.init(GAME);
  }

};

FILL = {

  init: function(GAME) {
    this.divx = 0;
    this.divy = 0;
    this.posx = GAME.map.CellSize * GAME.player.x;
    this.posy = GAME.map.CellSize * (GAME.player.y + 1);
    this.lw = GAME.map.lw;
    GAME.map.ctx2.lineWidth = GAME.map.lw;
    this.color = GAME.player.selectedcolor;
    FILL.frame(GAME.map);
  },

  frame: function(MAP) {
    if (FILL.divx == MAP.CellSize) {
      FILL.divy += FILL.lw;
      FILL.divx = 0;
    }
    FILL.divx += Math.round(MAP.CellSize / 8);
    if (FILL.divx >= MAP.CellSize * 0.65) {
      FILL.divx = MAP.CellSize;
    }
    if (FILL.divy > MAP.CellSize * 4.5 / 6) {
      FILL.lw = MAP.CellSize - FILL.divy;
      MAP.ctx2.lineWidth = FILL.lw;
      FILL.divy = MAP.CellSize - FILL.lw;
    }
    MAP.ctx2.strokeStyle = FILL.color;
    MAP.ctx2.beginPath();
    MAP.ctx2.moveTo(FILL.posx, FILL.posy - FILL.divy - FILL.lw / 2);
    MAP.ctx2.lineTo(FILL.posx + FILL.divx, FILL.posy - FILL.divy - FILL.lw / 2);
    MAP.ctx2.stroke();
    if (FILL.divy > MAP.CellSize * 4.5 / 6 && FILL.divx == MAP.CellSize) {
      flag = true;
      return;
    };
    FILL.animationFrame = window.requestAnimationFrame(function() {
      FILL.frame(MAP)
    });
  }

};

DRAW = {

  init: function(GAME) {
    GAME.player.update(GAME, true);
    GAME.map.move(lastdir);
    this.start = Date.now();
    this.frame(GAME);
  },

  frame: function(GAME) {
    DRAW.delta = (Date.now() - DRAW.start) / 1000;
    if (DRAW.delta >= GAME.duration) {
      GAME.map.draw();
      flag = true;
      return;
    }
    DRAW.animationFrame = window.requestAnimationFrame(DRAW.frame);
  }

};
