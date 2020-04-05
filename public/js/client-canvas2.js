// TODO: fix xy inversion

var master = document.getElementById('master');
var PlayerCanvas = document.getElementById('playercanvas');
var shadow = document.getElementById('shadow');
var MapCanvas = document.querySelectorAll(".mapcanvas");
var ctx1 = MapCanvas[0].getContext('2d');
var ctx2 = MapCanvas[1].getContext('2d');
var ctx3 = MapCanvas[2].getContext('2d');
var playerctx = PlayerCanvas.getContext('2d');

ctx1.imageSmoothingEnabled = ctx2.imageSmoothingEnabled = ctx3.imageSmoothingEnabled = playerctx.imageSmoothingEnabled = false;

var Grows, Gcols, ViewSizeX, ViewSizeY, vrows, vcols, celltimeout, lw;
var PositionList, ColorList, AllowedList;

var maxcells = 14;
var mincells = 5;
var CellSize = 100;
var duration = 0.2;
var shift;

//////////////////////////////////////////////////////// INIT

// TODO: shift improvement
function InitData(data) {
  ColorList = data.ColorList;
  PositionList = data.PositionList;
  AllowedList = data.allowedlist;
  Grows = data.uiparams[0];
  Gcols = data.uiparams[1];
}

function SetCanvasSize() {

  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w > 650) w -= 100;
  else h -= 100;

  ViewSizeX = Math.round(w / CellSize) + 1;
  ViewSizeY = Math.round(h / CellSize) + 1;

  if (ViewSizeX > maxcells) {
    ViewSizeX = maxcells + 1;
    CellSize = Math.round(w / ViewSizeX);
    ViewSizeY = Math.round(h / CellSize) + 1;
  } else if (ViewSizeX < mincells) {
    ViewSizeX = mincells + 1;
    CellSize = Math.round(w / mincells);
    ViewSizeY = Math.round(h / CellSize) + 1;
  }

  if (ViewSizeY > maxcells) {
    ViewSizeY = maxcells + 2;
    CellSize = Math.round(w / maxcells);
    ViewSizeX = Math.round(w / CellSize) + 1;
  } else if (ViewSizeY < mincells) {
    ViewSizeY = mincells + 2;
    CellSize = Math.round(h / mincells);
    ViewSizeX = Math.round(w / CellSize) + 1;
  }

  if (ViewSizeX % 2 == 0) ViewSizeX--;
  if (ViewSizeY % 2 == 0) ViewSizeY--;

  vrows = (ViewSizeX - 1) / 2;
  vcols = (ViewSizeY - 1) / 2;
  lw = Math.round(CellSize / 6);

  master.style.width = "" + CellSize * (ViewSizeX - 2) + "px";
  master.style.height = "" + CellSize * (ViewSizeY - 2) + "px";
  master.style.margin = (h - CellSize * (ViewSizeY - 2)) / 2 + "px " + (w - CellSize * (ViewSizeX - 2)) / 2 + "px";

  topmask.style.height = (h - CellSize * (ViewSizeY - 2)) / 2 + "px ";
  bottommask.style.height = (h - CellSize * (ViewSizeY - 2)) / 2 + "px ";
  leftmask.style.width = (w - CellSize * (ViewSizeX - 2)) / 2 + "px ";
  rightmask.style.width = (w - CellSize * (ViewSizeX - 2)) / 2 + "px ";

  if (w > 650) rightmask.style.width = 100 + (w - CellSize * (ViewSizeX - 2)) / 2 + "px ";
  else bottommask.style.height = 100 + (h - CellSize * (ViewSizeY - 2)) / 2 + "px ";

  for (let i = 0; i < 3; i++) {
    MapCanvas[i].width = CellSize * ViewSizeX;
    MapCanvas[i].height = CellSize * ViewSizeY;
  }

  shift = Math.round(CellSize / 8);
  PlayerCanvas.width = CellSize - shift * 4;
  PlayerCanvas.height = CellSize - shift * 4;
  shadow.style.width = CellSize - shift * 2 -2+ "px";
  shadow.style.height = CellSize - shift * 2 -2+ "px";
  shadow.style.borderRadius = shift + "px";
  PlayerCanvas.style.borderWidth = shift + "px";
  PlayerCanvas.style.borderRadius = shift + "px";

};

//////////////////////////////////////////////////////// PLAYER // TODO: improve scaling of player // TODO: fix can't access cell 0,0

function SetPlayerInView(PLAYERPOS, animated) {
  if (!animated) shadow.style.transitionDuration = PlayerCanvas.style.transitionDuration = "0s";
  else shadow.style.transitionDuration = PlayerCanvas.style.transitionDuration = duration + "s";
  let coord = indextocoord(PLAYERPOS);

  if (coord[0] >= Grows - vcols) coord[0] += ViewSizeY - Gcols - 2;
  else if (coord[0] >= vcols) coord[0] = vcols - 1;
  if (coord[1] >= Gcols - vrows) coord[1] += ViewSizeX - Grows - 2;
  else if (coord[1] >= vrows) coord[1] = vrows - 1;

  shadow.style.top = PlayerCanvas.style.top = coord[0] * CellSize + shift + "px";
  shadow.style.left = PlayerCanvas.style.left = coord[1] * CellSize + shift + "px";
};

function DrawPlayer() {
  PlayerCanvas.style.background = selectedcolor;
};


//////////////////////////////////////////////////////// MAP

function DrawCanvas(PLAYERPOS) {
  ClearCanvas();
  canvastoorigin(PLAYERPOS);

  // Draw all allowed cells
  AllowedList.forEach(function(position) {
    drawallowed(position)
  })

  // Draw all colored cells
  let len = ColorList.length;
  for (i = 0; i < len; i++)
    if (ColorList[i] !== null) fillcell(i, ColorList[i]);

  // Draw all positions
  PositionList.forEach(function(position) {
    drawposition(position, "grey");
  });

};

function ClearCanvas() {
  ctx1.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
};

function MoveCanvas(direction, PLAYERPOS) {
  if (!direction) return;
  let coord = indextocoord(PLAYERPOS);
  let dir;
  if (direction == "up" && coord[0] >= vcols - 1 && coord[0] <= Grows - vcols - 1) dir = "Y(";
  else if (direction == "down" && coord[0] >= vcols && coord[0] <= Grows - vcols) dir = "Y(-";
  else if (direction == "right" && coord[1] >= vrows && coord[1] <= Gcols - vrows) dir = "X(-";
  else if (direction == "left" && coord[1] >= vrows - 1 && coord[1] <= Gcols - vrows - 1) dir = "X(";
  if (!dir) return;

  for (let i = 0; i < 3; i++) {
    MapCanvas[i].style.transitionDuration = duration + "s";
    MapCanvas[i].style.transform = "translate" + dir + CellSize + "px)";
  };
};

function canvastoorigin(PLAYERPOS) {
  let coord = indextocoord(PLAYERPOS);
  let coefx = 0;
  let coefy = 0;

  if (coord[0] >= Grows - vcols) coefx = 2;
  else if (coord[0] >= vcols) coefx = 1;
  if (coord[1] >= Gcols - vrows) coefy = 2;
  else if (coord[1] >= vrows) coefy = 1;

  for (let i = 0; i < 3; i++) {
    MapCanvas[i].style.transitionDuration = "0s";
    MapCanvas[i].style.transform = "translate(0, 0)";
    MapCanvas[i].style.position = "absolute";
    MapCanvas[i].style.top = "-" + CellSize * coefx + "px";
    MapCanvas[i].style.left = "-" + CellSize * coefy + "px";
  };
};

DRAW = {

  setup: function() {
    DRAW.start = Date.now();
  },


  frame: function() {

    DRAW.delta = (Date.now() - DRAW.start) / 1000;
    if (DRAW.delta >= duration) {
      DrawCanvas(PLAYERPOS);
      flag = true;
      return;
    }

    DRAW.animationFrame = window.requestAnimationFrame(DRAW.frame);
  }

};

//////////////////////////////////////////////////////// CELL

function isinview(position, PLAYERPOS) {
  let plpos = indextocoord(PLAYERPOS);
  let cellpos = indextocoord(position);

  if (plpos[0] >= Grows - vcols) cellpos[0] += ViewSizeY - Gcols;
  else if (plpos[0] >= vcols) cellpos[0] += vcols - plpos[0];
  if (plpos[1] >= Gcols - vrows) cellpos[1] += ViewSizeX - Grows;
  else if (plpos[1] >= vrows) cellpos[1] += vrows - plpos[1];

  if (cellpos[0] < 0 || cellpos[0] > ViewSizeY || cellpos[1] < 0 || cellpos[1] > ViewSizeX) return;
  else return [cellpos[0], cellpos[1]];
};

function fillcell(position, color) {
  let cell = isinview(position, PLAYERPOS);
  if (!cell) return;

  ctx2.clearRect(CellSize * cell[1], CellSize * cell[0], CellSize, CellSize);
  ctx2.fillStyle = color;
  ctx2.fillRect(CellSize * cell[1], CellSize * cell[0], CellSize, CellSize)
}

function drawcell(position, color) {
  let cell = isinview(position, PLAYERPOS);
  if (!cell) return;
  flag = false;
  window.FILL.setup(CellSize * cell[1], CellSize * (cell[0] + 1), lw, color);
  window.FILL.frame();
}

FILL = {
  setup: function(cellx, celly, linewidth, color) {
    FILL.divx = 0;
    FILL.divy = 0;
    FILL.posx = cellx;
    FILL.posy = celly;
    FILL.lw = linewidth;
    FILL.color = color;
    ctx2.lineWidth = linewidth;
  },
  frame: function() {
    if (FILL.divx == CellSize) {
      FILL.divy += FILL.lw;
      FILL.divx = 0;
    }
    FILL.divx += Math.round(CellSize / 8);
    if (FILL.divx >= CellSize * 0.65) {
      FILL.divx = CellSize;
    }
    if (FILL.divy > CellSize * 4.5 / 6) {
      FILL.lw = CellSize - FILL.divy;
      ctx2.lineWidth = FILL.lw;
      FILL.divy = CellSize - FILL.lw;
    }
    ctx2.strokeStyle = FILL.color;
    ctx2.beginPath();
    ctx2.moveTo(FILL.posx, FILL.posy - FILL.divy - FILL.lw / 2);
    ctx2.lineTo(FILL.posx + FILL.divx, FILL.posy - FILL.divy - FILL.lw / 2);
    ctx2.stroke();
    if (FILL.divy > CellSize * 4.5 / 6 && FILL.divx == CellSize) {
      flag = true;
      return;
    };
    FILL.animationFrame = window.requestAnimationFrame(FILL.frame);
  }
};

function drawallowed(position) {
  let cell = isinview(position, PLAYERPOS);
  if (!cell) return;
  ctx1.clearRect(CellSize * cell[1], CellSize * cell[0], CellSize, CellSize);
  ctx1.fillStyle = "#e9e9e9";
  ctx1.fillRect(CellSize * cell[1], CellSize * cell[0], CellSize, CellSize)
};

function drawposition(position, color) {
  let cell = isinview(position, PLAYERPOS);
  if (!cell) return;
  ctx3.lineWidth = 2;
  ctx3.strokeStyle = color;
  ctx3.strokeRect(CellSize * cell[1] + 9, CellSize * cell[0] + 9, CellSize - 18, CellSize - 18);
  ctx3.lineWidth = 8;
  ctx3.strokeStyle = "white";
  ctx3.strokeRect(CellSize * cell[1] + 14, CellSize * cell[0] + 14, CellSize - 28, CellSize - 28);
  ctx3.lineWidth = 2;
  ctx3.strokeStyle = color;
  ctx3.strokeRect(CellSize * cell[1] + 18, CellSize * cell[0] + 18, CellSize - 36, CellSize - 36);
};

function drawrect(ctx, linewidth, color, distance, start) {
  ctx.lineWidth = linewidth;
  ctx.strokeStyle = color;
  ctx.strokeRect(start + distance, start + distance, CellSize - distance * 2, CellSize - distance * 2);
}

function clearposition(position) {
  let cell = isinview(position, PLAYERPOS);
  if (!cell) return;
  ctx3.clearRect(CellSize * cell[1], CellSize * cell[0], CellSize, CellSize);
};

//////////////////////////////////////////////////////// UTILS

function indextocoord(index) {
  let coordx = (index - (index % Grows)) / Gcols;
  let coordy = (index % Gcols);
  return [coordx, coordy];
}

function coordtoindex(coord) {
  let index = Grows * coord[0] + coord[1];
  return index;
}

function zoominview() {
  if (CellSize > 100) return;
  CellSize += 3;
  SetCanvasSize();
  SetPlayerInView(PLAYERPOS, false);
  DrawPlayer();
  DrawCanvas(PLAYERPOS);
}

function zoomoutview() {
  if (CellSize < 10) return;
  CellSize -= 3;
  SetCanvasSize();
  SetPlayerInView(PLAYERPOS, false);
  DrawPlayer();
  DrawCanvas(PLAYERPOS);
}
