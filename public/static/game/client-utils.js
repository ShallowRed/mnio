var globalrows, globalcols, cellsize, vrows, vcols, lw, celltimeout;
var playerpos, selectedcolor, pcolor1, pcolor2, pcolor3;
var positionlist, colorlist;
var allowedlist = [];
var initflag = 0, flag = true;
const c1 = document.getElementById('c1'),
  c2 = document.getElementById('c2'),
  c3 = document.getElementById('c3');

const volet = document.getElementById('volet');

  //////////// PARAMETERS INITIALIZATION ////////////

function initdata(data) {
  colorlist = data.colorlist;
  positionlist = data.positionlist;
  globalrows = data.rows;
  globalcols = data.cols;
  vrows = data.vrows;
  vcols = data.vcols;
  lw = data.lw;
  celltimeout = data.celltimeout;
  initflag = 1;
  playerpos = data.position;
  pcolor1 = data.color1;
  pcolor2 = data.color2;
  pcolor3 = data.color3;
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

function selectc2(pcolor2) {
  selectedcolor = pcolor2;
  c1.style.border = "solid 5px white";
  c2.style.border = "solid 5px black";
  c3.style.border = "solid 5px white";;
  drawplayer(pcolor2);
}

function selectc3(pcolor3) {
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
  setplayerposinview(playerpos);
  drawgrid(playerpos);
  drawplayer(selectedcolor);
}, true);

function clog(e) {
  console.log(e)
};

// todo : c1.addEventListener("click", function() {
//   selectc1();
// });
