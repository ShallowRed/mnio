var PLAYERPOS;
var selectedcolor, pcolor1, pcolor2, pcolor3;

var initflag = 0;
var flag = false;

const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
const zoomin = document.getElementById('zoomin');
const zoomout = document.getElementById('zoomout');
const fill = document.getElementById('fill');

const topmask = document.getElementById('topmask');
const bottommask = document.getElementById('bottommask');
const leftmask = document.getElementById('leftmask');
const rightmask = document.getElementById('rightmask');

const volet = document.getElementById('volet');

//////////// PARAMETERS INITIALIZATION ////////////

function InitGame(data) {
  InitData(data);
  initflag = 1;

  PLAYERPOS = data.position;
  pcolor1 = data.colors[0];
  pcolor2 = data.colors[1];
  pcolor3 = data.colors[2];
  selectedcolor = pcolor1;

  c1.style.background = pcolor1;
  c1.style.border = "solid 2px black";
  c2.style.background = pcolor2;
  c3.style.background = pcolor3;
  console.log(data);
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
  SetCanvasSize();
  SetPlayerInView(PLAYERPOS, false);
  DrawPlayer();
  DrawCanvas(PLAYERPOS);
}, true);

//////////////// UI UTILS ////////////////////

function selectc1() {
  selectedcolor = pcolor1;
  c1.style.border = "solid 2px black";
  c2.style.border = "solid 2px white";
  c3.style.border = "solid 2px white";
  DrawPlayer();
}

function selectc2() {
  selectedcolor = pcolor2;
  c1.style.border = "solid 2px white";
  c2.style.border = "solid 2px black";
  c3.style.border = "solid 2px white";;
  DrawPlayer();
}

function selectc3() {
  selectedcolor = pcolor3;
  c1.style.border = "solid 2px white";
  c2.style.border = "solid 2px white";
  c3.style.border = "solid 2px black";
  DrawPlayer();
}


c1.addEventListener("click", function() {
  selectc1();
 fillplayercell(PLAYERPOS, selectedcolor);
});

c2.addEventListener("click", function() {
  selectc2();
  fillplayercell(PLAYERPOS, selectedcolor);
});

c3.addEventListener("click", function() {
  selectc3();
  fillplayercell(PLAYERPOS, selectedcolor);
});


// TODO: scroll with mouse
// TODO: log scale for scrolling
zoomin.addEventListener("click", function() {
  if (flag) zoominview();
});

zoomout.addEventListener("click", function() {
  if (flag) zoomoutview();
});

fill.addEventListener("click", function() {
  if (flag) fillplayercell(PLAYERPOS, selectedcolor);
});

// TODO: button flip button left/right side

// TODO: settings button

// TODO: exit button

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
    window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
  window.requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() {
      callback(currTime + timeToCall);
    },
    timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  if (!window.cancelAnimationFrame)
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}());

window.FILL = window.FILL || {};
window.DRAW = window.DRAW || {};
