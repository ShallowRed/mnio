//////////// CANVAS SETUP ////////////
var viewsize;
var master = document.getElementById('master');
var canvas1 = document.getElementById('canvas1');
var canvas2 = document.getElementById('canvas2');
var canvas3 = document.getElementById('canvas3');
var canvas4 = document.getElementById('canvas4');
var ctx = canvas1.getContext('2d');
var ctx2 = canvas2.getContext('2d');
var ctx3 = canvas3.getContext('2d');
var ctx4 = canvas4.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx2.imageSmoothingEnabled = false;
ctx3.imageSmoothingEnabled = false;
ctx4.imageSmoothingEnabled = false;

function setcanvassize() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w > h) {
    h = Math.round(h * 0.95);
    w = h;
  } else {
    w = Math.round(w * 0.95);
    h = w;
  }
  viewsize = vcols + vrows + 1;
  cellsize = Math.round(w / viewsize);
  let cw = cellsize * viewsize - cellsize * 2;
  let ch = cellsize * viewsize - cellsize * 2;

  master.style.width = "" + cw + "px";
  master.style.height = "" + ch + "px";
  master.style.margin = (window.innerHeight - ch) / 2 + "px " + (window.innerWidth - cw) / 2 + "px";

  canvas1.width = canvas2.width = canvas3.width = cw + cellsize * 2;;
  canvas1.height = canvas2.height = canvas3.height = ch + cellsize * 2;;

  canvas4.width = cellsize;
  canvas4.height = cellsize;
}

function setplayerposinview(playerpos) {
  let coord = indextocoord(playerpos);
  if (coord[0] >= globalrows - vrows) coord[0] -= globalrows - viewsize + 2;
  else if (coord[0] >= vrows) coord[0] = vrows - 1;
  if (coord[1] >= globalcols - vcols) coord[1] -= globalcols - viewsize + 2;
  else if (coord[1] >= vcols) coord[1] = vcols - 1;
  canvas4.style.top = coord[0] * cellsize + "px";
  canvas4.style.left = coord[1]* cellsize + "px";
  // TODO: fix can't access cell 0,0
};

function translatecanvas(direction, playerpos) {
  if (!direction) return;
  let coord = indextocoord(playerpos);
  let dir
  if (direction == "up" && coord[0] >= vrows - 1 && coord[0] <= globalrows - vrows - 1) dir = "Y(";
  else if (direction == "down" && coord[0] >= vrows && coord[0] <= globalrows - vrows) dir = "Y(-";
  else if (direction == "right" && coord[1] >= vcols && coord[1] <= globalcols - vcols) dir = "X(-";
  else if (direction == "left" && coord[1] >= vcols - 1 && coord[1] <= globalcols - vcols - 1) dir = "X(";
  if (!dir) return;
  canvas1.style.transitionDuration = canvas2.style.transitionDuration = canvas3.style.transitionDuration = "0.1s";
  canvas1.style.transform = canvas2.style.transform = canvas3.style.transform = "translate" + dir + cellsize + "px)";
};

function canvastoorigin(playerpos) {
  let coord = indextocoord(playerpos);
  if (coord[0] >= globalrows - vrows) coefx = 2;
  else if (coord[0] >= vrows) coefx = 1;
  else coefx = 0;
  if (coord[1] >= globalcols - vcols) coefy = 2;
  else if (coord[1] >= vcols) coefy = 1;
  else coefy = 0;
  canvas1.style.transitionDuration = canvas2.style.transitionDuration =
  canvas3.style.transitionDuration = "0s";
  canvas1.style.transform = canvas2.style.transform =
  canvas3.style.transform = "translate(0, 0)";
  canvas1.style.position = canvas2.style.position =
  canvas3.style.position = "absolute";
  canvas1.style.top = canvas2.style.top =
  canvas3.style.top = "-" + cellsize * coefx + "px";
  canvas1.style.left = canvas2.style.left =
  canvas3.style.left = "-" + cellsize * coefy + "px";
}

//////////// CANVAS DRAWING METHODS ////////////

function drawgrid(playerpos) {
  clearallcanvas();
  canvastoorigin(playerpos);
  drawallcanvas();
}

function clearallcanvas() {
  ctx.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
};

function drawallcanvas() {
  allowedlist.forEach(function(position) { // Draw all allowed cells
    drawallowedcells(position);
  });
  let len = colorlist.length;
  for (i = 0; i < len; i++) { // Draw all colored cells
    if (colorlist[i] !== null) {
      fillcell(i, colorlist[i]);
    };
  };
  positionlist.forEach(function(pos) { // Draw all positions
    drawposition(pos, "grey");
  });
}

function isinview(position, playerpos) {
  let plpos = indextocoord(playerpos);
  let cellpos = indextocoord(position);
  if (plpos[0] >= globalrows - vrows) cellpos[0] -= (globalrows - viewsize);
  else if (plpos[0] >= vrows) cellpos[0] -= (plpos[0] - vrows);
  if (plpos[1] >= globalcols - vcols) cellpos[1] -= (globalcols - viewsize);
  else if (plpos[1] >= vcols) cellpos[1] -= (plpos[1] - vcols);
  if (cellpos[0] < 0 || cellpos[0] > viewsize || cellpos[1] < 0 || cellpos[1] > viewsize) return;
  else return [cellpos[0], cellpos[1]];
};

function fillcell(position, color) {
  let cell = isinview(position, playerpos);
  if (!cell) return;
  ctx2.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
  ctx2.fillStyle = color;
  ctx2.fillRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize)
}

function drawcell(position, color) {
  let cell = isinview(position, playerpos);
  if (!cell) return;

  flag = false;
  let celldivy = 0;
  let celldivx = 0;
  let posy;

  var strokey = setInterval(function() {
    posy = cellsize * cell[0] + cellsize - celldivy - (lw / 2);

    celldivx = celldivx + lw;
    ctx2.beginPath();
    ctx2.moveTo(cellsize * cell[1], posy);
    ctx2.lineWidth = lw;
    ctx2.strokeStyle = color;
    ctx2.fillStyle = color;
    ctx2.lineTo(cellsize * cell[1] + celldivx, posy);
    ctx2.stroke();
    ctx2.closePath();

    if (celldivx >= cellsize - lw) {
      celldivy = celldivy + lw;
      ctx2.moveTo(cellsize * cell[1], posy);
      ctx2.lineWidth = lw;
      ctx2.strokeStyle = color;
      ctx2.fillStyle = color;
      ctx2.lineTo(cellsize * cell[1] + cellsize, posy);
      ctx2.stroke();
      ctx2.closePath();
      celldivx = 0;
    }

    if (celldivy >= cellsize - lw) {
      fillcell(position);
      flag = true;
      clearInterval(strokey);
    }
  }, celltimeout);
}

function clearposition(position) {
  let cell = isinview(position, playerpos);
  if (!cell) return;
  ctx3.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
};

function drawallowedcells(position) {
  let cell = isinview(position, playerpos);
  if (!cell) return;
  ctx.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
  ctx.fillStyle = "#e9e9e9";
  ctx.fillRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize)
};

function drawposition(position, color) {
  let cell = isinview(position, playerpos);
  if (!cell) return;
  ctx3.lineWidth = 2;
  ctx3.strokeStyle = color;
  ctx3.strokeRect(cellsize * cell[1] + 9, cellsize * cell[0] + 9, cellsize - 18, cellsize - 18);
  ctx3.lineWidth = 4;
  ctx3.strokeStyle = "white";
  ctx3.strokeRect(cellsize * cell[1] + 12, cellsize * cell[0] + 12, cellsize - 24, cellsize - 24);
  ctx3.lineWidth = 2;
  ctx3.strokeStyle = color;
  ctx3.strokeRect(cellsize * cell[1] + 14, cellsize * cell[0] + 14, cellsize - 28, cellsize - 28);
}; // TODO: Inner rectangles size relative to cellsize

function drawplayer(color) {
  ctx4.lineWidth = 2;
  ctx4.strokeStyle = color;
  ctx4.strokeRect(9, 9, cellsize - 18, cellsize - 18);
  ctx4.lineWidth = 4;
  ctx4.strokeStyle = "white";
  ctx4.strokeRect(12, 12, cellsize - 24, cellsize - 24);
  ctx4.lineWidth = 2;
  ctx4.strokeStyle = color;
  ctx4.strokeRect(14, 14, cellsize - 28, cellsize - 28);
}; // TODO: Inner rectangles size relative to cellsize

// -webkit-transition: all 0.5s ease;
// -moz-transition: all 0.5s ease;
// -ms-transition: all 0.5s ease;
// -o-transition: all 0.5s ease;
// transition: all 0.5s ease;
