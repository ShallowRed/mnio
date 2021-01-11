import './css/gamelist.css';
import './css/gallery.css';
import './css/canvas.css';
import './css/description.css';
import './css/switches.css';
import './css/playbar.css';
import './css/carton.css';
import './css/dataviz.css';

import APP from './js/components/gallery';
import createGameButton from './js/gameButton';

const N_GAMES = 3;

function callback(requestGameData) {
  if (requestGameData.status === 200) {
    const response = JSON.parse(requestGameData.responseText);
    APP.init(response);
    window.history.pushState({ "pageTitle": response.id }, "", "/gallery/mnio" +
      response.id);
  }
}

for (let i = 1; i <= N_GAMES; i++) {
  createGameButton(i, callback);
}

window.addEventListener('resize', APP.update, true);

window.addEventListener("orientationchange", () => {
  setTimeout(APP.update, 500)
});

window.addEventListener("DOMContentLoaded", () => {
  const cover = document.getElementById('cover');
  cover.style.opacity = "0";
  setTimeout(() => {
    cover.style.display = "none"
  }, 200);
});

document.getElementById("logo")
  .addEventListener("click", () =>
    window.location.replace("../")
  )
