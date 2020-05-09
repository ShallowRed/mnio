import './gallery.css';

import GAME from './games/game1';

import APP from './js/timelapse';

import './js/dataviz';

GAME.count = GAME.palette.map(e => 0);

GAME.colors.forEach(e => GAME.count[e]++);

APP.init(GAME);

const cover = document.getElementById('cover');

window.addEventListener("DOMContentLoaded", () => {
  cover.style.opacity = "0";
  setTimeout(() => cover.style.display = "none", 300);
});

document.getElementById("dataviz").style.display = "none";
