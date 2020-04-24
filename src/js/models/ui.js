import {
  zoomin,
  zoomout,
  select,
} from '../utils'

import Render from '../controlers/render'

import {
  touchStart,
  touchMove
} from '../events/mobile'

import {
  KeyboardInput
} from '../events/browser';

const UI = {

  init: (GAME, PLAYER, MAP, socket) => {

    UI.lobby = document.getElementById('lobby');
    UI.zin = document.getElementById('zoomin');
    UI.zout = document.getElementById('zoomout');
    UI.elem = document.documentElement;
    UI.full = {
      button: document.getElementById('full'),
      flag: false
    };

    UI.cs = [
      document.getElementById('c1'),
      document.getElementById('c2'),
      document.getElementById('c3')
    ];

    UI.cs.forEach( c => {
      c.style.background = PLAYER.colors[UI.cs.indexOf(c)];
      c.addEventListener("click", () => {
        select(c, PLAYER, UI);
        Render.fill(PLAYER.position, PLAYER.selectedcolor, GAME, PLAYER, MAP, socket);
      });
    });

    UI.zin.addEventListener("click", () => {
      if (GAME.flag) zoomin(GAME, MAP, PLAYER);
    });

    UI.zout.addEventListener("click", () => {
      if (GAME.flag) zoomout(GAME, MAP, PLAYER);
    });

    document.addEventListener('keydown', event => {
      if (!GAME.flag) return;
      KeyboardInput(event, PLAYER, GAME, UI, MAP, socket);
    });

    document.addEventListener('touchstart', touchStart, false);

    document.addEventListener('touchmove', event => {
      touchMove(event, PLAYER, GAME, MAP, socket);
    }, false);

    document.addEventListener('click', () => {
      if (document.activeElement.toString() == '[object HTMLButtonElement]') document.activeElement.blur();
    });

    window.addEventListener('resize', () => GAME.render());

    window.addEventListener("orientationchange", () => GAME.render());

    UI.full.button.addEventListener("click", () => fullscreen());

    select(UI.cs[0], PLAYER, UI);
    // fullscreen();
    hidelobby();

  }
}

function fullscreen() {

  if (!UI.full.flag) {
    UI.full.flag = true;
    if (UI.elem.requestFullscreen) UI.elem.requestFullscreen();
    else if (UI.elem.mozRequestFullScreen) UI.elem.mozRequestFullScreen();
    else if (UI.elem.webkitRequestFullscreen) UI.elem.webkitRequestFullscreen();
    else if (UI.elem.msRequestFullscreen) UI.elem.msRequestFullscreen();

  } else {
    UI.full.flag = false;
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  }
}

function hidelobby() {
  UI.lobby.style.opacity = "0";
  setTimeout(function() {
    UI.lobby.style.display = "none";
  }, 500);
}

export default UI

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
