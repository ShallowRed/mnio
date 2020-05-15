import Events from '../models/events';
import update from './update';

const APP = {
  buttons: {},
  time: 0,
  speed: 20,
  play: false,
  update: update,
  dvflag: false
};

APP.init = (GAME) => {
  Object.keys(GAME).forEach(p => APP[p] = GAME[p]);
  APP.switch = {
    TL: document.getElementById("switchTL"),
    DV: document.getElementById("switchDV")
  };
  APP.canvas = document.getElementById('canvas');
  APP.canvas2 = document.getElementById('canvas2');
  APP.ctx = APP.canvas.getContext('2d');
  APP.ctx2 = APP.canvas2.getContext('2d');
  APP.ctx.imageSmoothingEnabled = false;
  APP.ctx2.imageSmoothingEnabled = false;
  APP.buttons.window = document.getElementById('buttons');
  APP.buttons.time = document.getElementById("timeBtns");
  APP.dataviz = document.getElementById("dataviz");
  document.querySelectorAll('button').forEach(btn => {
    btn.style.filter = "saturate(0%)";
    APP.buttons[btn.id] = btn;
  });
  Events.init(APP);
  APP.update(APP);
};

export default APP;
