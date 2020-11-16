import zoom from '../components/map/zoom';

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

  selectColor(i) {
    this.colorBtns.forEach((btn, j) => {
      btn.style.setProperty('border-width', `${j == i ? 3 : 1}px`);
      btn.style.setProperty('transform', `scale(${j == i ? 0.9 : 0.7})`);
    });
  }

  listenEvents(GAME) {
      const { flag } = GAME;
      const { tuto } = this;

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

      const { palette } = PLAYER;

      this.colorBtns.forEach((colorBtn, i) => {

        colorBtn.style.background = GAME.PLAYER.palette[i];

        colorBtn.addEventListener("click", () => {
          if (!flag.ok()) return;
          GAME.selectColor(i);
          GAME.fill();
        });

        colorBtn.addEventListener("touchstart", (event) => {
          event.preventDefault();
          if (!flag.ok()) return;
          GAME.selectColor(i);
          GAME.fill();
        });
      });

      for (const [key, value] of Object.entries(this.zoom)) {
        value.addEventListener("click", () => {
          zoom(key, GAME)
        });
      }

      document.addEventListener('click', () => {
        if (document.activeElement.toString() ==
          '[object HTMLButtonElement]')
          document.activeElement.blur();
      });
  }
}

const hide = (elem) => {
  elem.style.opacity = "0";
  setTimeout(() => elem.style.display = "none", 300);
};

const show = (elem) => {
  elem.style.display = "block";
  setTimeout(() => elem.style.opacity = "1", 50);
};
