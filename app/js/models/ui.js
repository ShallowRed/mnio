import {
  zoom,
  select,
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
  UI.btn = document.querySelectorAll('#buttons button');
  UI.btns = document.getElementById('buttons');
  UI.zoom = {
    in: document.getElementById('zoomin'),
    out: document.getElementById('zoomout')
  }

  UI.elem = document.documentElement;

  // UI.full = {
  //   button: document.getElementById('full'),
  //   flag: false
  // };

  UI.cs = [document.getElementById('c1'), document.getElementById('c2'), document.getElementById('c3')];

}

const Listen = {

  click: (GAME, PLAYER, MAP, socket) => {
    // UI.full.button.addEventListener("click", () => fullscreen());
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
    document.addEventListener('keyup', () => GAME.flag.input = false);
  },

  mobile: (GAME, PLAYER, MAP, socket) => {
    document.addEventListener('touchstart',  event => touchStart(event, GAME), false);
    document.addEventListener('touchmove', event => touchMove(event, PLAYER, GAME, MAP, socket), false);
    document.addEventListener('touchend', event => touchEnd(event, GAME), false);
  },

  window: GAME => {
    window.addEventListener('resize', () => GAME.render());
    window.addEventListener("orientationchange", () => setTimeout(() => GAME.render(), 500));
  }

}

function selectNfill(color, GAME, PLAYER, MAP, UI, socket) {
  if (!GAME.flag.ok()) return;
  select(color, PLAYER, UI);
  Render.fill(PLAYER.position, PLAYER.Scolor, GAME, PLAYER, MAP, socket);
}

function hideLobby() {
  UI.lobby.style.opacity = 0;
  setTimeout(() => UI.lobby.style.display = "none", 300);
}

UI.update = (MAP) => {

  UI.btn.forEach(btn => {
    btn.style.height = MAP.Lmargin + "px";
    btn.style.width = MAP.Lmargin + "px";
    btn.style.margin = "0";
  });

  if (MAP.ratio) {
    UI.btn[1].style.marginTop = UI.btn[3].style.marginTop = UI.btn[3].style.marginBottom = "1vh";
    UI.btn[1].style.marginBottom = "3vh";
  } else {
    UI.btn[1].style.marginRight = "5%";
    UI.btn[1].style.marginLeft = UI.btn[3].style.marginLeft = UI.btn[3].style.marginRight = "2%";
  }

  UI.btns.style.flexFlow = MAP.ratio ? "column" : "row";
  UI.btns.style.width = MAP.ratio ? "8%" : "100%";
  UI.btns.style.height = MAP.ratio ? "100%" : "10%";

  UI.btns.style.top = MAP.ratio ? "0" : "auto";
  UI.btns.style.marginLeft = MAP.ratio ? "92%" : "0";
  UI.btns.style.bottom = MAP.ratio ? "none" : "5px";
}

// function fullscreen() {
//
//   if (!UI.full.flag) {
//     UI.full.flag = true;
//     if (UI.elem.requestFullscreen) UI.elem.requestFullscreen();
//     else if (UI.elem.mozRequestFullScreen) UI.elem.mozRequestFullScreen();
//     else if (UI.elem.webkitRequestFullscreen) UI.elem.webkitRequestFullscreen();
//     else if (UI.elem.msRequestFullscreen) UI.elem.msRequestFullscreen();
//
//   } else {
//     UI.full.flag = false;
//     if (document.exitFullscreen) document.exitFullscreen()Lucastom2!;
//     else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
//     else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//     else if (document.msExitFullscreen) document.msExitFullscreen();
//   }
// }

export default UI
