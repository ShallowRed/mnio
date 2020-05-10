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
  APP.canvas = document.getElementById('canvas');
  APP.ctx = APP.canvas.getContext('2d');
  APP.ctx.imageSmoothingEnabled = false;
  APP.buttons.window = document.getElementById('buttons');
  APP.dataviz = document.getElementById("dataviz");
  document.querySelectorAll('#buttons button').forEach(btn => {
    btn.style.filter = "saturate(0%)";
    APP.buttons[btn.id] = btn;
  });
  Events.init(APP);
  APP.update(APP);
};

export default APP;
