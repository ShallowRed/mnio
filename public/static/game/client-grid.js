//Render all the grid
function drawgrid(position) {
  setcanvas();
  setvieworigin(position);

  // Draw all allowed cells
  allowedlist.forEach(function(position) {
    if (isinview(position)) {
      drawallowed(position);
    };
  });

  // Draw all colored cells
  let len = localcolorlist.length;
  for (i = 0; i < len; i++) {
    if (localcolorlist[i] !== null) {
      let position = (i - (i % globalrows)) / globalcols + "_" + (i % globalrows);
      if (isinview(position)) {
        fillcell(position, localcolorlist[i]);
      };
    };
  };

  // Draw all positions
  localpositionlist.forEach(function(position) {
    if (isinview(position)) {
      drawplayerpos(position, "grey");
    };
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

  //Set grid and cell size according to window size
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w > h) {
    h = Math.round(h * 0.8);
    w = h
  } else {
    w = Math.round(w * 0.9);
    h = w
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

// Set visible cells according to player position
function setvieworigin(position) {

  let playerx = parseInt(position.split('_')[0]);
  let playery = parseInt(position.split('_')[1]);
  let viewgridstate2 = new Array(viewsize * viewsize);
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

  viewox = viewx;
  viewoy = viewy;
  vieworigin = viewx + "_" + viewy;
}



function fillcell(position, color) {
  let cell = setposfromid(position);
  ctx2.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
  ctx2.fillStyle = color;
  ctx2.fillRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize)
}

function fillcell2(position, color) {

  let cell = setposfromid(position);

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
  let cell = setposfromid(position)
  ctx3.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
}

function drawplayerpos(position, color) {
  let cell = setposfromid(position);
  ctx3.lineWidth = 2;
  ctx3.strokeStyle = color;
  ctx3.strokeRect(cellsize * cell[1] + 9, cellsize * cell[0] + 9, cellsize - 18, cellsize - 18);
  ctx3.lineWidth = 4;
  ctx3.strokeStyle = "white";
  ctx3.strokeRect(cellsize * cell[1] + 12, cellsize * cell[0] + 12, cellsize - 24, cellsize - 24);
  ctx3.lineWidth = 2;
  ctx3.strokeStyle = color;
  ctx3.strokeRect(cellsize * cell[1] + 14, cellsize * cell[0] + 14, cellsize - 28, cellsize - 28);
}

function drawallowed(position) {
  let cell = setposfromid(position);
  ctx.clearRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize);
  ctx.fillStyle = "#e9e9e9";
  ctx.fillRect(cellsize * cell[1], cellsize * cell[0], cellsize, cellsize)
};



function setposfromid(position) {
  let xpos = parseInt(position.split('_')[0]) - viewox;
  let ypos = parseInt(position.split('_')[1]) - viewoy;
  return [xpos, ypos];
}

function isinview(position) {
  let xdiff = parseInt(position.split('_')[0]) - viewox;
  let ydiff = parseInt(position.split('_')[1]) - viewoy;
  if (xdiff < 0 || xdiff > viewsize || ydiff < 0 || ydiff > viewsize) {
    return false;
  } else {
    return true;
  }
};



//Store colorgrid changes
function editlocalgrid(position, color) {
  let xpos = parseInt(position.split('_')[0]);
  let ypos = parseInt(position.split('_')[1]);
  localcolorlist[globalrows * xpos + ypos] = color;
}

function removefromlist(element, list) {
  let index = list.indexOf(element);
  if (index > -1) {
    list.splice(index, 1);
  };
}
