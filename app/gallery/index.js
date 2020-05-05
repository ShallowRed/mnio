import GAME from './game1'
import './gallery.css'

GAME.rows = 150;
GAME.cols = 150;

const APP = {
  buttons: {}
};

APP.init = function() {
  APP.canvas = document.getElementById('canvas');
  APP.ctx = APP.canvas.getContext('2d');
  APP.ctx.imageSmoothingEnabled = false;
  APP.time = 0;
  APP.speed = 20;
  APP.play = false;
  APP.buttons.window = document.getElementById('buttons');

  document.querySelectorAll('#buttons button').forEach(btn => {
    btn.style.filter = "saturate(0%)";
    APP.buttons[btn.id] = btn;
  });

  APP.buttons.reset.addEventListener("click", () => {
    APP.buttons.slow.style.filter = "saturate(0%)";
    APP.buttons.fast.style.filter = "saturate(0%)";
    APP.buttons.pause.style.filter = "saturate(0%)";
    APP.time = 0;
    APP.play = false;
    clearmap();
  })

  APP.buttons.slow.addEventListener("click", () => {
    if (APP.time == GAME.colors.length) {
      clearmap();
      APP.time = 0;
    }
    APP.play = true;
    APP.speed = 20;
    rendercells(APP.time);
    document.querySelectorAll('#buttons button').forEach(btn => btn.style.filter = "saturate(0%)");
    APP.buttons.slow.style.filter = "saturate(100%)";
    APP.buttons.fast.style.filter = "saturate(0%)";
    APP.buttons.pause.style.filter = "saturate(0%)";
  })

  APP.buttons.fast.addEventListener("click", () => {
    if (APP.time == GAME.colors.length) {
      clearmap();
      APP.time = 0;
    }
    APP.play = true;
    APP.speed = 1;
    rendercells(APP.time);
    APP.buttons.slow.style.filter = "saturate(0%)";
    APP.buttons.fast.style.filter = "saturate(100%)";
    APP.buttons.pause.style.filter = "saturate(0%)";
  })

  APP.buttons.pause.addEventListener("click", () => {
    APP.play = false;
    APP.buttons.slow.style.filter = "saturate(0%)";
    APP.buttons.fast.style.filter = "saturate(0%)";
    APP.buttons.pause.style.filter = "saturate(100%)";
  })

  APP.buttons.end.addEventListener("click", () => {
    APP.buttons.slow.style.filter = "saturate(0%)";
    APP.buttons.fast.style.filter = "saturate(0%)";
    APP.buttons.pause.style.filter = "saturate(0%)";
    APP.play = false;
    clearmap();
    renderall();
    setTimeout(() => {
      APP.time = GAME.colors.length;
    }, 50)
  })

  window.addEventListener('resize', () => resizing(), true);

  window.addEventListener("orientationchange", () =>
    setTimeout(() => resizing(), 500)
  );

  APP.update();
};

function resizing() {
  APP.buttons.slow.style.filter = "saturate(0%)";
  APP.buttons.fast.style.filter = "saturate(0%)";
  APP.buttons.pause.style.filter = "saturate(0%)";
  APP.update();
  if (APP.time !== GAME.colors.length || APP.play) {
    clearmap();
    APP.time = 0;
    APP.play = false;
  } else renderall();
}


APP.update = () => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  APP.length = (w < h) ? Math.round(w * 0.9) : Math.round(h * 0.8);
  APP.CellSize = Math.round(APP.length / GAME.rows);
  APP.canvas.width = APP.canvas.height = APP.CellSize * GAME.rows;
  APP.canvas.style.marginTop = (h - APP.canvas.height) / 2 + "px";
  APP.canvas.style.marginLeft = (w - APP.canvas.width) / 2 + "px";
  // APP.buttons.window.style.top =  (w < h) ? APP.canvas.style.marginTop.split("px")[0] - 60 + "px" : "15px";

  APP.buttons.window.style.top = APP.canvas.style.marginTop.split("px")[0] - 60 + "px";
};

function renderall(first) {
  let end = first ? first : GAME.order.length;
  for (let i = 0; i < end; i++) {
    CELL.fill(GAME.order[i], GAME.colors[i])
  }
}

function clearmap() {
  APP.ctx.clearRect(0, 0, APP.canvas.width, APP.canvas.height);
}

function rendercells(index) {
  if (!index) index = 0;
  if (!APP.play) {
    APP.time = index;
    return
  }
  CELL.fill(GAME.order[index], GAME.colors[index]);
  if (index == GAME.colors.length) {
    APP.time = GAME.colors.length;
    return
  }
  setTimeout(() => {
    rendercells(index + 1);
    return
  }, APP.speed);
}

const CELL = {

  fill: (position, color) => {
    let coordx = (position - (position % GAME.rows)) / GAME.cols;
    let coordy = (position % GAME.cols);
    // APP.ctx.clearRect(APP.CellSize * coordy, APP.CellSize * coordx, APP.CellSize, APP.CellSize);
    APP.ctx.fillStyle = color;
    APP.ctx.fillRect(APP.CellSize * coordy, APP.CellSize * coordx, APP.CellSize, APP.CellSize)
  },

  clear: (position) => {
    let coordx = (position - (position % GAME.rows)) / GAME.cols;
    let coordy = (position % GAME.cols);
    APP.ctx.clearRect(APP.CellSize * coordy, APP.CellSize * coordx, APP.CellSize, APP.CellSize);
  }

}

APP.init();
const cover = document.getElementById('cover');
window.addEventListener("DOMContentLoaded", () => {
  cover.style.opacity = "0";
  setTimeout(() => cover.style.display = "none", 300);
});
