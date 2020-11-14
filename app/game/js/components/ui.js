import { touchStart, touchEnd, touchMove } from '../controls/mobile';
import { selectColor, } from '../utils/utils';
import zoom from '../components/map/zoom';
import Render from '../components/map/render';
import KeyboardInput from '../controls/keyboard';

export default class Ui {

  constructor() {
    this.refresh = document.getElementById('refresh');
    this.tuto = {
      openBtn: document.getElementById('openTuto'),
      closeBtn: document.getElementById('closeTuto'),
      window: document.getElementById('tuto')
    };
    this.elem = document.documentElement;
    this.btns = document.querySelectorAll('#buttons button');
    this.btnsBar = document.getElementById('buttons');
    this.colorBtns = document.querySelectorAll('.color');
    this.zoom = {
      in: document.getElementById('zoomin'),
      out: document.getElementById('zoomout')
    };

    document.getElementById('logo')
      .style.display = "block";

    this.tuto.openBtn.style.display = "block";
  }

  initListeners(socket, context) {
    for (const listen of Object.values(Listeners))
      listen(context, socket, this)

    selectColor(0, context.PLAYER, this);
  }

  update(MAP) {
    const { lMargin, ratio, windowWidth, windowHeight, margin } = MAP;

    this.btns.forEach(btn => {
      btn.style.height = lMargin + "px";
      btn.style.width = lMargin + "px";
      btn.style.margin = "0";
    });

    if (ratio) this.btns[2].style.marginTop = "3vh";
    else this.btns[2].style.marginLeft = "5%";

    const props = Object.entries({
      flexFlow: ["column", "row"],
      width: ["10%", "100%"],
      height: ["100%", "10%"],
      top: ["0", "auto"],
      right: ["0", "auto"],
      bottom: ["auto", "0"],
      paddingLeft: ["2%", "0px"],
      paddingTop: ["0px", "1%"]
    });

    for (const [key, value] of props) {
      this.btnsBar.style[key] = value[ratio ? 0 : 1];
    }

    this.tuto.window.style.width = `${windowWidth - margin.right + 2}px`;
    this.tuto.window.style.height =
      `${windowHeight - margin.bottom + 2}px`;

    this.tuto.openBtn.style.right =
      this.tuto.closeBtn.style.right =
      this.refresh.style.right =
      (ratio && windowHeight < 600) ? "9%" : "10px";
  }
}

const Listeners = {

  click: (context, socket, UI) => {

    const { GAME, PLAYER } = context;
    const { flag } = GAME;
    const { tuto } = UI;

    tuto.openBtn.addEventListener("click", () => {
      show(tuto.window);
      tuto.openBtn.style.display = "none";
      tuto.closeBtn.style.display = "block";
      flag.tuto = true;
    });

    tuto.closeBtn.addEventListener("click", () => {
      hide(tuto.window);
      tuto.openBtn.style.display = "block";
      tuto.closeBtn.style.display = "none";
      flag.tuto = false;
    });

    const { palette, position, sColor } = PLAYER;

    UI.colorBtns.forEach((colorBtn, i) => {

      colorBtn.style.background = palette[i];

      colorBtn.addEventListener("click", () => {
        if (!flag.ok()) return;
        selectColor(i, PLAYER, UI);
        Render.fill(position, sColor, context, socket);
      });

      colorBtn.addEventListener("touchstart", (event) => {
        event.preventDefault();
        if (!flag.ok()) return;
        selectColor(i, PLAYER, UI);
        Render.fill(position, sColor, context, socket);
      });
    });

    for (const [key, value] of Object.entries(UI.zoom)) {
      value.addEventListener("click", () => {
        zoom(key, context, UI)
      });
    }

    document.addEventListener('click', () => {
      if (document.activeElement.toString() ==
        '[object HTMLButtonElement]')
        document.activeElement.blur();
    });

  },

  keyboardEvents: (context, socket, UI) => {

    document.addEventListener('keydown', event => {
      if (event.code == "AltLeft")
        UI.isAlt = true;
    });

    document.addEventListener('keyup', event => {
      if (event.code == "AltLeft")
        UI.isAlt = false;
    });

    document.addEventListener('keydown', event =>
      KeyboardInput(event, context, UI, socket)
    );

    document.addEventListener('keyup', () =>
      context.GAME.flag.input = false
    );
  },

  touchEvents: (context, socket) => {

    const { GAME, MAP: { master } } = context;
    const { flag } = GAME;

    master.addEventListener('touchstart', event =>
      touchStart(event, flag),
      false);
    master.addEventListener('touchmove', event =>
      touchMove(event, context, flag, socket),
      false);
    master.addEventListener('touchend', event =>
      touchEnd(event, flag),
      false);
  },
};

const hide = (elem) => {
  elem.style.opacity = "0";
  setTimeout(() => elem.style.display = "none", 300);
};

const show = (elem) => {
  elem.style.display = "block";
  setTimeout(() => elem.style.opacity = "1", 50);
};
