import CELL from '../models/cell';

import APP from './init'

APP.render = {

  play: (speed) => {
    if (APP.time == APP.colors.length) {
      APP.time = 0;
      APP.render.clearMap();
    }
    APP.play = true;
    APP.speed = (speed == "slow") ? 1 : (speed == "fast") ? 10 : 50;
    APP.render.cells(APP.time);
    APP.render.focusBtn(speed);
  },

  stop: () => {
    APP.play = false;
    APP.render.focusBtn();
    APP.render.clearMap();
  },

  focusBtn: (btn) => {
    ["slow", "fast", "faster", "pause"].forEach(prop => {
      let button = APP.buttons[prop];
      let saturation = (btn == prop) ? 100 : 0;
      button.style.filter = "saturate(" + saturation + "%)";
    })
  },

  resize: () => {
    APP.render.focusBtn();
    APP.update(APP);
    if (APP.time !== APP.colors.length || APP.play) {
      APP.render.clearMap();
      APP.time = 0;
      APP.play = false;
    } else APP.render.all();
  },

  all: (first) => {
    let end = first ? first : APP.order.length;
    for (let i = 0; i < end; i++) {
      CELL.fill(APP.order[i], APP.palette[APP.colors[i]], APP)
    }
  },

  clearMap: () => {
    APP.ctx.clearRect(0, 0, APP.canvas.width, APP.canvas.height);
  },

  cells: (e) => {
    if (!e) e = 0;
    if (!APP.play) {
      APP.time = e;
      return
    }
    for (let i = e; i <= e + APP.speed; i++) {
      CELL.fill(APP.order[i], APP.palette[APP.colors[i]], APP);
      if (i == APP.colors.length) {
        APP.time = APP.colors.length;
        return
      }
    }
    setTimeout(() => {
      APP.render.cells(e + APP.speed + 1);
      return
    }, 20);
  }
}

export default APP;
