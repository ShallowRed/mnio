import './css/gamelist.css';
import './css/gallery.css';
import './css/canvas.css';
import './css/description.css';
import './css/switches.css';
import './css/playbar.css';
import './css/carton.css';
import './css/dataviz.css';

import APP from './js/components/gallery';

import game1 from './games/gametest1';
import game2 from './games/gametest2';
import game3 from './games/gametest3';
const games = [game1, game2, game3];

games.forEach(g => {
  const li = document.createElement('li');
  const h2 = document.createElement('h2');
  APP.list.appendChild(li);
  li.appendChild(h2);
  h2.innerHTML = "mnio.00" + g.id + ", " + g.rows + " x " + g.cols + " px";
  li.id = "game" + g.id;
  li.addEventListener("click", () => APP.init(g))
});

const cover = document.getElementById('cover');

window.addEventListener('resize', () => APP.update(), true);

window.addEventListener("orientationchange", () =>
  setTimeout(() => APP.update(), 500)
);

window.addEventListener("DOMContentLoaded", () => {
  cover.style.opacity = "0";
  setTimeout(() => cover.style.display = "none", 300);
});

document.getElementById("logo").addEventListener("click", () => {
  location.replace("https://mnio.fr");
})
