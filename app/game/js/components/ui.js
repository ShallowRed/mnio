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

  focusZoom(dir, bool) {
    const btn = this.zoom[dir];
    btn.style.color = btn.style.borderColor = bool ? "blue" : "black";
    btn.style.transform = `scale(${bool ? 1 : 0.8})`;
  }
}
