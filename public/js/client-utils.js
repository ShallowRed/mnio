var globalrows, globalcols, cellsize, vrows, vcols, lw, celltimeout;
var playerpos, selectedcolor, pcolor1, pcolor2, pcolor3;
var PositionList, ColorList;
var allowedlist;

var initflag = 0,
  flag = false;

const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
const zoomin = document.getElementById('zoomin');
const zoomout = document.getElementById('zoomout');
const fill = document.getElementById('fill');

const volet = document.getElementById('volet');

//////////// PARAMETERS INITIALIZATION ////////////

function initdata(data) {
  ColorList = data.ColorList;
  PositionList = data.PositionList;
  allowedlist = data.allowedlist;

  globalrows = data.uiparams[0];
  globalcols = data.uiparams[1];
  vrows = data.uiparams[2];
  vcols = data.uiparams[3];
  lw = data.uiparams[4];
  celltimeout = data.uiparams[5];

  initflag = 1;

  playerpos = data.position;
  pcolor1 = data.colors[0];
  pcolor2 = data.colors[1];
  pcolor3 = data.colors[2];
  selectedcolor = pcolor1;

  c1.style.background = pcolor1;
  c1.style.border = "solid 5px black";
  c2.style.background = pcolor2;
  c3.style.background = pcolor3;
  console.log(data);
}

//////////////// CANVAS UTILS ////////////////////

function indextocoord(index) {
  let coordx = (index - (index % globalrows)) / globalcols;
  let coordy = (index % globalcols);
  return [coordx, coordy];
}

function coordtoindex(coord) {
  let index = globalrows * coord[0] + coord[1];
  return index;
}

//////////////// UI UTILS ////////////////////

function selectc1() {
  selectedcolor = pcolor1;
  c1.style.border = "solid 5px black";
  c2.style.border = "solid 5px white";
  c3.style.border = "solid 5px white";
  drawplayer(pcolor1);
}

function selectc2() {
  selectedcolor = pcolor2;
  c1.style.border = "solid 5px white";
  c2.style.border = "solid 5px black";
  c3.style.border = "solid 5px white";;
  drawplayer(pcolor2);
}

function selectc3() {
  selectedcolor = pcolor3;
  c1.style.border = "solid 5px white";
  c2.style.border = "solid 5px white";
  c3.style.border = "solid 5px black";
  drawplayer(pcolor3);
}

// Turn on game visibility when content loaded
function hidevolet() {
  volet.style.opacity = "0";
  setTimeout(function() {
    volet.style.display = "none";
  }, 500);
}

//resize grid and cell on window sizing
window.addEventListener('resize', function() {
  setcanvassize();
  setplayerposinview(playerpos, false);
  drawplayer(selectedcolor);
  drawgrid(playerpos);
}, true);

function clog(e) {
  console.log(e)
};

c1.addEventListener("click", function() {
  selectc1();
});

c2.addEventListener("click", function() {
  selectc2();
});

c3.addEventListener("click", function() {
  selectc3();
});

zoomin.addEventListener("click", function() {
  if (viewsize > 3 && flag) {
    --vrows;
    --vcols;
    setcanvassize();
    setplayerposinview(playerpos, false);
    drawplayer(selectedcolor);
    drawgrid(playerpos);
  }});

zoomout.addEventListener("click", function() {
  if (viewsize + 1 < globalrows && flag) {
      ++vrows;
      ++vcols;
      setcanvassize();
      setplayerposinview(playerpos, false);
      drawplayer(selectedcolor);
      drawgrid(playerpos);
    }
});

fill.addEventListener("click", function() {
  if (flag) fillplayercell(playerpos, selectedcolor);
});
