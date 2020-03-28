var viewsize, vieworigin;

//////////// CANVAS SETUP ////////////
master = document.getElementById('master');
canvas1 = document.getElementById('canvas1');
canvas2 = document.getElementById('canvas2');
canvas3 = document.getElementById('canvas3');
canvas4 = document.getElementById('canvas4');
ctx = canvas1.getContext('2d');
ctx2 = canvas2.getContext('2d');
ctx3 = canvas3.getContext('2d');
ctx4 = canvas4.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx2.imageSmoothingEnabled = false;
ctx3.imageSmoothingEnabled = false;
ctx4.imageSmoothingEnabled = false;

function setcanvassize() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w > h) {
    h = Math.round(h * 0.8);
    w = h;
  } else {
    w = Math.round(w * 0.9);
    h = w;
  }
  viewsize = vcols + vrows + 1;
  cellsize = Math.round(w / viewsize);
  let cw = cellsize * viewsize - cellsize * 2;
  let ch = cellsize * viewsize - cellsize * 2;

  master.style.width = "" + cw + "px";
  master.style.height = "" + ch + "px";
  master.style.margin = (window.innerHeight - ch) / 2 + "px " + (window.innerWidth - cw) / 2 + "px";

  canvas4.width = cw + cellsize * 2;
  canvas4.height = ch + cellsize * 2;
  canvas1.width = canvas2.width = canvas3.width = cw + cellsize * 2;;
  canvas1.height = canvas2.height = canvas3.height = ch + cellsize * 2;;
}

function setvieworigin(position) {
  clog("player position is : " + position);
  let cell = indextocoord(position);
  let playerx = cell[0];
  let playery = cell[1];
  clog("player x is : " + playerx);
  clog("player y is : " + playery);
  let viewx, viewy;

  if (playerx < vrows) { //top
    viewx = 0;
  } else if (playerx >= globalrows - vrows) { //bottom
    viewx = globalrows - viewsize;
  } else { //center
    viewx = playerx - vrows;
  }

  if (playery >= globalcols - vcols) { //right
    viewy = globalcols - viewsize;
  } else if (playery < vcols) { // left
    viewy = 0;
  } else { //center
    viewy = playery - vcols;
  }
  let vieworigin = [viewx, viewy];
  clog("view origin is : " + vieworigin);
  return vieworigin;
}

//////////// CANVAS DRAWING METHODS ////////////

function fillcell(position, color) {
  let cell = isinview(position);
  if (!cell) return;
  ctx2.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
  ctx2.fillStyle = color;
  ctx2.fillRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize)
}

function fillcell2(position, color) {
  clog("yes");
  let cell = isinview(position);
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
  let cell = isinview(position);
  if (!cell) return;
  ctx3.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
};

function drawallowed(position) {
  let cell = isinview(position);
  if (!cell) return;
  ctx.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
  ctx.fillStyle = "#e9e9e9";
  ctx.fillRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize)
};

function drawposition(position, color, ctx) {
  let cell = isinview(position);
  if (!cell) return;
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.strokeRect(cellsize * cell[1] + 9, cellsize * cell[0] + 9, cellsize - 18, cellsize - 18);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "white";
  ctx.strokeRect(cellsize * cell[1] + 12, cellsize * cell[0] + 12, cellsize - 24, cellsize - 24);
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.strokeRect(cellsize * cell[1] + 14, cellsize * cell[0] + 14, cellsize - 28, cellsize - 28);
}; // TODO: Inner rectangles size relative to cellsize

function drawall(position) {
  allowedlist.forEach(function(position) { // Draw all allowed cells
    drawallowed(position);
  });
  let len = colorlist.length;
  for (i = 0; i < len; i++) { // Draw all colored cells
    if (colorlist[i] !== null) {
      fillcell(i, colorlist[i]);
    };
  };
  positionlist.forEach(function(pos) { // Draw all positions
    drawposition(pos, "grey", ctx3);
  });
}

function clearcanvas() {
  ctx.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
};

function canvastoorigin() {
  canvas1.style.transitionDuration = "0s";
  canvas2.style.transitionDuration = "0s";
  canvas3.style.transitionDuration = "0s";

  canvas1.style.position = canvas2.style.position = canvas3.style.position = "absolute";
  canvas1.style.top = canvas2.style.top = canvas3.style.top = "-" + cellsize + "px";
  canvas1.style.left = canvas2.style.left = canvas3.style.left = "-" + cellsize + "px";

  canvas1.style.transform = "translate(0, 0)";
  canvas2.style.transform = "translate(0, 0)";
  canvas3.style.transform = "translate(0, 0)";
}

function drawgrid(position) {
  vieworigin = setvieworigin(position);
  clearcanvas();
  drawall(position);
  canvastoorigin();
}
function transcanvas(direction) {
  if (!direction) return;
  else if (direction == "up") dir = "Y(";
  else if (direction == "down") dir = "Y(-";
  else if (direction == "right") dir = "X(-";
  else if (direction == "left") dir = "X(";

  canvas1.style.transitionDuration = "0.5s";
  canvas2.style.transitionDuration = "0.5s";
  canvas3.style.transitionDuration = "0.5s";

  canvas1.style.transform = "translate" + dir + cellsize + "px)";
  canvas2.style.transform = "translate" + dir + cellsize + "px)";
  canvas3.style.transform = "translate" + dir + cellsize + "px)";

}

// -webkit-transition: all 0.5s ease;
// -moz-transition: all 0.5s ease;
// -ms-transition: all 0.5s ease;
// -o-transition: all 0.5s ease;
// transition: all 0.5s ease;
