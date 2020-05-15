import './css/gallery.css';
import './css/buttons.css';
import './css/dataviz.css';

import GAME from './games/game1';

import APP from './js/controlers/render';

APP.init(GAME);
APP.render.all();

const cover = document.getElementById('cover');

window.addEventListener("DOMContentLoaded", () => {
  cover.style.opacity = "0";
  setTimeout(() => cover.style.display = "none", 300);
});

// TODO: fix broken play mode
// TODO: fix broken colors displaying on donut chart
