export default class Ui {

  constructor(Map) {
    this.Map = () => Map;
    this.section = document.querySelector('section');
    this.btns = document.querySelectorAll('#buttons button');
    this.btnsBar = document.getElementById('buttons');
    this.colorBtns = document.querySelectorAll('.color');
    this.zoom = {
      in: document.getElementById('zoomin'),
      out: document.getElementById('zoomout')
    };

  }

  render(Map = this.Map()) {

    this.section.style.flexDirection = Map.ratio ? "row" : "column";

    for (const [key, value] of Object.entries({
        flexFlow: ["column", "row"],
        height: ["auto", "11%"],
        width: ["11%", "100%"],
        float: ["right", "none"],
        margin: ["auto 0 auto auto", "auto auto 0"],
      })) {
      this.btnsBar.style[key] = value[Map.ratio ? 0 : 1];
    }

    for (const [key, value] of Object.entries({
        height: ["10vh", "10vw"],
        width: ["10vh", "10vw"],
        margin: [".8vh 0", "0 .8vw"]
      })) {
      this.btns.forEach(btn =>
        btn.style[key] = value[Map.ratio ? 0 : 1]
      );
    }

    this.btns[2].style.marginTop = Map.ratio ? "3vh" : "0";
    this.btns[2].style.marginLeft = Map.ratio ? "0" : "5vw";
  }

  focusColorBtn(selectedIndex) {
    this.colorBtns.forEach((btn, index) => {
      const borderWidth = index == selectedIndex ? 2 : 1;
      const scale = index == selectedIndex ? 1 : 0.9;
      btn.style.borderWidth = `${borderWidth}px`;
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
