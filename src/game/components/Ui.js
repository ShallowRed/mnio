import ScreenRatio from '../utils/styleAccordingToRatio'

export default class Ui {

  constructor() {
    this.colorBtns = document.querySelectorAll('.color');
    this.zoomBtns = {
      in: document.getElementById('zoomin'),
      out: document.getElementById('zoomout')
    };
  }

  render() {
    const section = document.querySelector('section');
    const btnBar = document.getElementById('buttons');
    const buttons = document.querySelectorAll('#buttons button');

    ScreenRatio.applyStyles({
      domEl: section,
      styles: {
        flexDirection: ["row", "column"],
      }
    }, {
      domEl: btnBar,
      styles: {
        flexFlow: ["column", "row"],
        height: ["auto", "11%"],
        width: ["11%", "100%"],
        float: ["right", "none"],
        margin: ["auto 0 auto auto", "auto auto 0"],
      }
    }, ...ScreenRatio.mapStyles(buttons, {
      height: ["10vh", "10vw"],
      width: ["10vh", "10vw"],
      margin: [".5vh 0", "0 1vw"]
    }), {
      domEl: buttons[2],
      styles: {
        marginTop: ["3vh", "0"],
        marginLeft: ["0", "5vw"],
      }
    })
  }

  focusColorBtn(selectedIndex) {
    this.colorBtns.forEach((btn, index) => {
      this.colorBtns[index].className =
        index == selectedIndex ?
        "pressed" : '';
    });
  }
}
