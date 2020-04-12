const volet = document.getElementById('volet');
const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
const c3 = document.getElementById('c3');
const zoomin = document.getElementById('zoomin');
const zoomout = document.getElementById('zoomout');

//////////////// UI UTILS ////////////////////

function HideLobby() {
  volet.style.opacity = "0";
  setTimeout(function() {
    volet.style.display = "none";
  }, 500);
}

function selectc1() {
  PLAYER.selectedcolor = PLAYER.color1;
  c1.style.border = "solid 2px black";
  c2.style.border = "solid 2px white";
  c3.style.border = "solid 2px white";
  PLAYER.render();
}

function selectc2() {
  PLAYER.selectedcolor = PLAYER.color2;
  c1.style.border = "solid 2px white";
  c2.style.border = "solid 2px black";
  c3.style.border = "solid 2px white";;
  PLAYER.render();
}

function selectc3() {
  PLAYER.selectedcolor = PLAYER.color3;
  c1.style.border = "solid 2px white";
  c2.style.border = "solid 2px white";
  c3.style.border = "solid 2px black";
  PLAYER.render();
}

c1.addEventListener("click", function() {
  selectc1();
  drawcell(PLAYER.position, PLAYER.selectedcolor);
});

c2.addEventListener("click", function() {
  selectc2();
  drawcell(PLAYER.position, PLAYER.selectedcolor);
});

c3.addEventListener("click", function() {
  selectc3();
  drawcell(PLAYER.position, PLAYER.selectedcolor);
});

zoomin.addEventListener("click", function() {
  if (GAME.flag) GAME.zoomin();
});

zoomout.addEventListener("click", function() {
  if (GAME.flag) GAME.zoomout();
});

window.addEventListener('resize', function() {
  GAME.render();
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

window.Fill = window.Fill || {};
window.Translate = window.Translate || {};
