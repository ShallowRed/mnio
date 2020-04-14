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

    this.render();
    HideLobby();
    this.flag = true;
  },

  render: function() {
    MAP.update();
    PLAYER.update();
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

    // Instant changes if no argument, animated if one
    if (!animated) this.shadow.style.transitionDuration = this.canvas.style.transitionDuration = MAP.master.style.transitionDuration = '0s';
    else this.shadow.style.transitionDuration = this.canvas.style.transitionDuration = MAP.master.style.transitionDuration = GAME.duration + 's';
    this.x = Cell.indextocoord(this.position)[0];
    this.y = Cell.indextocoord(this.position)[1];

    // Check where player is, eventually update map's margin
    if (this.x < MAP.hcols) {
      this.vx = this.x;
      MAP.master.style.marginTop = MAP.marginX + "px";
      MAP.coefx = 0;
    } else if (this.x > GAME.cols - MAP.hcols) {
      this.vx = this.x + MAP.cols - GAME.cols - 2;
      MAP.master.style.marginTop = window.innerHeight - MAP.height - MAP.marginX + "px";
      MAP.coefx = 2;
    } else {
      this.vx = MAP.hcols - 1;
      MAP.master.style.marginTop = Math.round((window.innerHeight - MAP.height) / 2) + 'px ';
      MAP.coefx = 1;
    }

    if (this.y < MAP.hrows) {
      this.vy = this.y;
      MAP.master.style.marginLeft = MAP.marginY + "px";
      MAP.coefy = 0;
    } else if (this.y > GAME.rows - MAP.hrows) {
      this.vy = this.y + MAP.rows - GAME.rows - 2;
      MAP.master.style.marginLeft = window.innerWidth - MAP.width - MAP.marginY + "px";
      MAP.coefy = 2;
    } else {
      this.vy = MAP.hrows - 1;
      MAP.master.style.marginLeft = Math.round((window.innerWidth - MAP.width) / 2) + 'px ';
      MAP.coefy = 1;
    }

    // Eventually update player position in view
    this.shadow.style.top = this.canvas.style.top = this.vx * MAP.CellSize + MAP.shift + 'px';
    this.shadow.style.left = this.canvas.style.left = this.vy * MAP.CellSize + MAP.shift + 'px';

    // Eventually translate the map
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

  render: function() {
    this.canvas.style.background = PLAYER.selectedcolor;
  }

};

const MAP = {

  init: function() {
    this.maxcells = 71;
    this.startcells = 31;
    this.mincells = 11;
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

  update: function() { // TODO: margin for ui right, left or bottom
    let w = window.innerWidth;
    let h = window.innerHeight;

    // Set cell size and amount in view
    if (!this.rows) {
      this.rows = this.startcells;
      this.cols = Math.round(this.rows * h / w);
    }
    if (!this.cols) {
      this.cols = this.startcells;
      this.rows = Math.round(this.cols * w / h);
    }
    if (this.rows < this.mincells) {
      this.rows = this.mincells;
      this.cols = Math.round(this.rows * h / w);
    }
    if (this.cols < this.mincells) {
      this.cols = this.mincells;
      this.rows = Math.round(this.cols * w / h);
    }
    if (this.rows > this.maxcells) {
      this.rows = this.maxcells;
      this.cols = Math.round(this.rows * h / w);
    }
    if (this.cols > this.maxcells) {
      this.cols = this.maxcells;
      this.rows = Math.round(this.cols * w / h);
    }

    if (w > h) {
      this.cols = Math.round(this.rows * h / w);
      this.CellSize = Math.round(w / (this.rows - 2));
    } else {
      this.rows = Math.round(this.cols * w / h);
      this.CellSize = Math.round(h / (this.cols - 2));
    }

    if (this.cols % 2 == 0) this.cols++;
    if (this.rows % 2 == 0) this.rows++;

    // Update map variables
    this.hrows = (this.rows - 1) / 2;
    this.hcols = (this.cols - 1) / 2;
    this.lw = Math.round(this.CellSize / 6);
    this.width = this.CellSize * (this.rows - 2);
    this.height = this.CellSize * (this.cols - 2);
    this.marginX = this.marginY = 30;
    // this.marginX = this.marginY = Math.round(0.05 * w);

    //Set canvas size
    this.master.style.width = this.width + 'px';
    this.master.style.height = this.height + 'px';

    this.topmask.style.height = this.marginX + "px";
    this.bottommask.style.height = this.marginX + "px";

    this.leftmask.style.width = this.marginY + "px";
    this.rightmask.style.width = this.marginY + "px";

    for (let i = 0; i < 3; i++) {
      this.canvas[i].width = this.width + this.CellSize * 2;
      this.canvas[i].height = this.height + this.CellSize * 2;
    }

    // Set player size
    this.shift = Math.round(this.CellSize / 8);
    PLAYER.canvas.width = PLAYER.canvas.height = this.CellSize - this.shift * 4;
    PLAYER.shadow.style.width = PLAYER.shadow.style.height = this.CellSize - this.shift * 2 - 2 + 'px';
    PLAYER.shadow.style.borderRadius = PLAYER.canvas.style.borderWidth = PLAYER.canvas.style.borderRadius = this.shift + 'px';
  },

  render: function() {

    //Clear all canvas
    this.ctx1.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height);
    this.ctx2.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height);
    this.ctx3.clearRect(0, 0, this.canvas[1].width, this.canvas[1].height);

    // Move canvas back to origin
    for (let i = 0; i < 3; i++) {
      this.canvas[i].style.transitionDuration = '0s';
      this.canvas[i].style.transform = 'translate(0, 0)';
      this.canvas[i].style.top = '-' + this.CellSize * this.coefx + 'px';
      this.canvas[i].style.left = '-' + this.CellSize * this.coefy + 'px';
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
      Cell.position(position, 'grey');
    });

  },

};


const Cell = { // TODO: erase color ?
  // TODO: darken /lighten selected color

  check: function(position) {
    let cell = this.indextocoord(position);
    if (MAP.coefx == 2) cell[0] -= GAME.cols - MAP.cols;
    else if (MAP.coefx == 1) cell[0] -= PLAYER.x - MAP.hcols;
    if (MAP.coefy == 2) cell[1] -= GAME.rows - MAP.rows;
    else if (MAP.coefy == 1) cell[1] -= PLAYER.y - MAP.hrows;
    if (cell[0] >= 0 && cell[0] <= MAP.cols && cell[1] >= 0 && cell[1] <= MAP.rows) return [cell[0], cell[1]];
  },

  render: function(position, color) {
    let cell = this.check(position);
    if (!cell) return;
    MAP.ctx2.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
    MAP.ctx2.fillStyle = color;
    MAP.ctx2.fillRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  },

  position: function(position, color) {
    let cell = this.check(position);
    if (!cell) return;
    // MAP.ctx3.lineWidth = 2;
    // MAP.ctx3.strokeStyle = color;
    // MAP.ctx3.strokeRect(MAP.CellSize * cell[1] + 9, MAP.CellSize * cell[0] + 9, MAP.CellSize - 18, MAP.CellSize - 18);
    // MAP.ctx3.lineWidth = 8;
    // MAP.ctx3.strokeStyle = 'white';
    // MAP.ctx3.strokeRect(MAP.CellSize * cell[1] + 14, MAP.CellSize * cell[0] + 14, MAP.CellSize - 28, MAP.CellSize - 28);
    // MAP.ctx3.lineWidth = 2;
    // MAP.ctx3.strokeStyle = color;
    // MAP.ctx3.strokeRect(MAP.CellSize * cell[1] + 18, MAP.CellSize * cell[0] + 18, MAP.CellSize - 36, MAP.CellSize - 36);
    roundRect(MAP.ctx3, MAP.CellSize * cell[1] + MAP.shift*1.5, MAP.CellSize * cell[0] + MAP.shift*1.5, MAP.CellSize - MAP.shift * 3, MAP.CellSize - MAP.shift * 3, MAP.shift);

  },

  clear: function(position, ctx) {
    let cell = this.check(position);
    if (!cell) return;
    ctx.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
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

// TODO: clean roundrect and eventually anmated other's move
function roundRect(ctx, x, y, width, height, radius) {
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
}

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
    PLAYER.update(true);
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
