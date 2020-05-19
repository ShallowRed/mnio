import Events from '../models/events';
import update from './update';
import render from './render';

const APP = {
  buttons: {},
  time: 0,
  speed: 20,
  play: false,
  update: update,
  render: render,
  dvflag: false
};

APP.init = (GAME) => {
  Object.keys(GAME).forEach(p => APP[p] = GAME[p]);
  APP.canvas = document.getElementById('canvas');
  APP.ctx = APP.canvas.getContext('2d');
  APP.ctx.imageSmoothingEnabled = false;
  APP.buttons.window = document.getElementById('buttons');
  APP.buttons.time = document.getElementById("timeBtns");
  document.querySelectorAll('button').forEach(btn => {
    btn.style.filter = "saturate(0%)";
    APP.buttons[btn.id] = btn;
  });
  Events.init(APP);
  APP.update(APP);
};

export default APP;
