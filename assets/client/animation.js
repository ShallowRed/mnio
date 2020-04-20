Fill = {

  init: function(cell, color, GAME, MAP) {
    GAME.flag = false;
    this.divx = 0;
    this.divy = 0;
    this.posx = MAP.CellSize * cell[1];
    this.posy = MAP.CellSize * (cell[0] + 1);
    this.lw = MAP.lw;
    MAP.ctx2.strokeStyle = color;
    MAP.ctx2.lineWidth = MAP.lw;
    this.frame(GAME, MAP);
  },

  frame: function(GAME, MAP) {
    if (Fill.divx == MAP.CellSize) {
      Fill.divy += Fill.lw;
      Fill.divx = 0;
    }
    Fill.divx += Math.round(MAP.CellSize / 8);
    if (Fill.divx >= MAP.CellSize * 0.65) {
      Fill.divx = MAP.CellSize;
    }
    if (Fill.divy > MAP.CellSize * 4.5 / 6) {
      Fill.lw = MAP.CellSize - Fill.divy;
      MAP.ctx2.lineWidth = Fill.lw;
      Fill.divy = MAP.CellSize - Fill.lw;
    }
    MAP.ctx2.strokeStyle = Fill.color;
    MAP.ctx2.beginPath();
    MAP.ctx2.moveTo(Fill.posx, Fill.posy - Fill.divy - Fill.lw / 2);
    MAP.ctx2.lineTo(Fill.posx + Fill.divx, Fill.posy - Fill.divy - Fill.lw / 2);
    MAP.ctx2.stroke();
    if (Fill.divy > MAP.CellSize * 4.5 / 6 && Fill.divx == MAP.CellSize) {
      GAME.flag = true;
      return;
    };
    Fill.animationFrame = window.requestAnimationFrame(function() {
      Fill.frame(GAME, MAP);
    });
  }

};

Translate = {

  init: function(GAME, MAP, PLAYER) {
    GAME.flag = false;
    GAME.update(true, MAP, PLAYER);
    this.start = Date.now();
    this.frame(GAME, MAP, PLAYER);
  },

  frame: function(GAME, MAP, PLAYER) {
    Translate.delta = (Date.now() - Translate.start) / 1000;
    if (Translate.delta >= GAME.duration) {
      MAP.render(PLAYER, GAME);
      GAME.flag = true;
      return;
    }
    Translate.animationFrame = window.requestAnimationFrame(function() {
      Translate.frame(GAME, MAP, PLAYER);
    });
  }

};

window.Fill = window.Fill || {};

window.Translate = window.Translate || {};

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
