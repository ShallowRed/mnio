import {
  zoom,
  select
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

const UI = {},
  Init = {}

UI.init = (GAME, PLAYER, MAP, socket) => {
  Init.Dom();
  Object.keys(Init.Listeners).forEach(event => Init.Listeners[event](GAME, PLAYER, MAP, socket));
  select(UI.cs[0], PLAYER, UI);
  hideLobby();
  // fullscreen();
};

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

  UI.tuto.style.width = MAP.width;
  UI.tuto.style.height = MAP.height;
  // UI.tuto.style.height = MAP.ratio ?  :  ;
};

Init.Dom = () => {
  UI.tuto = document.getElementById('tuto');
  UI.tuto = {
    openBtn: document.getElementById('openTuto'),
    closeBtn: document.getElementById('closeTuto'),
    window: document.getElementById('tuto')
  }
  UI.elem = document.documentElement;
  UI.cs = [document.getElementById('c1'), document.getElementById('c2'), document.getElementById('c3')];
  UI.lobby = document.getElementById('lobby');
  UI.btn = document.querySelectorAll('#buttons button');
  UI.btns = document.getElementById('buttons');
  UI.zoom = {
    in: document.getElementById('zoomin'),
    out: document.getElementById('zoomout')
  }
};

Init.Listeners = {

  click: (GAME, PLAYER, MAP, socket) => {
    UI.tuto.openBtn.addEventListener("click", () => UI.tuto.window.style.display = "block");
    UI.tuto.closeBtn.addEventListener("click", () => UI.tuto.window.style.display = "none");
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
    document.addEventListener('touchstart', event => touchStart(event, GAME), false);
    document.addEventListener('touchmove', event => touchMove(event, PLAYER, GAME, MAP, socket), false);
    document.addEventListener('touchend', event => touchEnd(event, GAME), false);
  },

  window: GAME => {
    window.addEventListener('resize', () => GAME.render());
    window.addEventListener("orientationchange", () => setTimeout(() => GAME.render(), 500));
  }
};

function selectNfill(color, GAME, PLAYER, MAP, UI, socket) {
  if (!GAME.flag.ok()) return;
  select(color, PLAYER, UI);
  Render.fill(PLAYER.position, PLAYER.Scolor, GAME, PLAYER, MAP, socket);
}

function hideLobby() {
  UI.lobby.style.opacity = 0;
  setTimeout(() => UI.lobby.style.display = "none", 300);
}

export default UI
