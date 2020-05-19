import CELL from '../models/cell';

const render = {

  play: (APP, speed) => {
    if (APP.time == APP.colors.length) {
      APP.render.stop(APP);
      APP.render.clearMap(APP);
      APP.time = 0;
    }
    APP.speed = (speed == "slow") ? 1 : (speed == "fast") ? 10 : 100;
    APP.render.focusBtn(APP, speed);
    if (!APP.play) {
      APP.play = true;
      APP.render.cells(APP, APP.time);
    }
  },

  stop: APP => {
    APP.play = false;
    setTimeout(() => APP.time = 0, 50);
    APP.render.focusBtn(APP);
    APP.render.clearMap(APP);
  },

  focusBtn: (APP, btn) => {
    ["slow", "fast", "faster", "pause"].forEach(prop => {
      let button = APP.buttons[prop];
      let saturation = (btn == prop) ? 100 : 0;
      button.style.filter = "saturate(" + saturation + "%)";
    })
  },

  resize: APP => {
    APP.render.focusBtn(APP);
    APP.update(APP);
    if (APP.time !== APP.colors.length || APP.play) {
      APP.render.clearMap(APP);
      APP.time = 0;
      APP.play = false;
    } else APP.render.all(APP);
  },

  all: (APP, first) => {
    APP.time = APP.order.length;
    let end = first ? first : APP.order.length;
    for (let i = 0; i < end; i++) {
      CELL.fill(APP.order[i], APP.palette[APP.colors[i]], APP)
    }
  },

  clearMap: APP => {
    APP.ctx.clearRect(0, 0, APP.canvas.width, APP.canvas.height);
  },

  cells: (APP, time) => {
    if (!APP.play) {
      APP.time = time;
      return
    }
    for (let i = time; i <= time + APP.speed; i++) {
      CELL.fill(APP.order[i], APP.palette[APP.colors[i]], APP);
      if (i == APP.colors.length) {
        APP.time = APP.colors.length;
        APP.render.focusBtn(APP);
        return
      }
    }
    setTimeout(() => {
      APP.render.cells(APP, time + APP.speed + 1);
      return
    }, 20);
  }
}

export default render;
