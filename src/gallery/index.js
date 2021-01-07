import './css/gamelist.css';
import './css/gallery.css';
import './css/canvas.css';
import './css/description.css';
import './css/switches.css';
import './css/playbar.css';
import './css/carton.css';
import './css/dataviz.css';

import APP from './js/components/gallery';

const list = document.getElementById('list');

const N_GAMES = 3;

for (var i = 0; i <= N_GAMES; i++) {
  createGameButton(++i);
}

function createGameButton(number) {
  const gameData = require(
    `../../srv/data/games.min/game.min.${number}.json`)
  const button = createButton(gameData);
  button.addEventListener("click", () =>
    requestGame(gameData.id)
  );
}

function createButton({ id, rows, cols }) {
  const button = document.createElement('button');
  button.type = "submit";
  button.innerHTML = `mnio.00${id}, ${rows} x ${cols} px`;
  list.appendChild(button);
  button.id = `game${id}`;
  return button;
}

function requestGame(id) {
  const requestGameData = new XMLHttpRequest();
  requestGameData.open('PUT', '/game');
  requestGameData.setRequestHeader('Content-Type', 'application/json');
  requestGameData.onload = () => onJsonLoad(requestGameData);

  window.addEventListener('popstate', function(event) {
    window.location.replace("../gallery")
  }, false);

  requestGameData.send(JSON.stringify({ id }));
}

function onJsonLoad(requestGameData) {
  if (requestGameData.status === 200) {
    const res = JSON.parse(requestGameData.responseText);
    APP.init(res);
    window.history.pushState({
      "pageTitle": res.id
    }, "", "/gallery/mnio" + res.id);
  }
};

(() => {

  const cover = document.getElementById('cover');

  window.addEventListener('resize', () =>
    APP.update(), true
  );

  window.addEventListener("orientationchange", () =>
    setTimeout(() =>
      APP.update(), 500
    )
  );

  window.addEventListener("DOMContentLoaded", () => {
    cover.style.opacity = "0";
    setTimeout(() =>
      cover.style.display = "none", 200
    );
  });

  document.getElementById("logo")
    .addEventListener("click", () =>
      window.location.replace("../")
    )
})();
