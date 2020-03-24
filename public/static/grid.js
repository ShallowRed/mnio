//Render all the grid
function drawgrid() {
  setcanvas();
  setview();
  fillallcells();
}

//Set grid parameters according to cell size and window size
function setcanvas() {
  canvas1 = document.getElementById('canvas1');
  canvas2 = document.getElementById('canvas2');
  ctx = canvas1.getContext('2d');
  ctx2 = canvas2.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx2.imageSmoothingEnabled = true;

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
  let viewsize = vcols + vrows + 1;
  cellsize = Math.round(w / viewsize);
  let cw = cellsize * viewsize;
  let ch = cellsize * viewsize;
  canvas1.width = cw;
  canvas1.height = ch;
  canvas1.style.margin = (window.innerHeight - ch) / 2 + "px " + (window.innerWidth - cw) / 2 + "px";
  canvas2.width = cw;
  canvas2.height = ch;
  canvas2.style.margin = (window.innerHeight - ch) / 2 + "px " + (window.innerWidth - cw) / 2 + "px";
}

//Set relative cells coordinate depending on player position
function setview() {
  viewgridstate = [];
  setviewgridstate();
  viewgridstate.forEach(function(localcell) {
    setposinview(localcell);
  });
}

//fill all cells from view grid state
function fillallcells() {
  //Set cells color according to visible grid state
  viewgridstate.forEach(function(cell) {
    if (cell.color !== "none") {
      fillcell(cell, cell.color);
    }
  });
}

//fill cell instant according to position and color
function fillcell(cell, color) {
  setposinview(cell);
  ctx.clearRect(cellsize * cell.vy, cellsize * cell.vx, cellsize, cellsize);
  ctx.fillStyle = color;
  ctx.fillRect(cellsize * cell.vy, cellsize * cell.vx, cellsize, cellsize)
}

//fill cell animation
function fillcell2(cell, color) {
  flag = false;
  setposinview(cell);

  let celldivy = 0;
  let celldivx = 0;
  let posy;

  var strokey = setInterval(function() {
    posy = cellsize * cell.vx + cellsize - celldivy - (lw / 2);

    celldivx = celldivx + lw;
    ctx.beginPath();
    ctx.moveTo(cellsize * cell.vy, posy);
    ctx.lineWidth = lw;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineTo(cellsize * cell.vy + celldivx, posy);
    ctx.stroke();
    ctx.closePath();

    if (celldivx >= cellsize - lw) {
      celldivy = celldivy + lw;
      ctx.moveTo(cellsize * cell.vy, posy);
      ctx.lineWidth = lw;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineTo(cellsize * cell.vy + cellsize, posy);
      ctx.stroke();
      ctx.closePath();
      celldivx = 0;
    }

    if (celldivy >= cellsize - lw) {
      fillcell(cell);
      flag = true;
      clearInterval(strokey);
    }
  }, celltimeout);
}

// Set visible cells according to player position
function setviewgridstate() {

  //center of map
  if (player.x >= vrows &&
    player.x < globalrows - vrows &&
    player.y >= vcols &&
    player.y < globalrows - vcols) {
    //clog("center");
    localgridstate.forEach(function(cell) {
      if (Math.abs(cell.x - player.x) <= vrows &&
        Math.abs(cell.y - player.y) <= vcols) {
        viewgridstate.push(cell);
      }
    });
  }

  //Top border
  if (player.x < vrows) {

    //arrete1
    if (player.y >= vcols && player.y < globalcols - vcols) {
      //clog("arrete1");
      localgridstate.forEach(function(cell) {
        if (cell.x <= vrows * 2 &&
          Math.abs(cell.y - player.y) <= vcols) {
          viewgridstate.push(cell);
        }
      });
    }

    //sommet1
    else if (player.y < vcols) {
      //clog("sommet1");
      localgridstate.forEach(function(cell) {
        if (cell.x <= vrows * 2 && cell.y <= vcols * 2) {
          viewgridstate.push(cell);
        }
      });
    }

    //sommet2
    else if (player.y >= globalrows - vcols) {
      //clog("sommet2");
      localgridstate.forEach(function(cell) {
        if (cell.x <= vrows * 2 && cell.y >= globalrows - (vcols * 2 + 1)) {
          viewgridstate.push(cell);
        }
      });
    }

  }

  //Bottom border
  else if (player.x >= globalrows - vrows) {

    //arrete2
    if (player.y >= vcols && player.y < globalcols - vcols) {
      //clog("arrete2");
      localgridstate.forEach(function(cell) {
        if (cell.x >= globalrows - (vrows * 2 + 1) &&
          Math.abs(cell.y - player.y) <= vcols) {
          viewgridstate.push(cell);
        }
      });
    }

    //sommet3
    else if (player.y < vcols) {
      //clog("sommet3");
      localgridstate.forEach(function(cell) {
        if (cell.x >= globalcols - (vcols * 2 + 1) && cell.y < vcols * 2 + 1) {
          viewgridstate.push(cell);
        }
      });
    }

    //sommet4
    else if (player.y >= globalrows - vcols) {
      //clog("sommet4");
      localgridstate.forEach(function(cell) {
        if (cell.x >= globalcols - (vcols * 2 + 1) && cell.y >= globalrows - (vcols * 2 + 1)) {
          viewgridstate.push(cell);
        }
      });
    }

  }

  //arrete3
  else if (player.y <= vcols) {
    if (vrows <= player.x && player.x < globalrows - vrows) {
      //clog("arrete3");
      localgridstate.forEach(function(cell) {
        if (cell.y <= vcols * 2 &&
          Math.abs(cell.x - player.x) <= vcols) {
          viewgridstate.push(cell);
        }
      });
    }
  }

  //arrete4
  else if (player.y >= globalrows - vcols) {
    if (vrows <= player.x && player.x < globalrows - vrows) {
      //clog("arrete4");
      localgridstate.forEach(function(cell) {
        if (cell.y >= globalrows - (vcols * 2 + 1) &&
          Math.abs(cell.x - player.x) <= vcols) {
          viewgridstate.push(cell);
        }
      });
    }
  }
}

//Find matching cell on global grid and edit changes
function editlocalgrid(cellid, cellcolor) {
  let localcell = localgridstate.find(function(cell) {
    return cell.id == cellid;
  });
  localcell.color = cellcolor;
}

//Set player position
function setplayerpos(data) {
  player.playerpos = data.id;
  player.x = data.x;
  player.y = data.y;
}

function setposfromid(pos) {
  let gpos = {
    id : pos,
    x: parseInt(pos.split('_')[0]),
    y: parseInt(pos.split('_')[1])
  };
  return gpos;
}

// Set relative position of a cell to player position
function setposinview(cell) {
  cell.vx = cell.x - viewgridstate[0].x;
  cell.vy = cell.y - viewgridstate[0].y;
  cell.vid = cell.vx + "_" + cell.vy;
}

function clearcell(cell) {
  ctx2.clearRect(cellsize * cell.vy, cellsize * cell.vx, cellsize, cellsize);
}

function removefromlist(element, list) {
  let index = list.indexOf(element);
  if (index > -1) {
    list.splice(index, 1);
  };
}

function drawplayerpos(cell, color) {
  ctx2.lineWidth = 2;
  ctx2.strokeStyle = color;
  ctx2.strokeRect(cellsize * cell.vy + 9, cellsize * cell.vx + 9, cellsize - 18, cellsize - 18);
  ctx2.lineWidth = 4;
  ctx2.strokeStyle = "white";
  ctx2.strokeRect(cellsize * cell.vy + 12, cellsize * cell.vx + 12, cellsize - 24, cellsize - 24);
  ctx2.lineWidth = 2;
  ctx2.strokeStyle = color;
  ctx2.strokeRect(cellsize * cell.vy + 14, cellsize * cell.vx + 14, cellsize - 28, cellsize - 28);
}

function drawallpositions(localpositionlist) {
  localpositionlist.forEach(function(pos) {
    pos = setposfromid(pos);
    setposinview(pos);
    viewgridstate.forEach(function(cell) {
      if (cell.vid == pos.vid) {
        drawplayerpos(pos, "grey");
      }
    });
  });
}
