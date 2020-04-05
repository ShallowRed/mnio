var initflag = 0;
var flag = false;

const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
const c3 = document.getElementById('c3');
const zoomin = document.getElementById('zoomin');
const zoomout = document.getElementById('zoomout');

const topmask = document.getElementById('topmask');
const bottommask = document.getElementById('bottommask');
const leftmask = document.getElementById('leftmask');
const rightmask = document.getElementById('rightmask');

const volet = document.getElementById('volet');

//////////////// UI UTILS ////////////////////

// Turn on game visibility when content loaded
function HideLobby() {
  volet.style.opacity = "0";
  setTimeout(function() {
    volet.style.display = "none";
  }, 500);
}

// // TODO: fix broken color selection
function selectc1() {
  PLAYER.selectedcolor = PLAYER.color1;
  c1.style.border = "solid 2px black";
  c2.style.border = "solid 2px white";
  c3.style.border = "solid 2px white";
  PLAYER.draw();
}

function selectc2() {
  PLAYER.selectedcolor = PLAYER.color2;
  c1.style.border = "solid 2px white";
  c2.style.border = "solid 2px black";
  c3.style.border = "solid 2px white";;
  PLAYER.draw();
}

function selectc3() {
  PLAYER.selectedcolor = PLAYER.color3;
  c1.style.border = "solid 2px white";
  c2.style.border = "solid 2px white";
  c3.style.border = "solid 2px black";
  PLAYER.draw();
}

function selectup() {
  if (PLAYER.selectedcolor == PLAYER.color1) selectc3();
  else if (PLAYER.selectedcolor == PLAYER.color2) selectc1();
  else selectc2();
}

function selectdown() {
  if (PLAYER.selectedcolor == PLAYER.color1) selectc2();
  else if (PLAYER.selectedcolor == PLAYER.color2) selectc3();
  else selectc1();
}

c1.addEventListener("click", function() {
  selectc1();
  DrawCell(PLAYER.position, PLAYER.selectedcolor);
});

c2.addEventListener("click", function() {
  selectc2();
  DrawCell(PLAYER.position, PLAYER.selectedcolor);
});

c3.addEventListener("click", function() {
  selectc3();
  DrawCell(PLAYER.position, PLAYER.selectedcolor);
});

// TODO: scroll with mouse  // TODO: log scale for scrolling
zoomin.addEventListener("click", function() {
  if (flag) MAP.zoomin();
});

zoomout.addEventListener("click", function() {
  if (flag) MAP.zoomout();
});

//resize grid and cell on window sizing
window.addEventListener('resize', function() {
  GAME.draw();
}, true);

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
