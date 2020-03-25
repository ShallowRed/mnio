//Render all the grid
function drawgrid(position) {
  setcanvas();
  viewgridstate = setviewgridstate(position);
  viewgridstate.forEach(function(localcell) {
    setposinview(localcell);
  });
  fillallcells();
  allowedlist.forEach(function(cell) {
    drawallowed(cell);
  });
  drawallpositions(localpositionlist);
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
  canvas1.width =
    canvas2.width =
    canvas3.width = cw;
  canvas1.height =
    canvas2.height =
    canvas3.height = ch;
  canvas1.style.margin =
    canvas2.style.margin =
    canvas3.style.margin =
    (window.innerHeight - ch) / 2 + "px " + (window.innerWidth - cw) / 2 + "px";
}

//fill cell instant according to position and color
function fillcell(position, color) {
  let cell = setposfromid(position);
  ctx2.clearRect(cellsize * cell.vy, cellsize * cell.vx, cellsize, cellsize);
  ctx2.fillStyle = color;
  ctx2.fillRect(cellsize * cell.vy, cellsize * cell.vx, cellsize, cellsize)
}

//fill all cells from view grid state
function fillallcells() {
  //Set cells color according to visible grid state
  viewgridstate.forEach(function(cell) {
    if (cell.color !== "none") {
      fillcell(cell.id, cell.color);
    }
  });
}

//fill cell animation
function fillcell2(position, color) {

  let cell = setposfromid(position);

  flag = false;
  let celldivy = 0;
  let celldivx = 0;
  let posy;

  var strokey = setInterval(function() {
    posy = cellsize * cell.vx + cellsize - celldivy - (lw / 2);

    celldivx = celldivx + lw;
    ctx2.beginPath();
    ctx2.moveTo(cellsize * cell.vy, posy);
    ctx2.lineWidth = lw;
    ctx2.strokeStyle = color;
    ctx2.fillStyle = color;
    ctx2.lineTo(cellsize * cell.vy + celldivx, posy);
    ctx2.stroke();
    ctx2.closePath();

    if (celldivx >= cellsize - lw) {
      celldivy = celldivy + lw;
      ctx2.moveTo(cellsize * cell.vy, posy);
      ctx2.lineWidth = lw;
      ctx2.strokeStyle = color;
      ctx2.fillStyle = color;
      ctx2.lineTo(cellsize * cell.vy + cellsize, posy);
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

// Set visible cells according to player position
function setviewgridstate(position) {
  // todo generate viewgritstate with new array
  // stop push cells and use viewgridstate[i]= {
  //   localgridcell.i-viewgrid.x,
  //   localgridcell.j-viewgrid.y,
  //   color,
  //   vx,
  //   vy
  // }
  let playerx = parseInt(position.split('_')[0]);
  let playery = parseInt(position.split('_')[1]);
  let viewgridstate = [];

  //center of map
  if (playerx >= vrows &&
    playerx < globalrows - vrows &&
    playery >= vcols &&
    playery < globalrows - vcols) {
    // clog("center");
    localgridstate.forEach(function(cell) {
      if (Math.abs(cell.x - playerx) <= vrows &&
        Math.abs(cell.y - playery) <= vcols) {
        viewgridstate.push(cell);
      }
    });
  }

  //Top border
  if (playerx < vrows) {

    //arrete1
    if (playery >= vcols && playery < globalcols - vcols) {
      // clog("arrete1");
      localgridstate.forEach(function(cell) {
        if (cell.x < viewsize && Math.abs(cell.y - playery) <= vcols) {
          viewgridstate.push(cell);
        }
      });
    }

    //sommet1
    else if (playery < vcols) {
      // clog("sommet1");
      localgridstate.forEach(function(cell) {
        if (cell.x < viewsize && cell.y < viewsize) {
          viewgridstate.push(cell);
        }
      });
    }

    //sommet2
    else if (playery >= globalrows - vcols) {
      // clog("sommet2");
      localgridstate.forEach(function(cell) {
        if (cell.x < viewsize && cell.y >= globalrows - viewsize) {
          viewgridstate.push(cell);
        }
      });
    }

  }

  //Bottom border
  else if (playerx >= globalrows - vrows) {

    //arrete2
    if (playery >= vcols && playery < globalcols - vcols) {
      // clog("arrete2");
      localgridstate.forEach(function(cell) {
        if (cell.x >= globalrows - viewsize &&
          Math.abs(cell.y - playery) <= vcols) {
          viewgridstate.push(cell);
        }
      });
    }

    //sommet3
    else if (playery < vcols) {
      // clog("sommet3");
      localgridstate.forEach(function(cell) {
        if (cell.x >= globalcols - viewsize && cell.y < viewsize) {
          viewgridstate.push(cell);
        }
      });
    }

    //sommet4
    else if (playery >= globalrows - vcols) {
      // clog("sommet4");
      localgridstate.forEach(function(cell) {
        if (cell.x >= globalcols - viewsize && cell.y >= globalrows - viewsize) {
          viewgridstate.push(cell);
        }
      });
    }

  }

  //arrete3
  else if (playery <= vcols) {
    if (playerx >= vrows && playerx < globalrows - vrows) {
      // clog("arrete3");
      localgridstate.forEach(function(cell) {
        if (cell.y < viewsize && Math.abs(cell.x - playerx) <= vcols) {
          viewgridstate.push(cell);
        }
      });
    }
  }

  //arrete4
  else if (playery >= globalrows - vcols) {
    if (playerx >= vrows && playerx < globalrows - vrows) {
      // clog("arrete4");
      localgridstate.forEach(function(cell) {
        if (cell.y >= globalrows - viewsize && Math.abs(cell.x - playerx) <= vcols) {
          viewgridstate.push(cell);
        }
      });
    }
  }
  return viewgridstate;
}

//Find matching cell on global grid and edit changes
function editlocalgrid(cellid, cellcolor) {
  let localcell = localgridstate.find(function(cell) {
    return cell.id == cellid;
  });
  localcell.color = cellcolor;
}

function setposfromid(position) {
  let xpos = parseInt(position.split('_')[0]);
  let ypos = parseInt(position.split('_')[1]);
  let idandpos = {
    id: position,
    x: xpos,
    y: ypos,
    vx: xpos - viewgridstate[0].x,
    vy: ypos - viewgridstate[0].y,
  };
  return idandpos;
}

// Set relative position of a cell to player position
function setposinview(cell) {
  cell.vx = cell.x - viewgridstate[0].x;
  cell.vy = cell.y - viewgridstate[0].y;
  cell.vid = cell.vx + "_" + cell.vy;
}

function clearcell(position) {
  let cell = setposfromid(position)
  ctx3.clearRect(cellsize * cell.vy, cellsize * cell.vx, cellsize, cellsize);
}

function removefromlist(element, list) {
  let index = list.indexOf(element);
  if (index > -1) {
    list.splice(index, 1);
  };
}

function drawplayerpos(position, color) {
  let cell = setposfromid(position);
  ctx3.lineWidth = 2;
  ctx3.strokeStyle = color;
  ctx3.strokeRect(cellsize * cell.vy + 9, cellsize * cell.vx + 9, cellsize - 18, cellsize - 18);
  ctx3.lineWidth = 4;
  ctx3.strokeStyle = "white";
  ctx3.strokeRect(cellsize * cell.vy + 12, cellsize * cell.vx + 12, cellsize - 24, cellsize - 24);
  ctx3.lineWidth = 2;
  ctx3.strokeStyle = color;
  ctx3.strokeRect(cellsize * cell.vy + 14, cellsize * cell.vx + 14, cellsize - 28, cellsize - 28);
}

function drawallpositions(localpositionlist) {
  localpositionlist.forEach(function(position) {
    if (isinview(position)) {
      drawplayerpos(position, "grey");
    };
  });
}

function isinview(position) {
  let xdiff = parseInt(position.split('_')[0]) - viewgridstate[0].x;
  let ydiff = parseInt(position.split('_')[1]) - viewgridstate[0].y;
  if (xdiff < 0 || xdiff > viewsize || ydiff < 0 || ydiff > viewsize) {
    return false;
  } else {
    return true;
  }
};

function drawallowed(position) {
  if (isinview(position)) {
    let cell = setposfromid(position);
    ctx.clearRect(cellsize * cell.vy, cellsize * cell.vx, cellsize, cellsize);
    ctx.fillStyle = "#e9e9e9";
    ctx.fillRect(cellsize * cell.vy, cellsize * cell.vx, cellsize, cellsize)
  };
};
