import './css/gallery.css';
import './css/buttons.css';

import GAME from './games/game1';

import APP from './js/controlers/init';

APP.init(GAME);

const cover = document.getElementById('cover');

window.addEventListener("DOMContentLoaded", () => {
  cover.style.opacity = "0";
  setTimeout(() => cover.style.display = "none", 300);
});
