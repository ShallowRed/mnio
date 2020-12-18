import drawDonut from '../dataviz/colors'
import drawBars from '../dataviz/players'

const DV = {
  buttons: {},
  sortColors: false,
  game: document.getElementById("game"),
  togglesort: document.getElementById("togglesort"),
  insights: document.getElementById("insights"),
  graphs: document.getElementById("graphs"),
  switch: {
    game: document.getElementById("gameSwitch"),
    donut: document.getElementById("donutSwitch"),
    bars: document.getElementById("barSwitch")
  },
  isOn: {
    game: () => DV.switch.game.checked,
    donut: () => DV.switch.donut.checked,
    bars: () => DV.switch.bars.checked
  }
}

DV.init = APP => {

  Object.keys(toggle).forEach(prop => {
    const switchBtn = DV.switch[prop];
    switchBtn.addEventListener("click", () => toggle[prop](APP))
  });

  drawDonut(APP, DV.sortColors);
  drawBars(APP);

  APP.donut = DV.donut = document.getElementById("donut");
  APP.bars = DV.bars = document.getElementById("bars");
  APP.yAxis1 = document.getElementById("yAxis1");
  APP.yAxis2 = document.getElementById("yAxis2");
  APP.dot1 = document.getElementById("dot1");
  APP.dot2 = document.getElementById("dot2");
  APP.ylabel = document.getElementById("ylabel");
  DV.legend = document.getElementById("legend");
  DV.explore = document.getElementById("explore");
  DV.carton = document.getElementById("carton");
  DV.bars.style.display = "none";
  DV.donut.style.display = "none";
  DV.togglesort.style.display = "none"
  DV.switch.game.checked = true;
  toggle.game(APP);

  APP.sortHue.addEventListener("click", () => {
    DV.sortColors = !DV.sortColors;
    drawDonut(APP, DV.sortColors);
  })
};

const toggle = {

  game: (APP) => {
    if (DV.isOn.game()) mode.game.on();
    else mode.game.off();
    if (DV.isOn.donut()) mode.donut.off();
    if (DV.isOn.bars()) mode.bars.off(APP);
  },

  donut: (APP) => {
    if (DV.isOn.donut()) mode.donut.on();
    else mode.donut.off();
    if (DV.isOn.bars()) mode.bars.off(APP);
    if (DV.isOn.game()) mode.game.off();
  },

  bars: (APP) => {
    if (DV.isOn.bars()) mode.bars.on();
    else mode.bars.off(APP);
    if (DV.isOn.donut()) mode.donut.off();
    if (DV.isOn.game()) mode.game.off();
  }
};

const mode = {

  game: {
    on: () => {
      DV.game.style.display = "block";
      DV.carton.style.display = "block";
    },
    off: () => {
      DV.switch.game.checked = false;
      DV.game.style.display = "none";
      DV.carton.style.display = "none";
    }
  },
  donut: {
    on: () => {
      DV.donut.style.display = "block"
      DV.togglesort.style.display = "flex"
    },
    off: () => {
      DV.switch.donut.checked = false;
      DV.donut.style.display = "none"
      DV.togglesort.style.display = "none"
    }
  },

  bars: {
    on: () => {
      DV.legend.style.display = "block";
      DV.bars.style.display = "block";
      DV.explore.style.display = "block";
    },
    off: (APP) => {
      DV.switch.bars.checked = false;
      DV.bars.style.display = "none";
      DV.explore.style.display = "none";
      DV.insights.style.display = "none";
      DV.legend.style.display = "none";
      APP.ctx2.clearRect(0, 0, APP.canvas2.width, APP.canvas2.height);
    }
  }
};

export default DV;
