const UI = {

  init: function(GAME, PLAYER, MAP, socket) {

    this.volet = document.getElementById('volet');
    this.zin = document.getElementById('zoomin');
    this.zout = document.getElementById('zoomout');
    this.elem = document.documentElement;
    this.full = {
      button: document.getElementById('full'),
      flag: false
    };

    this.cs = [
      document.getElementById('c1'),
      document.getElementById('c2'),
      document.getElementById('c3')
    ];

    this.cs.forEach(function(c) {
      c.style.background = PLAYER.colors[UI.cs.indexOf(c)];
      c.addEventListener("click", function() {
        UI.select(c, PLAYER);
        require('./actions').drawcell(PLAYER.position, PLAYER.selectedcolor, GAME, PLAYER, MAP, socket);
      });
    });

    this.zin.addEventListener("click", function() {
      if (GAME.flag) UI.zoomin(GAME, MAP, PLAYER);
    });

    this.zout.addEventListener("click", function() {
      if (GAME.flag) UI.zoomout(GAME, MAP, PLAYER);
    });

    window.addEventListener('resize', function() {
      GAME.render(MAP, PLAYER);
    });

    window.addEventListener("orientationchange", function() {
      GAME.render(MAP, PLAYER);
    });

    this.full.button.addEventListener("click", function() {
      UI.fullscreen();
    })

    this.select(c1, PLAYER);
    // this.fullscreen();
    this.hidelobby();

  },

  select: function(c, PLAYER) {
    c.style.transform = "scale(1)";
    c.style.borderWidth = "2px";
    PLAYER.selectedcolor = PLAYER.colors[this.cs.indexOf(c)];
    PLAYER.canvas.style.background = PLAYER.selectedcolor;

    this.cs.filter(function(cn) {
      return cn !== c;
    }).forEach(function(cl) {
      cl.style.borderWidth = "1px";
      cl.style.transform = "scale(0.8)";
    });
  },

  fullscreen: function() {

    if (!this.full.flag) {
      this.full.flag = true;
      if (this.elem.requestFullscreen) this.elem.requestFullscreen();
      else if (this.elem.mozRequestFullScreen) this.elem.mozRequestFullScreen();
      else if (this.elem.webkitRequestFullscreen) this.elem.webkitRequestFullscreen();
      else if (this.elem.msRequestFullscreen) this.elem.msRequestFullscreen();

    } else {
      this.full.flag = false;
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }

  },

  hidelobby: function() {
    volet.style.opacity = "0";
    setTimeout(function() {
      volet.style.display = "none";
    }, 500);
  },

  zoomin: function(GAME, MAP, PLAYER) {
    MAP.rows -= 2;
    MAP.cols -= 2;
    GAME.render(MAP, PLAYER);
  },

  zoomout: function(GAME, MAP, PLAYER) {
    MAP.rows += 2;
    MAP.cols += 2;
    GAME.render(MAP, PLAYER);
  }

};

module.exports = UI

// TODO: polyfill css -webkit- etc...
// TODO: button flip button left/right side
// TODO: settings button
// TODO: exit button
// TODO: set limit to player expansion progressively
// TODO: fix xy inversion
// TODO: fix can't access cell 0,0
// TODO: startcell according to device
// TODO: button position according to w h ratio
// TODO: margin for ui right, left or bottom
// TODO: fix margins
// TODO: erase color ?
// TODO: darken /lighten selected color
// TODO: use prepared palettes
// TODO: add tutorial
// TODO: eventually animate other's move
