const APP = {
  buttons: {},
  time: 0,
  speed: 20,
  play: false
};

APP.init = (GAME) => {
  console.log(GAME);
  Object.keys(GAME).forEach(p => APP[p] = GAME[p]);
  APP.canvas = document.getElementById('canvas');
  APP.ctx = APP.canvas.getContext('2d');
  APP.ctx.imageSmoothingEnabled = false;
  APP.buttons.window = document.getElementById('buttons');
  document.querySelectorAll('#buttons button').forEach(btn => {
    btn.style.filter = "saturate(0%)";
    APP.buttons[btn.id] = btn;
  });
  Events.init();
  APP.update();
  stats();
};

APP.update = () => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  APP.length = (w < h) ? Math.round(w * 0.9) : Math.round(h * 0.8);
  APP.CellSize = Math.round(APP.length / APP.rows);
  APP.canvas.width = APP.canvas.height = APP.CellSize * APP.rows;
  APP.canvas.style.marginTop = (h - APP.canvas.height) / 2 + "px";
  APP.canvas.style.marginLeft = (w - APP.canvas.width) / 2 + "px";
  let btnMargin = APP.canvas.style.marginTop.split("px")[0] - 60;
  APP.buttons.window.style.top = (btnMargin <= 5) ? 5 : btnMargin + "px";
};

APP.render = {

  play: (speed) => {
    if (APP.time == APP.colors.length) {
      APP.time = 0;
      APP.render.clearMap();
    }
    APP.play = true;
    APP.speed = (speed == "slow") ? 20 : 1;
    APP.render.cells(APP.time);
    APP.render.focusBtn(speed);
  },

  stop: () => {
    APP.play = false;
    APP.render.focusBtn();
    APP.render.clearMap();
  },

  focusBtn: (btn) => {
    ["slow", "fast", "pause"].forEach(prop => {
      let button = APP.buttons[prop];
      let saturation = (btn == prop) ? 100 : 0;
      button.style.filter = "saturate(" + saturation + "%)";
    })
  },

  resize: () => {
    APP.render.focusBtn();

    // setPlayPause(0, 0, 0);
    APP.update();
    if (APP.time !== APP.colors.length || APP.play) {
      APP.render.clearMap();
      APP.time = 0;
      APP.play = false;
    } else APP.render.all();
  },

  all: (first) => {
    let end = first ? first : APP.order.length;
    for (let i = 0; i < end; i++) {
      CELL.fill(APP.order[i], APP.palette[APP.colors[i]])
    }
  },

  clearMap: () => {
    APP.ctx.clearRect(0, 0, APP.canvas.width, APP.canvas.height);
  },

  cells: (i) => {
    if (!i) i = 0;
    if (!APP.play) {
      APP.time = i;
      return
    }
    CELL.fill(APP.order[i], APP.palette[APP.colors[i]]);
    if (i == APP.colors.length) {
      APP.time = APP.colors.length;
      return
    }
    setTimeout(() => {
      APP.render.cells(i + 1);
      return
    }, APP.speed);
  }
}

const Events = {

  init: () => {
    Object.keys(Events.click).forEach(prop => {
      let evtBtn = APP.buttons[prop];
      evtBtn.addEventListener("click", () => Events.click[prop]())
    });
    Events.window();
  },

  click: {

    slow: () => APP.render.play("slow"),

    fast: () => APP.render.play("fast"),

    pause: () => {
      APP.play = false;
      APP.render.focusBtn("pause");
    },

    end: () => {
      APP.render.stop();
      APP.render.all();
      setTimeout(() => {
        APP.time = APP.colors.length;
      }, 50)
    },

    reset: () => {
      APP.render.stop();
      APP.time = 0;
    }
  },

  window: () => {
    window.addEventListener('resize', () => APP.render.resize(), true);
    window.addEventListener("orientationchange", () =>
      setTimeout(() => APP.render.resize(), 500)
    );
  }
}

const CELL = {

  fill: (position, color) => {
    let coordx = (position - (position % APP.rows)) / APP.cols;
    let coordy = (position % APP.cols);
    APP.ctx.fillStyle = "#" + color;
    APP.ctx.fillRect(APP.CellSize * coordy, APP.CellSize * coordx, APP.CellSize, APP.CellSize)
  },

  clear: (position) => {
    let coordx = (position - (position % APP.rows)) / APP.cols;
    let coordy = (position % APP.cols);
    APP.ctx.clearRect(APP.CellSize * coordy, APP.CellSize * coordx, APP.CellSize, APP.CellSize);
  }

}


const stats = () => {

  APP.count.forEach((e, i) => {
    let barHeight = e * APP.canvas.height / APP.order.length;
    if (!APP.last) APP.last = 0;
    fillBar(APP.last, barHeight, APP.palette[i])
    APP.last += barHeight;
  });
}

const fillBar = (start, end, color) => {
  APP.ctx.fillStyle = "#" + color;
  APP.ctx.fillRect(0, start, APP.canvas.width, end)
}


export default APP;
