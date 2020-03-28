//////////// CANVAS SETUP ////////////

//Render all the grid
function drawgrid(position) {
  setcanvas();
  vieworigin = setvieworigin(position);
  // Draw all allowed cells
  allowedlist.forEach(function(position) {
    drawallowed(position);
  });
  // Draw all colored cells
  let len = colorlist.length;
  for (i = 0; i < len; i++) {
    if (colorlist[i] !== null) {
      fillcell(i, colorlist[i]);
    };
  };
  // Draw all positions
  positionlist.forEach(function(position) {
    drawplayerpos(position, "grey");
  });
  drawplayerpos(position, selectedcolor);
}

//Set grid parameters according to cell size and window size
function setcanvas() {

  canvas1 = document.getElementById('canvas1');
  canvas2 = document.getElementById('canvas2');
  canvas3 = document.getElementById('canvas3');
  ctx = canvas1.getContext('2d');
  ctx2 = canvas2.getContext('2d');
  ctx3 = canvas3.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx2.imageSmoothingEnabled = false;
  ctx3.imageSmoothingEnabled = false;

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
  let cw = cellsize * viewsize;
  let ch = cellsize * viewsize;

  canvas1.width = canvas2.width = canvas3.width = cw;
  canvas1.height = canvas2.height = canvas3.height = ch;
  canvas1.style.margin = canvas2.style.margin = canvas3.style.margin =
    (window.innerHeight - ch) / 2 + "px " + (window.innerWidth - cw) / 2 + "px";

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

//////////// CANVAS ACTIONS ////////////

function fillcell(position, color) {
  let cell = isinview(position);
  if (!cell) return;
  ctx2.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
  ctx2.fillStyle = color;
  ctx2.fillRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize)
}

function fillcell2(position, color) {

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

function clearplayerpos(position) {
  let cell = isinview(position);
  if (!cell) return;
  ctx3.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
};

// TODO: make inner rectangles size relative to cellsize
function drawplayerpos(position, color) {
  let cell = isinview(position);
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
};

function drawallowed(position) {
  let cell = isinview(position);
  if (!cell) return;
  ctx.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
  ctx.fillStyle = "#e9e9e9";
  ctx.fillRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize)
};

//////////// CANVAS UTILS ////////////

function indextocoord(index) {
  let coordx = (index - (index % globalrows)) / globalcols;
  let coordy = (index % globalcols);
  return [coordx, coordy];
}

function coordtoindex(xpos, ypos) {
  let index = globalrows * xpos + ypos;
  return index;
}

function isinview(position) {
  let cell = indextocoord(position);
  let xdiff = cell[0] - vieworigin[0];
  let ydiff = cell[1] - vieworigin[1];
  if (xdiff < 0 || xdiff > viewsize || ydiff < 0 || ydiff > viewsize) {
    return false;
  } else {
    return [xdiff, ydiff];
  };
};
