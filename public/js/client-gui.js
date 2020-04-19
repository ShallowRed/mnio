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

// TODO: polyfill css -webkit- etc...

function selectc1() {
  PLAYER.selectedcolor = PLAYER.color1;
  c1.style.transform = "scale(1)";
  c2.style.transform = "scale(0.8)";
  c3.style.transform = "scale(0.8)";
  c1.style.borderWidth = "2px";
  c2.style.borderWidth = "1px";
  c3.style.borderWidth = "1px";
  PLAYER.canvas.style.background = PLAYER.selectedcolor;
}

function selectc2() {
  PLAYER.selectedcolor = PLAYER.color2;
  c1.style.transform = "scale(0.8)";
  c2.style.transform = "scale(1)";
  c3.style.transform = "scale(0.8)";
  c1.style.borderWidth = "1px";
  c2.style.borderWidth = "2px";
  c3.style.borderWidth = "1px";
  PLAYER.canvas.style.background = PLAYER.selectedcolor;
}

function selectc3() {
  PLAYER.selectedcolor = PLAYER.color3;
  c1.style.transform = "scale(0.8)";
  c2.style.transform = "scale(0.8)";
  c3.style.transform = "scale(1)";
  c1.style.borderWidth = "1px";
  c2.style.borderWidth = "1px";
  c3.style.borderWidth = "2px";
  PLAYER.canvas.style.background = PLAYER.selectedcolor;
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
});

window.addEventListener("orientationchange", function() {
  GAME.render();
});

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;
var full = {
  button: document.getElementById('full'),
  flag: false
}

full.button.addEventListener("click", function() {
  fullscreen();
})

function fullscreen() {
  if (!full.flag) {
    openFullscreen();
    full.flag = true;
  } else {
    closeFullscreen();
    full.flag = false;
  }
};

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}


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
