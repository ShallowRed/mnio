import ScreenRatio from '../utils/styleAccordingToRatio'

export default class Ui {

  constructor() {
    this.section = document.querySelector('section');
    this.btns = document.querySelectorAll('#buttons button');
    this.btnsBar = document.getElementById('buttons');
    this.colorBtns = document.querySelectorAll('.color');
    this.zoom = {
      in: document.getElementById('zoomin'),
      out: document.getElementById('zoomout')
    };
  }

  render() {

    ScreenRatio.applyStyles({
      domEl: this.section,
      styles: {
        flexDirection: ["row", "column"],
      }
    }, {
      domEl: this.btnsBar,
      styles: {
        flexFlow: ["column", "row"],
        height: ["auto", "11%"],
        width: ["11%", "100%"],
        float: ["right", "none"],
        margin: ["auto 0 auto auto", "auto auto 0"],
      }
    }, {
      domEl: this.btns[2],
      styles: {
        marginTop: ["3vh", "0"],
        marginLeft: ["0", "5vw"],
      }
    }, ...[...this.btns].map(btn => ({
      domEl: btn,
      styles: {
        height: ["10vh", "10vw"],
        width: ["10vh", "10vw"],
        margin: [".8vh 0", "0 .8vw"]
      }
    })));
  }

  focusColorBtn(selectedIndex) {
    this.colorBtns.forEach((btn, index) => {
      const bS = index == selectedIndex ? 8 : 5;
      const bSC = index == selectedIndex ? "#ddd" : "#bbb";
      const bSB = index == selectedIndex ? "0" : "0";
      const scale = index == selectedIndex ? 1 : 0.9;
      btn.style.boxShadow = `${bSC} ${bS}px ${bS}px ${bSB}`;

      btn.style.transform = `scale(${scale})`;
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
