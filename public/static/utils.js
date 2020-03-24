var canvas1, canvas2, ctx, cellsize, globalrows, globalcols, player,
selectedcolor, pcolor1, pcolor2, pcolor3, lastcell,
rows, cols, vrows, vcols, lw, celltimeout;

var localgridstate = [], localpositionlist = [], viewgridstate = [],
  initflag = 0,
  flag = true;

const c1 = document.getElementById('c1'),
  c2 = document.getElementById('c2'),
  c3 = document.getElementById('c3');

//Set data needed on initialization
function setinitdata(data) {
  player = data.playerid;
  pcolor1 = data.color1;
  pcolor2 = data.color2;
  pcolor3 = data.color3;
  localgridstate = data.gridstate;
  localpositionlist = data.positionlist;
  globalrows = data.rows;
  globalcols = data.cols;
  vrows = data.vrows;
  vcols = data.vcols;
  lw = data.lw;
  celltimeout = data.celltimeout;

  selectedcolor = pcolor1;
  c1.style.background = pcolor1;
  c1.style.border = "solid 5px black";
  c2.style.background = pcolor2;
  c3.style.background = pcolor3;

  initflag = 1;
  clog(player);
}

function selectc1() {
  selectedcolor = pcolor1;
  c1.style.border = "solid 5px black";
  c2.style.border = "solid 5px white";
  c3.style.border = "solid 5px white";
  drawplayerpos(player, pcolor1);
}

function selectc2(pcolor2) {
  selectedcolor = pcolor2;
  c1.style.border = "solid 5px white";
  c2.style.border = "solid 5px black";
  c3.style.border = "solid 5px white";;
  drawplayerpos(player, pcolor2);
}

function selectc3(pcolor3) {
  selectedcolor = pcolor3;
  c1.style.border = "solid 5px white";
  c2.style.border = "solid 5px white";
  c3.style.border = "solid 5px black";
  drawplayerpos(player, pcolor3);
}

// Turn on game visibility when content loaded
function hidevolet() {
  volet.style.opacity = "0";
  setTimeout(function() {
    volet.hidden = true;
  }, 500);
}

//resize grid and cell on window sizing
window.addEventListener('resize', function() {
  drawgrid();
}, true);

function clog(e) {
  console.log(e)
};

// c1.addEventListener("click", function() {
//   selectc1();
// });
//
// c2.addEventListener("click", function() {
//   selectc2();
// });
//
// c3.addEventListener("click", function() {
//   selectc3();
// });
