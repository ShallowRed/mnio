export default class Ui {

  constructor(Map) {
    this.Map = () => Map;
    this.tuto = {
      openBtn: document.getElementById('openTuto'),
      closeBtn: document.getElementById('closeTuto'),
      window: document.getElementById('tuto')
    };
    this.section = document.querySelector('section');
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

  render(Map = this.Map()) {
    this.btns[2].style.marginTop = Map.ratio ? "3vh" : "0";
    this.btns[2].style.marginLeft = Map.ratio ? "0" : "5%";
    this.section.style.flexDirection = Map.ratio ? "row" : "column";
    const props = Object.entries({
      flexFlow: ["column", "row"],
      height: ["auto", "10%"],
      width: ["10%", "100%"],
      float: ["right", "none"],
      margin: ["auto 0 auto auto", "auto auto 0"],
    });
    for (const [key, value] of props) {
      this.btnsBar.style[key] = value[Map.ratio ? 0 : 1];
    }
  }

  focusColorBtn(i) {
    this.colorBtns.forEach((btn, j) => {
      const borderWidth = j == i ? 3 : 1;
      const scale = j == i ? 1 : 0.8;
      btn.style.setProperty('border-width', `${borderWidth}px`);
      btn.style.setProperty('transform', `scale(${scale})`);
    });
  }

  focusZoomBtn(direction) {
    this.setZoomBtn(direction, true);
    setTimeout(() =>
      this.setZoomBtn(direction, false),
      200);
  }

  setZoomBtn(direction, bool) {
    const btn = this.zoom[direction];
    btn.style.color = btn.style.borderColor = bool ? "blue" : "black";
    btn.style.transform = `scale(${bool ? 1 : 0.8})`;
  }
}
