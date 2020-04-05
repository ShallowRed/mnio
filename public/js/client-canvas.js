// TODO: fix xy inversion

var master = document.getElementById('master');
var MapCanvas = document.querySelectorAll(".mapcanvas");
var PlayerCanvas = document.getElementById('playercanvas');
var shadow = document.getElementById('shadow');
var ctx1 = MapCanvas[0].getContext('2d');
var ctx2 = MapCanvas[1].getContext('2d');
var ctx3 = MapCanvas[2].getContext('2d');
var playerctx = PlayerCanvas.getContext('2d');
ctx1.imageSmoothingEnabled = ctx2.imageSmoothingEnabled = ctx3.imageSmoothingEnabled = playerctx.imageSmoothingEnabled = false;

// TODO: improve scaling of player
// TODO: fix can't access cell 0,0

GAME = {

  init: function(data) {
    PLAYER.init(data);
    MAP.init();
    this.colors = data.ColorList;
    this.positions = data.PositionList;
    this.allowed = data.allowedlist;
    this.rows = data.uiparams[0];
    this.cols = data.uiparams[1];
    initflag = 1;
    c1.style.background = PLAYER.color1;
    c1.style.border = "solid 2px black";
    c2.style.background = PLAYER.pcolor2;
    c3.style.background = PLAYER.pcolor3;
    console.log(data);
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

DRAW = {
  init: function() {
    PLAYER.update(true);
    MAP.move(lastdir);
    this.start = Date.now();
    this.frame();
  },

  frame: function() {

    DRAW.delta = (Date.now() - DRAW.start) / 1000;
    if (DRAW.delta >= MAP.duration) {
      MAP.draw();
      flag = true;
      return;
    }

    DRAW.animationFrame = window.requestAnimationFrame(DRAW.frame);
  },

};

PLAYER = {

  init: function(data) {
    this.position = data.position;
    this.color1 = data.colors[0];
    this.pcolor2 = data.colors[1];
    this.pcolor3 = data.colors[2];
    this.selectedcolor = data.colors[0];
  },

  update: function(animated) {

    let coord = CELL.indextocoord(this.position);
    this.vx = this.x = coord[0];
    this.vy = this.y = coord[1];
    this.isup = this.isdown = this.isleft = this.isright = false;
    if (this.x >= GAME.rows - MAP.hcols) {
      this.vx = this.x + MAP.cols - GAME.cols - 2
      this.isdown = true;
    } else if (this.x >= MAP.hcols) {
      this.vx = MAP.hcols - 1
      this.isup = true;
    };
    if (this.y >= GAME.cols - MAP.hrows) {
      this.vy = this.y + MAP.rows - GAME.rows - 2
      this.isright = true;
    } else if (this.y >= MAP.hrows) {
      this.isleft = true;
      this.vy = MAP.hrows - 1
    };

    if (!animated) shadow.style.transitionDuration = PlayerCanvas.style.transitionDuration = "0s";
    else shadow.style.transitionDuration = PlayerCanvas.style.transitionDuration = MAP.duration + "s";
    shadow.style.top = PlayerCanvas.style.top = this.vx * MAP.CellSize + MAP.shift + "px";
    shadow.style.left = PlayerCanvas.style.left = this.vy * MAP.CellSize + MAP.shift + "px";
  },

  draw: function() {
    PlayerCanvas.style.background = PLAYER.selectedcolor;
  }

};

MAP = {

  init: function() {
    this.maxcells = 14;
    this.mincells = 5;
    this.CellSize = 50;
    this.duration = 0.2;
  },

  update: function() {

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

    master.style.width = "" + this.CellSize * (this.rows - 2) + "px";
    master.style.height = "" + this.CellSize * (this.cols - 2) + "px";
    master.style.margin = (h - this.CellSize * (this.cols - 2)) / 2 + "px " + (w - this.CellSize * (this.rows - 2)) / 2 + "px";

    topmask.style.height = (h - this.CellSize * (this.cols - 2)) / 2 + "px ";
    bottommask.style.height = (h - this.CellSize * (this.cols - 2)) / 2 + "px ";
    leftmask.style.width = (w - this.CellSize * (this.rows - 2)) / 2 + "px ";
    rightmask.style.width = (w - this.CellSize * (this.rows - 2)) / 2 + "px ";

    if (w > 650) rightmask.style.width = 100 + (w - this.CellSize * (this.rows - 2)) / 2 + "px ";
    else bottommask.style.height = 100 + (h - this.CellSize * (this.cols - 2)) / 2 + "px ";

    for (let i = 0; i < 3; i++) {
      MapCanvas[i].width = this.CellSize * this.rows;
      MapCanvas[i].height = this.CellSize * this.cols;
    }

    this.shift = Math.round(this.CellSize / 8);
    PlayerCanvas.width = this.CellSize - this.shift * 4;
    PlayerCanvas.height = this.CellSize - this.shift * 4;
    shadow.style.width = this.CellSize - this.shift * 2 - 2 + "px";
    shadow.style.height = this.CellSize - this.shift * 2 - 2 + "px";
    shadow.style.borderRadius = this.shift + "px";
    PlayerCanvas.style.borderWidth = this.shift + "px";
    PlayerCanvas.style.borderRadius = this.shift + "px";

  },

  draw: function() {
    this.clear();
    this.toOrigin();

    // Draw all allowed cells
    GAME.allowed.forEach(function(position) {
      CELL.allow(position)
    })

    // Draw all colored cells
    let len = GAME.colors.length;
    for (i = 0; i < len; i++)
      if (GAME.colors[i] !== null) CELL.fill(i, GAME.colors[i]);

    // Draw all positions
    GAME.positions.forEach(function(position) {
      CELL.position(position, "grey");
    });

  },

  move: function(dir) {
    if (!dir) return;
    let axis;
    if (dir == "up" && PLAYER.x >= this.hcols - 1 && PLAYER.x <= GAME.rows - this.hcols - 1) axis = "Y(";
    else if (dir == "down" && PLAYER.x >= this.hcols && PLAYER.x <= GAME.rows - this.hcols) axis = "Y(-";
    else if (dir == "right" && PLAYER.y >= this.hrows && PLAYER.y <= GAME.cols - this.hrows) axis = "X(-";
    else if (dir == "left" && PLAYER.y >= this.hrows - 1 && PLAYER.y <= GAME.cols - this.hrows - 1) axis = "X(";
    if (!axis) return;
    for (let i = 0; i < 3; i++) {
      MapCanvas[i].style.transitionDuration = this.duration + "s";
      MapCanvas[i].style.transform = "translate" + axis + this.CellSize + "px)";
    };
  },

  toOrigin: function() {
    let coefx = 0;
    let coefy = 0;

    if (PLAYER.isdown) coefx = 2;
    else if (PLAYER.isup) coefx = 1;
    if (PLAYER.isright) coefy = 2;
    else if (PLAYER.isleft) coefy = 1;

    for (let i = 0; i < 3; i++) {
      MapCanvas[i].style.transitionDuration = "0s";
      MapCanvas[i].style.transform = "translate(0, 0)";
      MapCanvas[i].style.position = "absolute";
      MapCanvas[i].style.top = "-" + this.CellSize * coefx + "px";
      MapCanvas[i].style.left = "-" + this.CellSize * coefy + "px";
    };
  },

  clear: function() {
    ctx1.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
  },

  zoomin: function() {
    if (this.CellSize > 100) return;
    this.CellSize += 3;
    GAME.draw();
  },

  zoomout: function() {
    if (this.CellSize < 10) return;
    this.CellSize -= 3;
    GAME.draw();
  }

};

CELL = {

  check: function(position) {
    let plpos = this.indextocoord(PLAYER.position);
    let cellpos = this.indextocoord(position);

    if (PLAYER.isdown) cellpos[0] += MAP.cols - GAME.rows;
    else if (PLAYER.isup) cellpos[0] += MAP.hcols - plpos[0];
    if (PLAYER.isright) cellpos[1] += MAP.rows - GAME.rows;
    else if (PLAYER.isleft) cellpos[1] += MAP.hrows - plpos[1];

    if (cellpos[0] < 0 || cellpos[0] > MAP.cols || cellpos[1] < 0 || cellpos[1] > MAP.rows) return;
    else return [cellpos[0], cellpos[1]];
  },

  fill: function(position, color) {
    let cell = this.check(position, this.position);
    if (!cell) return;

    ctx2.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
    ctx2.fillStyle = color;
    ctx2.fillRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize)
  },

  position: function(position, color) {
    let cell = CELL.check(position, PLAYER.position);
    if (!cell) return;
    ctx3.lineWidth = 2;
    ctx3.strokeStyle = color;
    ctx3.strokeRect(MAP.CellSize * cell[1] + 9, MAP.CellSize * cell[0] + 9, MAP.CellSize - 18, MAP.CellSize - 18);
    ctx3.lineWidth = 8;
    ctx3.strokeStyle = "white";
    ctx3.strokeRect(MAP.CellSize * cell[1] + 14, MAP.CellSize * cell[0] + 14, MAP.CellSize - 28, MAP.CellSize - 28);
    ctx3.lineWidth = 2;
    ctx3.strokeStyle = color;
    ctx3.strokeRect(MAP.CellSize * cell[1] + 18, MAP.CellSize * cell[0] + 18, MAP.CellSize - 36, MAP.CellSize - 36);
  },

  clear: function(position) {
    let cell = CELL.check(position, PLAYER.position);
    if (!cell) return;
    ctx3.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  },

  allow: function(position) {
    let cell = this.check(position, PLAYER.position);
    if (!cell) return;
    ctx1.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
    ctx1.fillStyle = "#e9e9e9";
    ctx1.fillRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize)
  },

  draw: function(position, color) {
    let cell = this.check(position, this.position);
    if (!cell) return;
    flag = false;
    window.FILL.setup(MAP.CellSize * cell[1], MAP.CellSize * (cell[0] + 1), MAP.lw, color);
    window.FILL.frame();
  },

  indextocoord: function(index) {
    let coordx = (index - (index % GAME.rows)) / GAME.cols;
    let coordy = (index % GAME.cols);
    return [coordx, coordy];
  }

};

FILL = {

  setup: function(cellx, celly, linewidth, color) {
    this.divx = 0;
    this.divy = 0;
    this.posx = cellx;
    this.posy = celly;
    this.lw = MAP.lw;
    this.color = color;
    ctx2.lineWidth = MAP.lw;
  },

  frame: function() {
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
      ctx2.lineWidth = FILL.lw;
      FILL.divy = MAP.CellSize - FILL.lw;
    }
    ctx2.strokeStyle = FILL.color;
    ctx2.beginPath();
    ctx2.moveTo(FILL.posx, FILL.posy - FILL.divy - FILL.lw / 2);
    ctx2.lineTo(FILL.posx + FILL.divx, FILL.posy - FILL.divy - FILL.lw / 2);
    ctx2.stroke();
    if (FILL.divy > MAP.CellSize * 4.5 / 6 && FILL.divx == MAP.CellSize) {
      flag = true;
      return;
    };
    FILL.animationFrame = window.requestAnimationFrame(FILL.frame);
  }

};
