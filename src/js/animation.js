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

(function( window ) {

  'use strict';

  var lastTime = 0;
  var prefixes = 'webkit moz ms o'.split(' ');
  // get unprefixed rAF and cAF, if present
  var requestAnimationFrame = window.requestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame;
  // loop through vendor prefixes and get prefixed rAF and cAF
  var prefix;
  for( var i = 0; i < prefixes.length; i++ ) {
    if ( requestAnimationFrame && cancelAnimationFrame ) {
      break;
    }
    prefix = prefixes[i];
    requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
    cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] ||
                              window[ prefix + 'CancelRequestAnimationFrame' ];
  }

  // fallback to setTimeout and clearTimeout if either request/cancel is not supported
  if ( !requestAnimationFrame || !cancelAnimationFrame ) {
    requestAnimationFrame = function( callback, element ) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
      var id = window.setTimeout( function() {
        callback( currTime + timeToCall );
      }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
    };

    cancelAnimationFrame = function( id ) {
      window.clearTimeout( id );
    };
  }

  // put in global namespace
  window.requestAnimationFrame = requestAnimationFrame;
  window.cancelAnimationFrame = cancelAnimationFrame;

})(window);

window.Fill = window.Fill || {};

window.Translate = window.Translate || {};
