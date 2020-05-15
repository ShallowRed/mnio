import drawDonut from '../dataviz/colors'

import '../dataviz/players';
import GAME from '../../games/game1'
import CELL from '../models/cell';

let donutflag = false;

const DV = document.querySelectorAll("svg");
const donut = DV[0];
const bars = DV[1];

const drawBars = () => {}

const Events = {
  init: APP => {

    Object.keys(Events.click).forEach(prop => {
      let evtBtn = APP.buttons[prop];
      evtBtn.addEventListener("click", () => Events.click[prop](APP))
    });

    APP.switch.TL.addEventListener("click", () => toggleTL(APP));
    APP.switch.DV.addEventListener("click", () => toggleDV(APP));
    window.addEventListener('resize', () => APP.render.resize(), true);
    window.addEventListener("orientationchange", () =>
      setTimeout(() => APP.render.resize(), 500)
    );
    bars.style.display = "none";
    donut.style.display = "none";
    dvClick(APP);
  }
};

Events.click = {

  slow: APP => APP.render.play("slow"),

  fast: APP => APP.render.play("fast"),

  faster: APP => APP.render.play("faster"),

  pause: APP => {
    APP.play = false;
    APP.render.focusBtn("pause");
  },

  end: APP => {
    APP.render.stop();
    APP.render.all();
    setTimeout(() => {
      APP.time = APP.colors.length;
    }, 50)
  },

  reset: APP => {
    APP.render.stop();
    APP.time = 0;
  },

  hue: () => {
    if (bars.style.display !== "none") bars.style.display = "none";
    if (donut.style.display !== "block") donut.style.display = "block";
    donutflag = !donutflag;
    drawDonut(donutflag)
  },

  bars: () => {
    if (donut.style.display !== "none") donut.style.display = "none";
    if (bars.style.display !== "block") bars.style.display = "block";
  }
};

const toggleBars = (APP) => {
  const visibleBar = bars.style.display !== "none";
  bars.style.display = visibleBar ? "none" : "block";
  APP.dvflag = visibleDv ? false : true;
  if (APP.switch.TL.checked) {
    APP.buttons.time.style.display = "none";
    APP.switch.TL.checked = false;
    APP.render.all();
  }
  APP.update(APP);
}

const toggleDV = (APP) => {
  const visibleDv = !APP.switch.DV.checked;
  APP.dataviz.style.display = visibleDv ? "none" : "block";
  APP.dvflag = visibleDv ? false : true;
  if (APP.switch.TL.checked) {
    APP.buttons.time.style.display = "none";
    APP.switch.TL.checked = false;
  }
  APP.update(APP);
  APP.render.all();
}

const toggleTL = (APP) => {
  if (!APP.switch.TL.checked) {
    APP.buttons.time.style.opacity = "0";
    setTimeout(() => APP.buttons.time.style.display = "none", 100);
  } else {
    APP.buttons.time.style.display = "flex";
    setTimeout(() => APP.buttons.time.style.opacity = "1", 10);
    APP.render.clearMap();
  }
  if (APP.switch.DV.checked) {
    APP.switch.DV.checked = false;
    APP.dataviz.style.display = "none";
    APP.dvflag = false;
    APP.update(APP);
  }

}

const dvClick = (APP) => d3.select("#dataviz").on("click", () => {
  if (bars.style.display == "none") return;
  let target = d3.select(d3.event.target).datum();
  GAME.players.forEach(player => {
    if (player && player.length) {
      let sorted = Array.from(new Set(player));
      if (sorted.length == target) {
        APP.ctx2.fillStyle = "#f2f2f2";
        APP.ctx2.fillRect(0, 0, APP.canvas.width, APP.canvas.height)
        sorted.forEach(e => CELL.clear(e, APP, APP.ctx2));
      };
    }
  });
});

export default Events
