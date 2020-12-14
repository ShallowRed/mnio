import CELL from '../utils/cell';

const TL = {
  buttons: {},
  time: 0,
  speed: 20,
  play: false,
};

TL.init = (APP) =>
  document.querySelectorAll('#playBar button').forEach(btn => {
    const button = TL.buttons[btn.id] = btn;
    button.addEventListener("click", () => TL.events[btn.id](APP))
    btn.style.filter = "saturate(0%)";
  });

TL.events = {

  slow: (APP) => TL.actions.play("slow", APP),
  fast: (APP) => TL.actions.play("fast", APP),
  faster: (APP) => TL.actions.play("faster", APP),

  pause: () => {
    TL.play = false;
    TL.actions.focusBtn("pause");
  },

  end: (APP) => {
    TL.actions.stop(APP, true);
    setTimeout(() => TL.actions.end(APP), 100);
  },

  reset: (APP) =>
    TL.actions.stop(APP)
};

TL.actions = {

  play: (speed, APP) => {
    if (TL.time == APP.colors.length) {
      TL.actions.stop(APP);
      TL.actions.clearMap(APP);
      TL.time = 0;
    }
    TL.speed = (speed == "slow") ? 1 : (speed == "fast") ? 10 : 50;
    TL.actions.focusBtn(speed);
    if (!TL.play) {
      TL.play = true;
      TL.actions.renderCells(TL.time, APP);
    }
  },


  stop: (APP, dontClear) => {
    TL.play = false;
    setTimeout(() => TL.time = 0, 50)
    TL.actions.focusBtn();
    if (!dontClear) TL.actions.clearMap(APP);
  },

  focusBtn: (btn) => {
    ["slow", "fast", "faster", "pause"].forEach(prop => {
      const button = TL.buttons[prop];
      const saturation = (btn == prop) ? 100 : 0;
      button.style.filter = "saturate(" + saturation + "%)";
    })
  },

  resize: (APP) => {
    TL.actions.focusBtn();
    if (TL.time !== APP.colors.length || TL.play) {
      TL.actions.clearMap(APP);
      TL.time = 0;
      TL.play = false;
    } else TL.actions.end(APP);
  },

  end: (APP, first) => {
    if (!APP.order) return;
    TL.time = APP.order.length;
    const end = first ? first : APP.order.length;
    for (let i = 0; i < end; i++) {
      CELL.fill(APP.order[i], APP.palette[APP.colors[i]], APP)
    }
  },

  clearMap: (APP) => {
    APP.ctx.clearRect(0, 0, APP.canvas.width, APP.canvas.height);
  },

  renderCells: (e, APP) => {
    if (!TL.play) {
      TL.time = e;
      return
    }
    for (let i = e; i <= e + TL.speed; i++) {
      CELL.fill(APP.order[i], APP.palette[APP.colors[i]], APP);
      if (i == APP.colors.length) {
        TL.time = APP.colors.length;
        TL.actions.focusBtn();
        TL.end(APP);
        return
      }
    }
    setTimeout(() => {
      TL.actions.renderCells(e + TL.speed + 1, APP);
      return
    }, 20);
  }
}

// TL.update = (APP) => {
//   // const btnMargin = APP.marginTop.split("px")[0] -45;
//   // TL.buttons.time.style.width = APP.length + "px";
//   // TL.buttons.time.style.top = (btnMargin <= 5) ? 5 : btnMargin + "px";
//   TL.actions.resize(APP);
// };

export default TL;
