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
        if (!FlagOk(GAME)) return;
        select(c, PLAYER, UI);
        Render.fill(PLAYER.position, PLAYER.selectedcolor, GAME, PLAYER, MAP, socket);
      });
    });

    UI.zin.addEventListener("click", () => {
      if (FlagOk(GAME)) zoomin(GAME, MAP, PLAYER);
    });

    UI.zout.addEventListener("click", () => {
      if (FlagOk(GAME)) zoomout(GAME, MAP, PLAYER);
    });

    document.addEventListener('keydown', event => {
      if (FlagOk(GAME)) KeyboardInput(event, PLAYER, GAME, UI, MAP, socket);
    });

    document.addEventListener('keyup', () => {
      GAME.flag3 = true;
    });

    document.addEventListener('touchstart', touchStart, false);

    document.addEventListener('touchmove', event => {
      if (FlagOk(GAME)) touchMove(event, PLAYER, GAME, MAP, socket);
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

function FlagOk(GAME) {
  if (GAME.flag && GAME.flag2 && GAME.flag3) return true;
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
  setTimeout(() => UI.lobby.style.display = "none", 500);
}

export default UI
