var ViewSize;
var master = document.getElementById('master');
var PlayerCanvas = document.getElementById('playercanvas');
var MapCanvas = document.querySelectorAll(".mapcanvas");
var ctx1 = MapCanvas[0].getContext('2d');
var ctx2 = MapCanvas[1].getContext('2d');
var ctx3 = MapCanvas[2].getContext('2d');
var playerctx = PlayerCanvas.getContext('2d');
ctx1.imageSmoothingEnabled = ctx2.imageSmoothingEnabled = ctx3.imageSmoothingEnabled = playerctx.imageSmoothingEnabled = false;

var trd = 0.2;
var lastdir;

//////////////////////////////////////////////////////// CANVAS

function SetCanvasSize() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w > h) {
    h = Math.round(h * 0.95);
    w = h;
  } else {
    w = Math.round(w * 0.95);
    h = w;
  }
  ViewSize = vcols + vrows + 1;
  CellSize = Math.round(w / ViewSize);
  let cw = CellSize * ViewSize - CellSize * 2;
  let ch = CellSize * ViewSize - CellSize * 2;

  master.style.width = "" + cw + "px";
  master.style.height = "" + ch + "px";
  master.style.margin = (window.innerHeight - ch) / 2 + "px " + (window.innerWidth - cw) / 2 + "px";

  for (let i = 0; i < 3; i++) {
    MapCanvas[i].width = cw + CellSize * 2;
    MapCanvas[i].height = ch + CellSize * 2;;
  }

  PlayerCanvas.width = CellSize;
  PlayerCanvas.height = CellSize;
};

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

  if (direction == "up" && coord[0] >= vrows - 1 && coord[0] <= Grows - vrows - 1) dir = "Y(";
  else if (direction == "down" && coord[0] >= vrows && coord[0] <= Grows - vrows) dir = "Y(-";
  else if (direction == "right" && coord[1] >= vcols && coord[1] <= Gcols - vcols) dir = "X(-";
  else if (direction == "left" && coord[1] >= vcols - 1 && coord[1] <= Gcols - vcols - 1) dir = "X(";
  if (!dir) return;

  for (let i = 0; i < 3; i++) {
    MapCanvas[i].style.transitionDuration = trd + "s";
    MapCanvas[i].style.transform = "translate" + dir + CellSize + "px)";
  };
};

function canvastoorigin(PLAYERPOS) {
  let coord = indextocoord(PLAYERPOS);
  let coefx = 0;
  let coefy = 0;

  if (coord[0] >= Grows - vrows) coefx = 2;
  else if (coord[0] >= vrows) coefx = 1;
  if (coord[1] >= Gcols - vcols) coefy = 2;
  else if (coord[1] >= vcols) coefy = 1;

  for (let i = 0; i < 3; i++) {
    MapCanvas[i].style.transitionDuration = "s";
    MapCanvas[i].style.transform = "translate(0, 0)";
    MapCanvas[i].style.position = "absolute";
    MapCanvas[i].style.top = "-" + CellSize * coefx + "px";
    MapCanvas[i].style.left = "-" + CellSize * coefy + "px";
  };
};

//////////////////////////////////////////////////////// PLAYER

function SetPlayerInView(PLAYERPOS, animated) {

  if (!animated) PlayerCanvas.style.transitionDuration = "0s";
  else PlayerCanvas.style.transitionDuration = trd + "s";

  let coord = indextocoord(PLAYERPOS);
  if (coord[0] >= Grows - vrows) coord[0] -= Grows - ViewSize + 2;
  else if (coord[0] >= vrows) coord[0] = vrows - 1;
  if (coord[1] >= Gcols - vcols) coord[1] -= Gcols - ViewSize + 2;
  else if (coord[1] >= vcols) coord[1] = vcols - 1;

  PlayerCanvas.style.top = coord[0] * CellSize + "px";
  PlayerCanvas.style.left = coord[1] * CellSize + "px";
  // TODO: fix can't access cell 0,0
};

function DrawPlayer(color) {
  let lwidth = Math.round(CellSize / 18);
  if (lwidth > 0) {
    let xx = lwidth * 1.5;
    let yy = xx + lwidth * 1.5;
    let zz = yy + lwidth * 1.5;
    drawrect(playerctx, lwidth, color, xx, 0, 0);
    drawrect(playerctx, lwidth * 2, "white", yy, 0, 0);
    drawrect(playerctx, lwidth, color, zz, 0, 0);
  } else {
    playerctx.fillStyle = "black";
    playerctx.fillRect(0, 0, CellSize, CellSize);
  };
};

//////////////////////////////////////////////////////// CELL

function isinview(position, PLAYERPOS) {
  let plpos = indextocoord(PLAYERPOS);
  let cellpos = indextocoord(position);

  if (plpos[0] >= Grows - vrows) cellpos[0] -= (Grows - ViewSize);
  else if (plpos[0] >= vrows) cellpos[0] -= (plpos[0] - vrows);
  if (plpos[1] >= Gcols - vcols) cellpos[1] -= (Gcols - ViewSize);
  else if (plpos[1] >= vcols) cellpos[1] -= (plpos[1] - vcols);

  if (cellpos[0] < 0 || cellpos[0] > ViewSize || cellpos[1] < 0 || cellpos[1] > ViewSize) return;
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
  let celldivy = 0;
  let celldivx = 0;
  let posy;

  var strokey = setInterval(function() {
    posy = CellSize * cell[0] + CellSize - celldivy - (lw / 2);

    celldivx = celldivx + lw;
    ctx2.beginPath();
    ctx2.moveTo(CellSize * cell[1], posy);
    ctx2.lineWidth = lw;
    ctx2.strokeStyle = color;
    ctx2.fillStyle = color;
    ctx2.lineTo(CellSize * cell[1] + celldivx, posy);
    ctx2.stroke();
    ctx2.closePath();

    if (celldivx >= CellSize - lw) {
      celldivy = celldivy + lw;
      ctx2.moveTo(CellSize * cell[1], posy);
      ctx2.lineWidth = lw;
      ctx2.strokeStyle = color;
      ctx2.fillStyle = color;
      ctx2.lineTo(CellSize * cell[1] + CellSize, posy);
      ctx2.stroke();
      ctx2.closePath();
      celldivx = 0;
    }

    if (celldivy >= CellSize - lw) {
      fillcell(position);
      flag = true;
      clearInterval(strokey);
    }
  }, celltimeout);
}

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

function clearposition(position) {
  let cell = isinview(position, PLAYERPOS);
  if (!cell) return;
  ctx3.clearRect(CellSize * cell[1], CellSize * cell[0], CellSize, CellSize);
};

//////////////////////////////////////////////////////// UTILS

function drawrect(ctx, linewidth, color, distance, xstart, ystart) {
  ctx.lineWidth = linewidth;
  ctx.strokeStyle = color;
  ctx.strokeRect(xstart + distance, ystart + distance, CellSize - distance * 2, CellSize - distance * 2);
}

function indextocoord(index) {
  let coordx = (index - (index % Grows)) / Gcols;
  let coordy = (index % Gcols);
  return [coordx, coordy];
}

function coordtoindex(coord) {
  let index = Grows * coord[0] + coord[1];
  return index;
}

// TODO: all browsers transitions
// -webkit-transition: all 0.5s ease;
// -moz-transition: all 0.5s ease;
// -ms-transition: all 0.5s ease;
// -o-transition: all 0.5s ease;
// transition: all 0.5s ease;
