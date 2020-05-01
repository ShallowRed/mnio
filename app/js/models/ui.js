import {
  zoom,
  selectColor,
} from '../utils';

import {
  touchStart,
  touchEnd,
  touchMove
} from '../controlers/mobile';

import Render from '../views/render'

import {
  KeyboardInput
} from '../controlers/browser';

const UI = {};

UI.init = (GAME, PLAYER, MAP, socket) => {
  GetDomElements();
  Object.keys(Listeners).forEach(event => Listeners[event](GAME, PLAYER, MAP, socket));
  selectColor(0, PLAYER, UI);
  UI.lobby.style.opacity = 0;
  setTimeout(() => UI.lobby.style.display = "none", 300);
};

UI.update = (MAP) => {

  UI.btns.forEach(btn => {
    btn.style.height = MAP.Lmargin + "px";
    btn.style.width = MAP.Lmargin + "px";
    btn.style.margin = "0";
  });

  if (MAP.ratio) {
    UI.btns[1].style.marginTop =
      UI.btns[3].style.marginTop =
      UI.btns[3].style.marginBottom = "1vh";
    UI.btns[1].style.marginBottom = "3vh";
  } else {
    UI.btns[1].style.marginRight = "5%";
    UI.btns[1].style.marginLeft =
      UI.btns[3].style.marginLeft =
      UI.btns[3].style.marginRight = "2%";
  }

  UI.btnsBar.style.flexFlow = MAP.ratio ? "column" : "row";
  UI.btnsBar.style.width = MAP.ratio ? "10%" : "100%";
  UI.btnsBar.style.height = MAP.ratio ? "100%" : "10%";
  UI.btnsBar.style.top = MAP.ratio ? "0" : "auto";
  UI.btnsBar.style.right = MAP.ratio ? "0" : "auto";
  UI.btnsBar.style.bottom = MAP.ratio ? "auto" : "0";
  UI.btnsBar.style.paddingLeft = MAP.ratio ? "2%" : "0px";
  UI.btnsBar.style.paddingTop = MAP.ratio ? "0px" : "1%";

  UI.tuto.window.style.width = MAP.windowWidth - MAP.margin.right + 2 + "px";
  UI.tuto.window.style.height = MAP.windowHeight - MAP.margin.bottom + 2 + "px";
};

const GetDomElements = () => {
  UI.lobby = document.getElementById('lobby');
  UI.tuto = {
    openBtn: document.getElementById('openTuto'),
    closeBtn: document.getElementById('closeTuto'),
    window: document.getElementById('tuto')
  }
  UI.elem = document.documentElement;
  UI.btns = document.querySelectorAll('#buttons button');
  UI.btnsBar = document.getElementById('buttons');
  UI.colorBtns = document.querySelectorAll('.color');
  UI.zoom = {
    in: document.getElementById('zoomin'),
    out: document.getElementById('zoomout')
  }
};

const Listeners = {

  click: (GAME, PLAYER, MAP, socket) => {

    UI.tuto.openBtn.addEventListener("click", () => {
      UI.tuto.window.style.display = "block";
      UI.tuto.openBtn.style.display = "none";
      GAME.flag.tuto = true;
    });

    UI.tuto.closeBtn.addEventListener("click", () => {
      UI.tuto.window.style.display = "none";
      UI.tuto.openBtn.style.display = "block";
      GAME.flag.tuto = false;
    });

    UI.colorBtns.forEach((colorBtn, i) => {
      colorBtn.style.background = PLAYER.colors[i];
      colorBtn.addEventListener("click", () => {
        if (!GAME.flag.ok()) return;
        selectColor(i, PLAYER, UI);
        Render.fill(PLAYER.position, PLAYER.Scolor, GAME, PLAYER, MAP, socket);
      });
    });

    Object.keys(UI.zoom).forEach(el => UI.zoom[el].addEventListener("click", () => zoom(el, GAME, MAP)));

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

export default UI
