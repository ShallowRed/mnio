import './css/gallery.css';
import './css/buttons.css';
import './css/dataviz.css';

import GAME from './games/game1';

import APP from './js/controlers/render';

APP.init(GAME);

const cover = document.getElementById('cover');

window.addEventListener("DOMContentLoaded", () => {
  cover.style.opacity = "0";
  setTimeout(() => cover.style.display = "none", 300);
});

// TODO: clean admin page
// TODO: gallery clean positions and click Events
// TODO: interactive bars and donut (get result on canvas)
// TODO: onglets resultat/timelapse/insights
