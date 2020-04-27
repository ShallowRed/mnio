import {
  zoom,
  select,
  flagOk,
} from '../utils';

import Render from '../views/render';

import {
  touchStart,
  touchEnd,
  touchMove
} from '../controlers/mobile';

import {
  KeyboardInput
} from '../controlers/browser';

const UI = {};

UI.init = (GAME, PLAYER, MAP, socket) => {
  getElements();
  Object.keys(Listen).forEach(event => Listen[event](GAME, PLAYER, MAP, socket));
  select(UI.cs[0], PLAYER, UI);
  hideLobby();
  // fullscreen();
};

function getElements() {

  UI.lobby = document.getElementById('lobby');

  UI.zoom = {
    in: document.getElementById('zoomin'),
    out: document.getElementById('zoomout')
  }

  UI.elem = document.documentElement;

  UI.full = {
    button: document.getElementById('full'),
    flag: false
  };

  UI.cs = [document.getElementById('c1'), document.getElementById('c2'), document.getElementById('c3')];

}

const Listen = {

  click: (GAME, PLAYER, MAP, socket) => {
    UI.full.button.addEventListener("click", () => fullscreen());
    UI.cs.forEach(cbtn => {
      cbtn.style.background = PLAYER.colors[UI.cs.indexOf(cbtn)];
      cbtn.addEventListener("click", () => selectNfill(cbtn, GAME, PLAYER, MAP, UI, socket));
    });
    Object.keys(UI.zoom).forEach(el => UI.zoom[el].addEventListener("click", () => zoom(el, GAME, MAP, PLAYER)));
    document.addEventListener('click', () => {
      if (document.activeElement.toString() == '[object HTMLButtonElement]') document.activeElement.blur();
    });
  },

  browser: (GAME, PLAYER, MAP, socket) => {
    document.addEventListener('keydown', event => KeyboardInput(event, PLAYER, GAME, UI, MAP, socket));
    document.addEventListener('keyup', () => GAME.flag3 = true);
  },

  mobile: (GAME, PLAYER, MAP, socket) => {
    document.addEventListener('touchstart', touchStart, false);
    document.addEventListener('touchmove', event => touchMove(event, PLAYER, GAME, MAP, socket), false);
    document.addEventListener('touchend', touchEnd, false);
  },

  window: GAME => {
    window.addEventListener('resize', () => GAME.render());
    window.addEventListener("orientationchange", () => setTimeout(() => GAME.render(), 500));
  }

}

function selectNfill(color, GAME, PLAYER, MAP, UI, socket) {
  if (!flagOk(GAME)) return;
  select(color, PLAYER, UI);
  Render.fill(PLAYER.position, PLAYER.selectedcolor, GAME, PLAYER, MAP, socket);
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

function hideLobby() {
  UI.lobby.style.opacity = 0;
  setTimeout(() => UI.lobby.style.display = "none", 300);
}

export default UI
