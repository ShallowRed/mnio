var canvas1, canvas2, canvas3, ctx, ctx1, ctx2, playerpos;
var selectedcolor, pcolor1, pcolor2, pcolor3;
var lastcell, cellsize, globalrows, globalcols, viewsize, vieworigin, viewox, viewoy,
  rows, cols, vrows, vcols, lw, celltimeout;

var positionlist = [], allowedlist = [], colorlist = [];
var initflag = 0,
  flag = true;

const c1 = document.getElementById('c1'),
  c2 = document.getElementById('c2'),
  c3 = document.getElementById('c3');

//Set data needed on initialization
function setinitdata(data) {
  colorlist = data.colorlist;
  positionlist = data.positionlist;
  globalrows = data.rows;
  globalcols = data.cols;
  vrows = data.vrows;
  vcols = data.vcols;
  lw = data.lw;
  celltimeout = data.celltimeout;
  initflag = 1;
}

function initplayer(data) {
  playerpos = data.position;
  pcolor1 = data.color1;
  pcolor2 = data.color2;
  pcolor3 = data.color3;
  selectedcolor = pcolor1;
  c1.style.background = pcolor1;
  c1.style.border = "solid 5px black";
  c2.style.background = pcolor2;
  c3.style.background = pcolor3;
}

function selectc1() {
  selectedcolor = pcolor1;
  c1.style.border = "solid 5px black";
  c2.style.border = "solid 5px white";
  c3.style.border = "solid 5px white";
  drawplayerpos(playerpos, pcolor1);
}

function selectc2(pcolor2) {
  selectedcolor = pcolor2;
  c1.style.border = "solid 5px white";
  c2.style.border = "solid 5px black";
  c3.style.border = "solid 5px white";;
  drawplayerpos(playerpos, pcolor2);
}

function selectc3(pcolor3) {
  selectedcolor = pcolor3;
  c1.style.border = "solid 5px white";
  c2.style.border = "solid 5px white";
  c3.style.border = "solid 5px black";
  drawplayerpos(playerpos, pcolor3);
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
  drawgrid(playerpos);
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

//var elem = document.body;

// function openFullscreen() {
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//   } else if (elem.mozRequestFullScreen) {
//     /* Firefox */
//     elem.mozRequestFullScreen();
//   } else if (elem.webkitRequestFullscreen) {
//     /* Chrome, Safari & Opera */
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) {
//     /* IE/Edge */
//     elem.msRequestFullscreen();
//   }
// }

// function openFullscreen() {
//   const header = document.querySelector(".header");
//   // Click bascule en mode plein écran
//   document.onclick = function(event) {
//     if (document.fullscreenElement) {
//       document.exitFullscreen();
//       header.style.display ="flex";
//     } else {
//       document.documentElement.requestFullscreen();
//       header.style.display ="none";
//     }
//   };
// }

// let vinx = viewx,
//   viny = viewy;
// for (var i = 0; i < viewgridstate.length; i++) {
//   viewgridstate[i] = vinx + "_" + viny;
//   vinx++;
//   if (vinx >= viewsize) {
//     viny++;
//     vinx = viewx;
//   }
// }
// clog(viewgridstate);

// return vieworigin;
